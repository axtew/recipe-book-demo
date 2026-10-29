import type { TBackup } from "@/domain/backup";
import {
  buildSnapshot,
  calculateNutrition,
  type INutritionIngredient,
  type INutritionProduct,
  type INutritionVariant,
  resolveIngredients,
} from "@/domain/nutrition";

import type { IDemoRecipe } from "./source/_types";
import { COOK_LOGS } from "./source/cookLogs";
import { PRODUCT_CATEGORIES } from "./source/products";
import { RECIPES } from "./source/recipes";

// Builds a version 1 backup file from the readable sources in `source/`: assigns
// deterministic ids, links rows by name and computes the nutrition snapshots
// for the log with the domain module. The result is written to `seed.json`.

/** Dish categories match those created by the `reference_data` migration: the import matches them by name. */
const DISH_CATEGORIES = ["Завтраки", "Обеды", "Ужины", "Супы", "Выпечка", "Десерты", "Заготовки"];

const EXPORTED_AT = "2026-10-21T08:00:00.000000+00:00";
const PRODUCTS_CREATED_AT = "2026-07-18T08:00:00.000000+00:00";
const ARCHIVED_AT = "2026-09-02T10:00:00.000000+00:00";

type TIdKind =
  | "productCategory"
  | "dishCategory"
  | "product"
  | "variant"
  | "recipe"
  | "step"
  | "ingredient"
  | "cookLog";

const ID_PREFIX: Record<TIdKind, string> = {
  productCategory: "01",
  dishCategory: "02",
  product: "03",
  variant: "04",
  recipe: "05",
  step: "06",
  ingredient: "07",
  cookLog: "08",
};

/** An id like `de000003-0000-4000-8000-000000000007`: the prefix shows the row type, the order is stable between runs. */
function makeId(kind: TIdKind, index: number): string {
  return `de0000${ID_PREFIX[kind]}-0000-4000-8000-${index.toString(16).padStart(12, "0")}`;
}

function timestamp(date: string, time: string): string {
  return `${date}T${time}.000000+00:00`;
}

function must<T>(value: T | undefined, description: string): T {
  if (value === undefined) {
    throw new Error(`Not found in the demo data sources: ${description}`);
  }

  return value;
}

type TCatalogRows = Pick<
  TBackup,
  "product_categories" | "dish_categories" | "products" | "product_variants"
>;

function buildCatalog(): {
  rows: TCatalogRows;
  productIdByName: Map<string, string>;
  variantIdByKey: Map<string, string>;
  activeVariantIdByProduct: Map<string, string>;
} {
  const rows: TCatalogRows = {
    product_categories: [],
    dish_categories: [],
    products: [],
    product_variants: [],
  };
  const productIdByName = new Map<string, string>();
  const variantIdByKey = new Map<string, string>();
  const activeVariantIdByProduct = new Map<string, string>();

  DISH_CATEGORIES.forEach((name, index) => {
    rows.dish_categories.push({
      id: makeId("dishCategory", index + 1),
      name,
      sort_order: (index + 1) * 10,
      created_at: PRODUCTS_CREATED_AT,
    });
  });

  PRODUCT_CATEGORIES.forEach((category, categoryIndex) => {
    const categoryId = makeId("productCategory", categoryIndex + 1);

    rows.product_categories.push({
      id: categoryId,
      name: category.name,
      sort_order: (categoryIndex + 1) * 10,
      created_at: PRODUCTS_CREATED_AT,
    });

    for (const product of category.products) {
      if (productIdByName.has(product.name)) {
        throw new Error(`Product "${product.name}" is declared twice`);
      }

      const productId = makeId("product", productIdByName.size + 1);
      productIdByName.set(product.name, productId);

      product.variants.forEach((variant, variantIndex) => {
        const variantId = makeId("variant", variantIdByKey.size + 1);
        const key = `${product.name}/${variant.name ?? ""}`;

        if (variantIdByKey.has(key)) {
          throw new Error(`Variant "${key}" is declared twice`);
        }

        variantIdByKey.set(key, variantId);
        if (variantIndex === 0) activeVariantIdByProduct.set(product.name, variantId);

        const per100 = variant.per100;

        rows.product_variants.push({
          id: variantId,
          product_id: productId,
          name: variant.name ?? null,
          kcal_100: per100 === null ? null : per100[0],
          protein_100: per100 === null ? null : per100[1],
          fat_100: per100 === null ? null : per100[2],
          carbs_100: per100 === null ? null : per100[3],
          is_approximate: variant.approximate === true,
          source: variant.source ?? "seed",
          note: variant.note ?? null,
          archived_at: null,
          created_at: PRODUCTS_CREATED_AT,
          updated_at: PRODUCTS_CREATED_AT,
        });
      });

      rows.products.push({
        id: productId,
        name: product.name,
        category_id: categoryId,
        active_variant_id: must(activeVariantIdByProduct.get(product.name), product.name),
        note: product.note ?? null,
        archived_at: product.archived === true ? ARCHIVED_AT : null,
        created_at: PRODUCTS_CREATED_AT,
        updated_at: PRODUCTS_CREATED_AT,
      });
    }
  });

  return { rows, productIdByName, variantIdByKey, activeVariantIdByProduct };
}

