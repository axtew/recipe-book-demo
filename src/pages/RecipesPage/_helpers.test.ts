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
  { id: "dessert", name: "Desserts", sortOrder: 2 },
  { id: "breakfast", name: "Breakfasts", sortOrder: 1 },
  { id: "empty", name: "Empty", sortOrder: 3 },
];

describe("filterListItems", () => {
  const items = [
    createItem({ id: "a", cookTimeMin: 10, freezable: true }),
    createItem({ id: "b", cookTimeMin: 45, freezable: true }),
    createItem({ id: "c", cookTimeMin: 90, freezable: false }),
    createItem({ id: "d", cookTimeMin: null, freezable: true }),
  ];

  const ids = (found: IRecipeListItem[]) => found.map(({ recipe }) => recipe.id);

  it("filters combine with AND", () => {
    expect(ids(filterListItems(items, { freezable: true, time: "upTo60" }))).toEqual(["a", "b"]);
  });

  it("time bounds: up to 15, up to 60 inclusive, longer than 60 strictly", () => {
    expect(ids(filterListItems(items, { time: "upTo15" }))).toEqual(["a"]);
    expect(ids(filterListItems(items, { time: "over60" }))).toEqual(["c"]);
  });

  it("a recipe without a time does not pass the time filter", () => {
    expect(ids(filterListItems(items, { time: "over60", freezable: true }))).toEqual([]);
  });

  it("the query combines with the filters", () => {
    expect(ids(filterListItems(items, { q: "b", freezable: true }))).toEqual(["b"]);
  });
});

describe("groupListItems", () => {
  it("a recipe lands in each of its categories, groups go by sortOrder", () => {
    const groups = groupListItems(
      [createItem({ id: "pancakes", dishCategoryIds: ["dessert", "breakfast"] })],
      categories,
    );

    expect(groups.map(({ id }) => id)).toEqual(["breakfast", "dessert"]);
  });

  it("recipes without categories go in the last group, empty groups are not created", () => {
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

  it("an archived recipe does not make it into the list", () => {
    const items = buildListItems(
      [
        createRecipe({ id: "alive" }),
        createRecipe({ id: "archived", archivedAt: "2026-02-01T00:00:00Z" }),
      ],
      products,
    );

    expect(items.map(({ recipe }) => recipe.id)).toEqual(["alive"]);
  });

  it("without a raw weight and without manual values there is no kcal per 100 g", () => {
    const [item] = buildListItems([createRecipe({ id: "empty" })], products);

    expect(item.kcal100).toBeNull();
    expect(item.isNutritionIncomplete).toBe(false);
  });

  it("a manual kcal value sets the number even without ingredients", () => {
    const [item] = buildListItems([createRecipe({ id: "manual", kcal100Override: 120 })], products);

    expect(item.kcal100).toBe(120);
  });

  it("kcal per 100 g is calculated by the domain module from the ingredients", () => {
    const [item] = buildListItems(
      [createRecipe({ id: "rice", ingredients: [createIngredient("rice", 100)] })],
      products,
    );

    expect(item.kcal100).toBe(200);
    expect(item.isNutritionIncomplete).toBe(false);
  });

  it("a product without nutrition marks the recipe as incomplete", () => {
    const [item] = buildListItems(
      [createRecipe({ id: "honey", ingredients: [createIngredient("honey", 50)] })],
      products,
    );

    expect(item.isNutritionIncomplete).toBe(true);
  });

  it("search texts are normalized: the recipe name and the names of the ingredient products", () => {
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
