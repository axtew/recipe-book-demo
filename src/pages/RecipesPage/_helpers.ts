import { calculateNutrition, resolveIngredients } from "@/domain/nutrition";
import type { IProduct } from "@/types/products.types";
import type { IDishCategory, IRecipe, IRecipesSearch } from "@/types/recipes.types";
import { getNutritionOverrides, isNutritionEmpty } from "@/utils/helpers/recipes";
import { getSearchTokens, matchesTokens, normalizeSearch } from "@/utils/search";

import { COOK_TIME_LIMIT_MIN, UNCATEGORIZED_GROUP_ID } from "./_constants";
import type { IRecipeGroup, IRecipeListItem } from "./_types";

/**
 * Неархивные рецепты в виде строк списка.
 *
 * Архивные рецепты загружены вместе с остальными (на них могут ссылаться другие
 * данные), поэтому скрывает их список, а не запрос. КБЖУ считает доменный
 * модуль; здесь только подготовка входа и выбор цифры.
 */
export function buildListItems(recipes: IRecipe[], products: IProduct[]): IRecipeListItem[] {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const variants = products.flatMap((product) => product.variants);

  return recipes
    .filter((recipe) => recipe.archivedAt === null)
    .map((recipe) => {
      const nutrition = calculateNutrition(
        resolveIngredients(recipe.ingredients, products, variants),
        {
          servingsBase: recipe.servingsBase,
          yieldGrams: recipe.yieldGrams,
          overrides: getNutritionOverrides(recipe),
        },
      );

      return {
        recipe,
        searchTexts: [
          normalizeSearch(recipe.name),
          ...recipe.ingredients.map(({ productId }) =>
            normalizeSearch(productsById.get(productId)?.name ?? ""),
          ),
        ],
        kcal100: isNutritionEmpty(nutrition) ? null : nutrition.per100g.kcal,
        isNutritionIncomplete: nutrition.incompleteProducts.length > 0,
      };
    });
}

/** Рецепт без указанного времени готовки не проходит ни одну границу фильтра. */
function matchesCookTime(recipe: IRecipe, time: NonNullable<IRecipesSearch["time"]>): boolean {
  if (recipe.cookTimeMin === null) return false;

  return time === "over60"
    ? recipe.cookTimeMin > COOK_TIME_LIMIT_MIN[time]
    : recipe.cookTimeMin <= COOK_TIME_LIMIT_MIN[time];
}

/** Поиск и фильтры сочетаются по «и». */
export function filterListItems(items: IRecipeListItem[], search: IRecipesSearch) {
  const tokens = getSearchTokens(search.q ?? "");

  return items.filter(({ recipe, searchTexts }) => {
    if (!matchesTokens(tokens, searchTexts)) return false;
    if (search.freezable === true && !recipe.freezable) return false;
    if (search.time !== undefined && !matchesCookTime(recipe, search.time)) return false;

    return true;
  });
}

/**
 * Раскладка по категориям в порядке `sortOrder`, «Без категории» — последней.
 *
 * Рецепт попадает в каждую свою категорию. Пустые группы не создаются. Ссылка
 * на неизвестную категорию приравнивается к отсутствию категорий, иначе рецепт
 * исчез бы из списка совсем.
 */
export function groupListItems(
  items: IRecipeListItem[],
  categories: IDishCategory[],
): IRecipeGroup[] {
  const sorted = [...categories].sort((first, second) => first.sortOrder - second.sortOrder);
  const known = new Set(sorted.map(({ id }) => id));

  const groups: IRecipeGroup[] = sorted.map((category) => ({
    id: category.id,
    name: category.name,
    items: items.filter(({ recipe }) => recipe.dishCategoryIds.includes(category.id)),
  }));

  const uncategorized = items.filter(
    ({ recipe }) => !recipe.dishCategoryIds.some((id) => known.has(id)),
  );

  if (uncategorized.length > 0) {
    groups.push({ id: UNCATEGORIZED_GROUP_ID, name: null, items: uncategorized });
  }

  return groups.filter((group) => group.items.length > 0);
}

/** Сколько фильтров включено — поиск по тексту не считается. */
export function countActiveFilters(search: IRecipesSearch): number {
  return (search.freezable === true ? 1 : 0) + (search.time === undefined ? 0 : 1);
}