/** The recipe calculation and snapshot as the recipe card in the app builds them. */
function buildRecipeSnapshot(
  recipe: IDemoRecipe,
  ingredients: INutritionIngredient[],
  products: INutritionProduct[],
  variants: INutritionVariant[],
) {
  const resolved = resolveIngredients(ingredients, products, variants);
  const nutrition = calculateNutrition(resolved, {
    servingsBase: recipe.servings,
    yieldGrams: recipe.yieldGrams ?? null,
    overrides: {},
  });

  return buildSnapshot(nutrition, resolved, recipe.servings);
}

/** The demo data seed in the version 1 backup format. */
export function buildSeed(): TBackup {
  const catalog = buildCatalog();
  const { productIdByName, variantIdByKey } = catalog;

  const nutritionProducts: INutritionProduct[] = catalog.rows.products.map((product) => ({
    id: product.id,
    name: product.name,
    activeVariantId: product.active_variant_id,
  }));
  const nutritionVariants: INutritionVariant[] = catalog.rows.product_variants.map((variant) => ({
    id: variant.id,
    name: variant.name,
    kcal100: variant.kcal_100,
    protein100: variant.protein_100,
    fat100: variant.fat_100,
    carbs100: variant.carbs_100,
  }));

  const recipeRows: TBackup["recipes"] = [];
  const stepRows: TBackup["recipe_steps"] = [];
  const recipeCategoryRows: TBackup["recipe_dish_categories"] = [];
  const ingredientRows: TBackup["recipe_ingredients"] = [];
  const recipeIdByName = new Map<string, string>();
  const snapshotByRecipe = new Map<string, ReturnType<typeof buildRecipeSnapshot>>();
  const addedAtByRecipe = new Map<string, string>();

  RECIPES.forEach((recipe, index) => {
    const recipeId = makeId("recipe", index + 1);
    const createdAt = timestamp(recipe.addedAt, "09:00:00");

    if (recipeIdByName.has(recipe.name))
      throw new Error(`Recipe "${recipe.name}" is declared twice`);
    recipeIdByName.set(recipe.name, recipeId);
    addedAtByRecipe.set(recipe.name, recipe.addedAt);

    recipeRows.push({
      id: recipeId,
      name: recipe.name,
      servings_base: recipe.servings,
      yield_grams: recipe.yieldGrams ?? null,
      cook_time_min: recipe.cookTimeMin,
      photo_path: recipe.photo === undefined ? null : `${recipeId}/cover.webp`,
      notes: recipe.notes ?? null,
      video_urls: recipe.videoUrls ?? [],
      freezable: recipe.freezerDays !== undefined,
      freezer_days: recipe.freezerDays ?? null,
      fridge_days: recipe.fridgeDays ?? null,
      kcal_100_override: null,
      protein_100_override: null,
      fat_100_override: null,
      carbs_100_override: null,
      archived_at: null,
      created_at: createdAt,
      updated_at: createdAt,
    });

    for (const categoryName of recipe.categories) {
      const category = must(
        catalog.rows.dish_categories.find(({ name }) => name === categoryName),
        `dish category "${categoryName}"`,
      );

      recipeCategoryRows.push({ recipe_id: recipeId, dish_category_id: category.id });
    }

    recipe.steps.forEach((text, stepIndex) => {
      stepRows.push({
        id: makeId("step", stepRows.length + 1),
        recipe_id: recipeId,
        sort_order: stepIndex + 1,
        text,
      });
    });

    const recipeIngredients: INutritionIngredient[] = recipe.ingredients.map(
      (ingredient, ingredientIndex) => {
        const productId = must(
          productIdByName.get(ingredient.product),
          `product "${ingredient.product}" (recipe "${recipe.name}")`,
        );
        const pinnedVariantId =
          ingredient.variant === undefined
            ? null
            : must(
                variantIdByKey.get(`${ingredient.product}/${ingredient.variant}`),
                `variant "${ingredient.product}/${ingredient.variant}" (recipe "${recipe.name}")`,
              );
        const id = makeId("ingredient", ingredientRows.length + 1);

        ingredientRows.push({
          id,
          recipe_id: recipeId,
          product_id: productId,
          pinned_variant_id: pinnedVariantId,
          amount_grams: ingredient.grams,
          is_optional: ingredient.optional === true,
          note: ingredient.note ?? null,
          sort_order: ingredientIndex + 1,
        });

        return {
          id,
          productId,
          pinnedVariantId,
          amountGrams: ingredient.grams,
          isOptional: ingredient.optional === true,
        };
      },
    );

    snapshotByRecipe.set(
      recipeId,
      buildRecipeSnapshot(recipe, recipeIngredients, nutritionProducts, nutritionVariants),
    );
  });

  const cookLogRows: TBackup["cook_logs"] = COOK_LOGS.map((log, index) => {
    const recipeId = must(recipeIdByName.get(log.recipe), `recipe "${log.recipe}" (log)`);
    const addedAt = must(addedAtByRecipe.get(log.recipe), log.recipe);

    if (log.cookedAt < addedAt) {
      throw new Error(
        `Log entry ${log.cookedAt} is earlier than the recipe "${log.recipe}" was added`,
      );
    }

    return {
      id: makeId("cookLog", index + 1),
      recipe_id: recipeId,
      cooked_at: log.cookedAt,
      multiplier: log.multiplier ?? 1,
      actual_yield_grams: log.yieldGrams ?? null,
      containers: log.containers ?? null,
      finished_at: log.finishedAt ?? null,
      rating: log.rating ?? null,
      note: log.note ?? null,
      snapshot: must(snapshotByRecipe.get(recipeId), log.recipe),
      created_at: timestamp(log.cookedAt, "19:30:00"),
    };
  });

  return {
    version: 1,
    exported_at: EXPORTED_AT,
    product_categories: catalog.rows.product_categories,
    dish_categories: catalog.rows.dish_categories,
    products: catalog.rows.products,
    product_variants: catalog.rows.product_variants,
    recipes: recipeRows,
    recipe_steps: stepRows,
    recipe_dish_categories: recipeCategoryRows,
    recipe_ingredients: ingredientRows,
    cook_logs: cookLogRows,
  };
}

