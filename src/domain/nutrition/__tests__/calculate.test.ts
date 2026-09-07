import { describe, expect, it } from "vitest";

import type {
  INutritionIngredient,
  INutritionParams,
  INutritionProduct,
  INutritionVariant,
} from "@/domain/nutrition";
import {
  buildSnapshot,
  calculateNutrition,
  resolveIngredients,
  scaleAmount,
} from "@/domain/nutrition";

const FLOUR: INutritionProduct = { id: "p-flour", name: "Мука", activeVariantId: "v-flour" };
const OIL: INutritionProduct = { id: "p-oil", name: "Масло", activeVariantId: "v-oil" };
const SALT: INutritionProduct = { id: "p-salt", name: "Соль", activeVariantId: null };
const SUGAR: INutritionProduct = { id: "p-sugar", name: "Сахар", activeVariantId: "v-sugar" };

const PRODUCTS = [FLOUR, OIL, SALT, SUGAR];

const VARIANTS: INutritionVariant[] = [
  { id: "v-flour", name: null, kcal100: 100, protein100: 10, fat100: 1, carbs100: 20 },
  {
    id: "v-flour-whole",
    name: "Цельнозерновая",
    kcal100: 200,
    protein100: 20,
    fat100: 2,
    carbs100: 40,
  },
  { id: "v-oil", name: "Оливковое", kcal100: 900, protein100: 0, fat100: 100, carbs100: 0 },
  // Углеводы не заполнены: продукт завели быстро, цифры дописать не успели.
  { id: "v-sugar", name: null, kcal100: 400, protein100: 0, fat100: 0, carbs100: null },
];

function makeIngredient(
  productId: string,
  amountGrams: number,
  extra: Partial<INutritionIngredient> = {},
): INutritionIngredient {
  return {
    id: `i-${productId}`,
    productId,
    pinnedVariantId: null,
    amountGrams,
    isOptional: false,
    ...extra,
  };
}

function resolve(ingredients: INutritionIngredient[]) {
  return resolveIngredients(ingredients, PRODUCTS, VARIANTS);
}

function makeParams(extra: Partial<INutritionParams> = {}): INutritionParams {
  return { servingsBase: 1, yieldGrams: null, overrides: {}, ...extra };
}

/** 200 г муки на активном варианте: total = { kcal: 200, protein: 20, fat: 2, carbs: 40 }. */
function flourOnly() {
  return resolve([makeIngredient("p-flour", 200)]);
}

describe("resolveIngredients — правило 1: какой вариант берётся", () => {
  it("берёт закреплённый вариант, когда он задан", () => {
    const [ingredient] = resolve([
      makeIngredient("p-flour", 100, { pinnedVariantId: "v-flour-whole" }),
    ]);

    expect(ingredient.variantId).toBe("v-flour-whole");
    expect(ingredient.variantName).toBe("Цельнозерновая");
    expect(ingredient.isPinned).toBe(true);
    expect(ingredient.nutrientsPer100).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
  });

  it("берёт активный вариант продукта, когда закреплённого нет", () => {
    const [ingredient] = resolve([makeIngredient("p-flour", 100)]);

    expect(ingredient.variantId).toBe("v-flour");
    expect(ingredient.variantName).toBeNull();
    expect(ingredient.isPinned).toBe(false);
    expect(ingredient.nutrientsPer100).toEqual({ kcal: 100, protein: 10, fat: 1, carbs: 20 });
  });

  it("оставляет КБЖУ пустым, если активного варианта у продукта нет", () => {
    const [ingredient] = resolve([makeIngredient("p-salt", 10)]);

    expect(ingredient.variantId).toBeNull();
    expect(ingredient.variantName).toBeNull();
    expect(ingredient.nutrientsPer100).toBeNull();
  });

  it("оставляет КБЖУ пустым, если у варианта заполнены не все четыре поля", () => {
    const [ingredient] = resolve([makeIngredient("p-sugar", 50)]);

    expect(ingredient.variantId).toBe("v-sugar");
    expect(ingredient.nutrientsPer100).toBeNull();
  });

  it("падает на ссылке в отсутствующий продукт, а не подставляет ноль", () => {
    expect(() => resolve([makeIngredient("p-unknown", 10)])).toThrowError(
      "Ингредиент i-p-unknown ссылается на продукт p-unknown, которого нет в переданном наборе",
    );
  });

  it("падает на ссылке в отсутствующий вариант", () => {
    expect(() =>
      resolve([makeIngredient("p-flour", 10, { pinnedVariantId: "v-unknown" })]),
    ).toThrowError(
      "Ингредиент i-p-flour ссылается на вариант v-unknown, которого нет в переданном наборе",
    );
  });
});

