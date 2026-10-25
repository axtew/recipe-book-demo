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

// Собирает файл бэкапа версии 1 из читаемых исходников в `source/`: раздаёт
// детерминированные id, связывает строки по названиям и считает снимки КБЖУ
// для журнала доменным модулем. Результат записывается в `seed.json`.

/** Категории блюд совпадают с теми, что создаёт миграция `reference_data`: импорт сопоставляет их по названию. */
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

/** Идентификатор вида `de000003-0000-4000-8000-000000000007`: по префиксу видно тип строки, порядок стабилен между запусками. */
function makeId(kind: TIdKind, index: number): string {
  return `de0000${ID_PREFIX[kind]}-0000-4000-8000-${index.toString(16).padStart(12, "0")}`;
}

function timestamp(date: string, time: string): string {
  return `${date}T${time}.000000+00:00`;
}

function must<T>(value: T | undefined, description: string): T {
  if (value === undefined) {
    throw new Error(`В исходниках демо-данных не найдено: ${description}`);
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
        throw new Error(`Продукт «${product.name}» объявлен дважды`);
      }

      const productId = makeId("product", productIdByName.size + 1);
      productIdByName.set(product.name, productId);

      product.variants.forEach((variant, variantIndex) => {
        const variantId = makeId("variant", variantIdByKey.size + 1);
        const key = `${product.name}/${variant.name ?? ""}`;

        if (variantIdByKey.has(key)) {
          throw new Error(`Вариант «${key}» объявлен дважды`);
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

/** Расчёт и снимок рецепта в том виде, в каком их строит карточка рецепта в приложении. */
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

/** Эталон демо-данных в формате бэкапа версии 1. */
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

    if (recipeIdByName.has(recipe.name)) throw new Error(`Рецепт «${recipe.name}» объявлен дважды`);
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
        `категория блюд «${categoryName}»`,
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
          `продукт «${ingredient.product}» (рецепт «${recipe.name}»)`,
        );
        const pinnedVariantId =
          ingredient.variant === undefined
            ? null
            : must(
                variantIdByKey.get(`${ingredient.product}/${ingredient.variant}`),
                `вариант «${ingredient.product}/${ingredient.variant}» (рецепт «${recipe.name}»)`,
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
    const recipeId = must(recipeIdByName.get(log.recipe), `рецепт «${log.recipe}» (журнал)`);
    const addedAt = must(addedAtByRecipe.get(log.recipe), log.recipe);

    if (log.cookedAt < addedAt) {
      throw new Error(`Запись журнала ${log.cookedAt} раньше добавления рецепта «${log.recipe}»`);
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
 * SQL, который кладёт эталон в таблицу `demo.seed`: файл целиком в dollar-кавычках
 * одним INSERT. В отличие от вставки JSON в SQL Editor, его можно выполнить из
 * командной строки (`supabase db query -f`), когда файл слишком велик для редактора.
 * Повторное выполнение заменяет эталон и не трогает время последнего сброса.
 */
export function buildSeedLoadSql(seedText: string): string {
  if (seedText.includes(SEED_QUOTE)) {
    throw new Error(
      `В эталоне встретилась последовательность ${SEED_QUOTE} — она закрыла бы строку`,
    );
  }

  return [
    "-- Загрузка эталона в демо-проект. Файл собирается генератором из `seed.json`, руками не правится.",
    "-- Порядок применения — `supabase/demo/DEPLOY.md`; пересборка — `README.md` рядом.",
    "insert into demo.seed (id, data)",
    `values (1, ${SEED_QUOTE}${seedText.trimEnd()}${SEED_QUOTE}::jsonb)`,
    "on conflict (id) do update set data = excluded.data, loaded_at = now();",
    "",
  ].join("\n");
}

/**
 * Куда какой файл из `photos/` кладётся в Storage: путь объекта в бакете
 * `recipe-photos` совпадает с `photo_path` рецепта в эталоне. По этому списку
 * работает `upload-photos.mjs`.
 */
export function buildPhotoManifest(): { file: string; path: string }[] {
  return RECIPES.flatMap((recipe, index) =>
    recipe.photo === undefined
      ? []
      : [{ file: recipe.photo, path: `${makeId("recipe", index + 1)}/cover.webp` }],
  );
}
