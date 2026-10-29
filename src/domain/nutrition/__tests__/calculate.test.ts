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

const FLOUR: INutritionProduct = { id: "p-flour", name: "Flour", activeVariantId: "v-flour" };
const OIL: INutritionProduct = { id: "p-oil", name: "Oil", activeVariantId: "v-oil" };
const SALT: INutritionProduct = { id: "p-salt", name: "Salt", activeVariantId: null };
const SUGAR: INutritionProduct = { id: "p-sugar", name: "Sugar", activeVariantId: "v-sugar" };

const PRODUCTS = [FLOUR, OIL, SALT, SUGAR];

const VARIANTS: INutritionVariant[] = [
  { id: "v-flour", name: null, kcal100: 100, protein100: 10, fat100: 1, carbs100: 20 },
  {
    id: "v-flour-whole",
    name: "Wholegrain",
    kcal100: 200,
    protein100: 20,
    fat100: 2,
    carbs100: 40,
  },
  { id: "v-oil", name: "Olive", kcal100: 900, protein100: 0, fat100: 100, carbs100: 0 },
  // Carbs are not filled in: the product was added in a hurry, the numbers were not completed.
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

/** 200 g of flour on the active variant: total = { kcal: 200, protein: 20, fat: 2, carbs: 40 }. */
function flourOnly() {
  return resolve([makeIngredient("p-flour", 200)]);
}

describe("resolveIngredients — rule 1: which variant is taken", () => {
  it("takes the pinned variant when one is set", () => {
    const [ingredient] = resolve([
      makeIngredient("p-flour", 100, { pinnedVariantId: "v-flour-whole" }),
    ]);

    expect(ingredient.variantId).toBe("v-flour-whole");
    expect(ingredient.variantName).toBe("Wholegrain");
    expect(ingredient.isPinned).toBe(true);
    expect(ingredient.nutrientsPer100).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
  });

  it("takes the product's active variant when there is no pinned one", () => {
    const [ingredient] = resolve([makeIngredient("p-flour", 100)]);

    expect(ingredient.variantId).toBe("v-flour");
    expect(ingredient.variantName).toBeNull();
    expect(ingredient.isPinned).toBe(false);
    expect(ingredient.nutrientsPer100).toEqual({ kcal: 100, protein: 10, fat: 1, carbs: 20 });
  });

  it("leaves nutrition empty if the product has no active variant", () => {
    const [ingredient] = resolve([makeIngredient("p-salt", 10)]);

    expect(ingredient.variantId).toBeNull();
    expect(ingredient.variantName).toBeNull();
    expect(ingredient.nutrientsPer100).toBeNull();
  });

  it("leaves nutrition empty if the variant does not have all four fields filled", () => {
    const [ingredient] = resolve([makeIngredient("p-sugar", 50)]);

    expect(ingredient.variantId).toBe("v-sugar");
    expect(ingredient.nutrientsPer100).toBeNull();
  });

  it("throws on a reference to a missing product instead of substituting zero", () => {
    expect(() => resolve([makeIngredient("p-unknown", 10)])).toThrowError(
      "Ingredient i-p-unknown references product p-unknown, which is not in the provided set",
    );
  });

  it("throws on a reference to a missing variant", () => {
    expect(() =>
      resolve([makeIngredient("p-flour", 10, { pinnedVariantId: "v-unknown" })]),
    ).toThrowError(
      "Ingredient i-p-flour references variant v-unknown, which is not in the provided set",
    );
  });
});

describe("calculateNutrition", () => {
  describe("rules 2 and 3 — optional ingredient and raw weight", () => {
    it("counts toward neither raw weight nor nutrition", () => {
      const resolved = resolve([
        makeIngredient("p-flour", 200),
        makeIngredient("p-oil", 50, { isOptional: true }),
      ]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(200);
      expect(result.total).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
    });

    it("the same ingredient without the flag counts toward both", () => {
      const resolved = resolve([makeIngredient("p-flour", 200), makeIngredient("p-oil", 50)]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(250);
      expect(result.total).toEqual({ kcal: 650, protein: 20, fat: 52, carbs: 40 });
    });
  });

  describe("rule 4 — divisor for “per 100 g”", () => {
    it("with yield_grams set it is the divisor, basis = yield", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ yieldGrams: 400 }));

      expect(result.basis).toBe("yield");
      expect(result.per100g).toEqual({ kcal: 50, protein: 5, fat: 0.5, carbs: 10 });
    });

    it("without yield_grams the divisor is the raw weight, basis = rawWeight", () => {
      const result = calculateNutrition(flourOnly(), makeParams());

      expect(result.basis).toBe("rawWeight");
      expect(result.per100g).toEqual({ kcal: 100, protein: 10, fat: 1, carbs: 20 });
    });

    it("yield_grams = 0 is equivalent to unset", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ yieldGrams: 0 }));

      expect(result.basis).toBe("rawWeight");
      expect(result.per100g).toEqual({ kcal: 100, protein: 10, fat: 1, carbs: 20 });
      expect(result.yieldGrams).toBe(0);
    });
  });

  describe("rule 5 — per serving", () => {
    it("perServing = total / servingsBase", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ servingsBase: 4 }));

      expect(result.perServing).toEqual({ kcal: 50, protein: 5, fat: 0.5, carbs: 10 });
    });
  });

  describe("rule 6 — products without nutrition", () => {
    it("contribute 0 and land in incompleteProducts instead of a silent zero", () => {
      const resolved = resolve([makeIngredient("p-flour", 200), makeIngredient("p-salt", 10)]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(210);
      expect(result.total).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
      expect(result.incompleteProducts).toEqual([{ productId: "p-salt", productName: "Salt" }]);
    });

    it("a variant with one unfilled field lands there too", () => {
      const resolved = resolve([makeIngredient("p-sugar", 50)]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.total).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(result.incompleteProducts).toEqual([{ productId: "p-sugar", productName: "Sugar" }]);
    });

    it("one product is listed once, however many ingredient rows it takes", () => {
      const resolved = resolve([
        makeIngredient("p-salt", 10, { id: "i-salt-1" }),
        makeIngredient("p-salt", 5, { id: "i-salt-2" }),
      ]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.incompleteProducts).toEqual([{ productId: "p-salt", productName: "Salt" }]);
    });

    it("an optional ingredient without nutrition is not listed — it is not in the sum either", () => {
      const resolved = resolve([
        makeIngredient("p-flour", 200),
        makeIngredient("p-salt", 10, { isOptional: true }),
      ]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.incompleteProducts).toEqual([]);
    });
  });

  describe("rule 7 — override at the “per 100 g” level", () => {
    it("a partial override replaces only its own field and lands in overriddenFields", () => {
      const result = calculateNutrition(
        flourOnly(),
        makeParams({ servingsBase: 2, overrides: { kcal: 150 } }),
      );

      expect(result.overriddenFields).toEqual(["kcal"]);
      expect(result.per100g).toEqual({ kcal: 150, protein: 10, fat: 1, carbs: 20 });
      expect(result.total).toEqual({ kcal: 300, protein: 20, fat: 2, carbs: 40 });
      expect(result.perServing).toEqual({ kcal: 150, protein: 10, fat: 1, carbs: 20 });
    });

    it("without an override the total is the plain sum", () => {
      const result = calculateNutrition(flourOnly(), makeParams());

      expect(result.overriddenFields).toEqual([]);
      expect(result.total).toEqual({ kcal: 200, protein: 20, fat: 2, carbs: 40 });
    });

    it("works on the yield basis too", () => {
      const result = calculateNutrition(
        flourOnly(),
        makeParams({ yieldGrams: 400, overrides: { kcal: 60 } }),
      );

      expect(result.basis).toBe("yield");
      expect(result.per100g).toEqual({ kcal: 60, protein: 5, fat: 0.5, carbs: 10 });
      expect(result.total).toEqual({ kcal: 240, protein: 20, fat: 2, carbs: 40 });
    });

    it("overriddenFields are listed in canonical order, not in input order", () => {
      const result = calculateNutrition(
        flourOnly(),
        makeParams({ overrides: { carbs: 5, kcal: 150 } }),
      );

      expect(result.overriddenFields).toEqual(["kcal", "carbs"]);
    });
  });

  describe("rule 8 — edge cases", () => {
    it("an empty ingredient list does not divide by zero", () => {
      const result = calculateNutrition([], makeParams({ servingsBase: 4 }));

      expect(result.rawWeightGrams).toBe(0);
      expect(result.basis).toBe("rawWeight");
      expect(result.total).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(result.per100g).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(result.perServing).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(Object.values(result.per100g).every(Number.isFinite)).toBe(true);
    });

    it("a composition made only of optional ingredients behaves the same", () => {
      const resolved = resolve([makeIngredient("p-flour", 200, { isOptional: true })]);

      const result = calculateNutrition(resolved, makeParams());

      expect(result.rawWeightGrams).toBe(0);
      expect(result.per100g).toEqual({ kcal: 0, protein: 0, fat: 0, carbs: 0 });
      expect(Object.values(result.per100g).every(Number.isFinite)).toBe(true);
    });

    it("an override at zero weight gives nutrition per 100 g but a zero total", () => {
      const result = calculateNutrition([], makeParams({ overrides: { kcal: 120 } }));

      expect(result.per100g.kcal).toBe(120);
      expect(result.total.kcal).toBe(0);
      expect(Number.isFinite(result.total.kcal)).toBe(true);
    });

    it("servingsBase not above zero — contract violated, throws", () => {
      expect(() => calculateNutrition(flourOnly(), makeParams({ servingsBase: 0 }))).toThrowError(
        "servingsBase must be greater than zero, got 0",
      );
    });
  });

  describe("rule 9 — the module does no rounding", () => {
    it("the per-serving number stays raw", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ servingsBase: 3 }));

      expect(result.perServing.kcal).toBe(200 / 3);
      expect(Number.isInteger(result.perServing.kcal)).toBe(false);
    });

    it("the per-100 g number stays raw", () => {
      const result = calculateNutrition(flourOnly(), makeParams({ yieldGrams: 300 }));

      expect(result.per100g.kcal).toBe((200 / 300) * 100);
      expect(Number.isInteger(result.per100g.kcal)).toBe(false);
    });
  });
});

describe("buildSnapshot", () => {
  it("freezes the calculation, servings and composition, optional rows included", () => {
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
        productName: "Flour",
        variantId: "v-flour",
        variantName: null,
        amountGrams: 200,
        isOptional: false,
      },
      {
        productId: "p-oil",
        productName: "Oil",
        variantId: "v-oil",
        variantName: "Olive",
        amountGrams: 50,
        isOptional: true,
      },
    ]);
  });
});

describe("scaleAmount", () => {
  it("multiplies the gram amount by the multiplier", () => {
    expect(scaleAmount(200, 1.5)).toBe(300);
  });

  it("does not round the result", () => {
    expect(scaleAmount(100, 1 / 3)).toBe(100 * (1 / 3));
    expect(Number.isInteger(scaleAmount(100, 1 / 3))).toBe(false);
  });
});