describe("calculateNutrition", () => {
  describe("правила 2 и 3 — опциональный ингредиент и вес сырья", () => {
    it("не входит ни в вес сырья, ни в КБЖУ", () => {
      const resolved = resolve([
        makeIngredient("p-flour", 200),
        makeIngredient("p-oil", 50, { isOptional: true }),
      ]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(200);
      expect(result.total).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
    });

    it("тот же ингредиент без флага входит в оба", () => {
      const resolved = resolve([makeIngredient("p-flour", 200), makeIngredient("p-oil", 50)]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(250);
      expect(result.total).toEqual({ kcal: 650, protein: 20, fat: 52, carbs: 40 });
    });
  });

  describe("правило 4 — делитель для «на 100 г»", () => {
    it("при заданном yield_grams делитель — он, basis = yield", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ yieldGrams: 400 }));

      expect(result.basis).toBe("yield");
      expect(result.per100g).toEqual({ kcal: 50, protein: 5, fat: 0.5, carbs: 10 });
    });

    it("без yield_grams делитель — вес сырья, basis = rawWeight", () => {
      const result = calculateNutrition(flourOnly(), makeParams());

      expect(result.basis).toBe("rawWeight");
      expect(result.per100g).toEqual({ kcal: 100, protein: 10, fat: 1, carbs: 20 });
    });

    it("yield_grams = 0 равносилен незаданному", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ yieldGrams: 0 }));

      expect(result.basis).toBe("rawWeight");
      expect(result.per100g).toEqual({ kcal: 100, protein: 10, fat: 1, carbs: 20 });
      expect(result.yieldGrams).toBe(0);
    });
  });

  describe("правило 5 — на порцию", () => {
    it("perServing = total / servingsBase", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ servingsBase: 4 }));

      expect(result.perServing).toEqual({ kcal: 50, protein: 5, fat: 0.5, carbs: 10 });
    });
  });

  describe("правило 6 — продукты без КБЖУ", () => {
    it("дают вклад 0 и попадают в incompleteProducts, а не в тихий ноль", () => {
      const resolved = resolve([makeIngredient("p-flour", 200), makeIngredient("p-salt", 10)]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(210);
      expect(result.total).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
      expect(result.incompleteProducts).toEqual([{ productId: "p-salt", productName: "Соль" }]);
    });

    it("вариант с одним незаполненным полем попадает туда же", () => {
      const resolved = resolve([makeIngredient("p-sugar", 50)]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.total).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(result.incompleteProducts).toEqual([{ productId: "p-sugar", productName: "Сахар" }]);
    });

    it("один продукт перечислен один раз, сколько бы строк состава он ни занимал", () => {
      const resolved = resolve([
        makeIngredient("p-salt", 10, { id: "i-salt-1" }),
        makeIngredient("p-salt", 5, { id: "i-salt-2" }),
      ]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.incompleteProducts).toEqual([{ productId: "p-salt", productName: "Соль" }]);
    });

    it("опциональный ингредиент без КБЖУ в список не попадает — он и в сумму не входит", () => {
      const resolved = resolve([
        makeIngredient("p-flour", 200),
        makeIngredient("p-salt", 10, { isOptional: true }),
      ]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.incompleteProducts).toEqual([]);
    });
  });

  describe("правило 7 — override на уровне «на 100 г»", () => {
    it("частичный override переопределяет только своё поле и попадает в overriddenFields", () => {
      const result = calculateNutrition(
        flourOnly(),
        makeParams({ servingsBase: 2, overrides: { kcal: 150 } }),
      );

      expect(result.overriddenFields).toEqual(["kcal"]);
      expect(result.per100g).toEqual({ kcal: 150, protein: 10, fat: 1, carbs: 20 });
      expect(result.total).toEqual({ kcal: 300, protein: 20, fat: 2, carbs: 40 });
      expect(result.perServing).toEqual({ kcal: 150, protein: 10, fat: 1, carbs: 20 });
    });

    it("без override итог — обычная сумма", () => {
      const result = calculateNutrition(flourOnly(), makeParams());

      expect(result.overriddenFields).toEqual([]);
      expect(result.total).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
    });

    it("работает и на базисе yield", () => {
      const result = calculateNutrition(
        flourOnly(),
        makeParams({ yieldGrams: 400, overrides: { kcal: 60 } }),
      );

      expect(result.basis).toBe("yield");
      expect(result.per100g).toEqual({ kcal: 60, protein: 5, fat: 0.5, carbs: 10 });
      expect(result.total).toEqual({ kcal: 240, protein: 20, fat: 2, carbs: 40 });
    });

    it("overriddenFields перечислены в каноническом порядке, а не в порядке ввода", () => {
      const result = calculateNutrition(
        flourOnly(),
        makeParams({ overrides: { carbs: 5, kcal: 150 } }),
      );

      expect(result.overriddenFields).toEqual(["kcal", "carbs"]);
    });
  });

  describe("правило 8 — краевые случаи", () => {
    it("пустой список ингредиентов не даёт деления на ноль", () => {
      const result = calculateNutrition([], makeParams({ servingsBase: 4 }));

      expect(result.rawWeightGrams).toBe(0);
      expect(result.basis).toBe("rawWeight");
      expect(result.total).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(result.per100g).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(result.perServing).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(Object.values(result.per100g).every(Number.isFinite)).toBe(true);
    });

    it("состав целиком из опциональных ингредиентов ведёт себя так же", () => {
      const resolved = resolve([makeIngredient("p-flour", 200, { isOptional: true })]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(0);
      expect(result.per100g).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(Object.values(result.per100g).every(Number.isFinite)).toBe(true);
    });

    it("override при нулевом весе даёт КБЖУ на 100 г, но нулевой итог", () => {
      const result = calculateNutrition([], makeParams({ overrides: { kcal: 120 } }));

      expect(result.per100g.kcal).toBe(120);
      expect(result.total.kcal).toBe(0);
      expect(Number.isFinite(result.total.kcal)).toBe(true);
    });

    it("servingsBase не больше нуля — нарушен контракт, исключение", () => {
      expect(() => calculateNutrition(flourOnly(), makeParams({ servingsBase: 0 }))).toThrowError(
        "servingsBase должен быть больше нуля, получено 0",
      );
    });
  });

  describe("правило 9 — округления в модуле нет", () => {
    it("на порцию число остаётся сырым", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ servingsBase: 3 }));

      expect(result.perServing.kcal).toBe(200 / 3);
      expect(Number.isInteger(result.perServing.kcal)).toBe(false);
    });

    it("на 100 г число остаётся сырым", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ yieldGrams: 300 }));

      expect(result.per100g.kcal).toBe((200 / 300) * 100);
      expect(Number.isInteger(result.per100g.kcal)).toBe(false);
    });
  });
});

