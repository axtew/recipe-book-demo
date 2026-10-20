import { describe, expect, it } from "vitest";

import type { IProduct } from "@/types/products.types";
import type { IDishCategory, IRecipe } from "@/types/recipes.types";

import { buildListItems, filterListItems, groupListItems } from "./_helpers";
import type { IRecipeListItem } from "./_types";

function createRecipe(overrides: Partial<IRecipe> & { id: string }): IRecipe {
  return {
    archivedAt: null,
    carbs100Override: null,
    cookTimeMin: null,
    dishCategoryIds: [],
    fat100Override: null,
    freezable: false,
    freezerDays: null,
    fridgeDays: null,
    ingredients: [],
    kcal100Override: null,
    name: overrides.id,
    notes: null,
    photoPath: null,
    photoUrl: null,
    protein100Override: null,
    servingsBase: 1,
    steps: [],
    videoUrls: [],
    yieldGrams: null,
    ...overrides,
  };
}

function createItem(overrides: Partial<IRecipe> & { id: string }): IRecipeListItem {
  return {
    recipe: createRecipe(overrides),
    searchTexts: [overrides.id],
    kcal100: null,
    isNutritionIncomplete: false,
  };
}

const categories: IDishCategory[] = [
  { id: "dessert", name: "Десерты", sortOrder: 2 },
  { id: "breakfast", name: "Завтраки", sortOrder: 1 },
  { id: "empty", name: "Пустая", sortOrder: 3 },
];

describe("filterListItems", () => {
  const items = [
    createItem({ id: "a", cookTimeMin: 10, freezable: true }),
    createItem({ id: "b", cookTimeMin: 45, freezable: true }),
    createItem({ id: "c", cookTimeMin: 90, freezable: false }),
    createItem({ id: "d", cookTimeMin: null, freezable: true }),
  ];

  const ids = (found: IRecipeListItem[]) => found.map(({ recipe }) => recipe.id);

  it("фильтры сочетаются по «и»", () => {
    expect(ids(filterListItems(items, { freezable: true, time: "upTo60" }))).toEqual(["a", "b"]);
  });

  it("границы времени: до 15, до 60 включительно, дольше 60 строго", () => {
    expect(ids(filterListItems(items, { time: "upTo15" }))).toEqual(["a"]);
    expect(ids(filterListItems(items, { time: "over60" }))).toEqual(["c"]);
  });

  it("рецепт без времени не проходит фильтр по времени", () => {
    expect(ids(filterListItems(items, { time: "over60", freezable: true }))).toEqual([]);
  });

  it("запрос сочетается с фильтрами", () => {
    expect(ids(filterListItems(items, { q: "b", freezable: true }))).toEqual(["b"]);
  });
});

describe("groupListItems", () => {
  it("рецепт попадает в каждую свою категорию, группы идут по sortOrder", () => {
    const groups = groupListItems(
      [createItem({ id: "pancakes", dishCategoryIds: ["dessert", "breakfast"] })],
      categories,
    );

    expect(groups.map(({ id }) => id)).toEqual(["breakfast", "dessert"]);
  });

  it("рецепты без категорий — в последней группе, пустые группы не создаются", () => {
    const groups = groupListItems(
      [
        createItem({ id: "x" }),
        createItem({ id: "y", dishCategoryIds: ["breakfast"] }),
        createItem({ id: "z", dishCategoryIds: ["unknown"] }),
      ],
      categories,
    );

    expect(groups.map(({ id }) => id)).toEqual(["breakfast", "uncategorized"]);
    expect(groups[1].items.map(({ recipe }) => recipe.id)).toEqual(["x", "z"]);
  });
});

describe("buildListItems", () => {
  function createProduct(id: string, name: string, kcal100: number | null): IProduct {
    return {
      id,
      name,
      activeVariantId: `${id}-variant`,
      archivedAt: null,
      categoryId: "category",
      note: null,
      variants: [
        {
          id: `${id}-variant`,
          productId: id,
          name: null,
          archivedAt: null,
          createdAt: "2026-01-01T00:00:00Z",
          isApproximate: false,
          note: null,
          source: "manual",
          kcal100,
          protein100: kcal100 === null ? null : 10,
          fat100: kcal100 === null ? null : 5,
          carbs100: kcal100 === null ? null : 20,
        },
      ],
    };
  }

  function createIngredient(productId: string, amountGrams: number) {
    return {
      id: `ingredient-${productId}`,
      recipeId: "recipe",
      productId,
      amountGrams,
      isOptional: false,
      note: null,
      pinnedVariantId: null,
      sortOrder: 0,
    };
  }

  const products = [createProduct("rice", "Рис", 200), createProduct("honey", "Мёд", null)];

  it("архивный рецепт в список не попадает", () => {
    const items = buildListItems(
      [
        createRecipe({ id: "alive" }),
        createRecipe({ id: "archived", archivedAt: "2026-02-01T00:00:00Z" }),
      ],
      products,
    );

    expect(items.map(({ recipe }) => recipe.id)).toEqual(["alive"]);
  });

  it("без веса сырья и без ручных значений ккал на 100 г нет", () => {
    const [item] = buildListItems([createRecipe({ id: "empty" })], products);

    expect(item.kcal100).toBeNull();
    expect(item.isNutritionIncomplete).toBe(false);
  });

  it("ручное значение ккал задаёт цифру и без состава", () => {
    const [item] = buildListItems([createRecipe({ id: "manual", kcal100Override: 120 })], products);

    expect(item.kcal100).toBe(120);
  });

  it("ккал на 100 г считается доменным модулем по составу", () => {
    const [item] = buildListItems(
      [createRecipe({ id: "rice", ingredients: [createIngredient("rice", 100)] })],
      products,
    );

    expect(item.kcal100).toBe(200);
    expect(item.isNutritionIncomplete).toBe(false);
  });

  it("продукт без КБЖУ помечает рецепт неполным", () => {
    const [item] = buildListItems(
      [createRecipe({ id: "honey", ingredients: [createIngredient("honey", 50)] })],
      products,
    );

    expect(item.isNutritionIncomplete).toBe(true);
  });

  it("тексты для поиска нормализованы: название рецепта и названия продуктов состава", () => {
    const [item] = buildListItems(
      [
        createRecipe({
          id: "pancakes",
          name: "Блины Ёлочкой",
          ingredients: [createIngredient("honey", 20), createIngredient("rice", 30)],
        }),
      ],
      products,
    );

    expect(item.searchTexts).toEqual(["блины елочкой", "мед", "рис"]);
  });
});
