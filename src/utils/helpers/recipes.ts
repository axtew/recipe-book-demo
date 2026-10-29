import { COOK_TIME_FILTERS } from "@/constants/recipes.constants";
import type { INutrients, IRecipeNutrition } from "@/domain/nutrition";
import type { IRecipe, IRecipesSearch } from "@/types/recipes.types";

/**
 * Manual per-100 g nutrition values in the calculation input shape: only
 * the filled fields land in the object, because the calculation distinguishes “not set” from “zero”.
 */
export function getNutritionOverrides(recipe: IRecipe): Partial<INutrients> {
  const overrides: Partial<INutrients> = {};

  if (recipe.kcal100Override !== null) overrides.kcal = recipe.kcal100Override;
  if (recipe.protein100Override !== null) overrides.protein = recipe.protein100Override;
  if (recipe.fat100Override !== null) overrides.fat = recipe.fat100Override;
  if (recipe.carbs100Override !== null) overrides.carbs = recipe.carbs100Override;

  return overrides;
}

/** There is nothing to calculate nutrition from: no raw weight and no manually entered value. */
export function isNutritionEmpty({
  rawWeightGrams,
  overriddenFields,
}: Pick<IRecipeNutrition, "rawWeightGrams" | "overriddenFields">): boolean {
  return rawWeightGrams === 0 && overriddenFields.length === 0;
}

/**
 * Brings the home screen search to canonical form: an empty query and
 * an unknown filter value are dropped, the other fields are kept.
 *
 * Takes unparsed values: the URL is edited by people and by old bookmarks,
 * so each field is checked on its own. The router reads values as JSON, so
 * the query “123” arrives as a number. Dropped fields are returned as an explicit `undefined`:
 * the router overlays the validation result on the raw search from the URL, and without an explicit
 * key an unsuitable value would stay in the search as is.
 */
export function normalizeRecipesSearch(search: {
  q?: unknown;
  freezable?: unknown;
  time?: unknown;
}): IRecipesSearch {
  const query = typeof search.q === "number" ? String(search.q) : search.q;

  return {
    q: typeof query === "string" && query.trim() !== "" ? query : undefined,
    freezable: search.freezable === true ? true : undefined,
    time: COOK_TIME_FILTERS.find((value) => value === search.time),
  };
}