describe("buildSnapshot", () => {
  it("замораживает расчёт, число порций и состав, включая опциональные строки", () => {
    const resolved = resolve([
      makeIngredient("p-flour", 200),
      makeIngredient("p-oil", 50, { isOptional: true }),
    ]);
    const nutrition = calculateNutrition(resolved, makeParams({ servingsBase: 2 }));

    const snapshot = buildSnapshot(nutrition, resolved, 2);

    expect(snapshot.version).toBe(1);
    expect(snapshot.servingsBase).toBe(2);
    expect(snapshot.nutrition).toBe(nutrition);
    expect(snapshot.ingredients).toEqual([
      {
        productId: "p-flour",
        productName: "Мука",
        variantId: "v-flour",
        variantName: null,
        amountGrams: 200,
        isOptional: false,
      },
      {
        productId: "p-oil",
        productName: "Масло",
        variantId: "v-oil",
        variantName: "Оливковое",
        amountGrams: 50,
        isOptional: true,
      },
    ]);
  });
});

describe("scaleAmount", () => {
  it("умножает граммовку на множитель", () => {
    expect(scaleAmount(200, 1.5)).toBe(300);
  });

  it("не округляет результат", () => {
    expect(scaleAmount(100, 1 / 3)).toBe(100 * (1 / 3));
    expect(Number.isInteger(scaleAmount(100, 1 / 3))).toBe(false);
  });
});