const SEED_QUOTE = "$seed$";

/**
 * SQL that puts the seed into the `demo.seed` table: the whole file in dollar quotes
 * as a single INSERT. Unlike pasting JSON into the SQL Editor, it can be run from the
 * command line (`supabase db query -f`) when the file is too large for the editor.
 * Re-running replaces the seed and does not touch the time of the last reset.
 */
export function buildSeedLoadSql(seedText: string): string {
  if (seedText.includes(SEED_QUOTE)) {
    throw new Error(`The seed contains the sequence ${SEED_QUOTE} — it would close the string`);
  }

  return [
    "-- Loading the seed into the demo project. The file is built by the generator from `seed.json` and is not edited by hand.",
    "-- Order of application — `supabase/demo/DEPLOY.md`; rebuild — `README.md` alongside.",
    "insert into demo.seed (id, data)",
    `values (1, ${SEED_QUOTE}${seedText.trimEnd()}${SEED_QUOTE}::jsonb)`,
    "on conflict (id) do update set data = excluded.data, loaded_at = now();",
    "",
  ].join("\n");
}

/**
 * Where each file from `photos/` goes in Storage: the object path in the `recipe-photos`
 * bucket matches the recipe's `photo_path` in the seed. `upload-photos.mjs` works
 * from this list.
 */
export function buildPhotoManifest(): { file: string; path: string }[] {
  return RECIPES.flatMap((recipe, index) =>
    recipe.photo === undefined
      ? []
      : [{ file: recipe.photo, path: `${makeId("recipe", index + 1)}/cover.webp` }],
  );
}
