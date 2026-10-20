import { COOK_TIME_FILTERS } from "@/constants/recipes.constants";
import type { INutrients, IRecipeNutrition } from "@/domain/nutrition";
import type { IRecipe, IRecipesSearch } from "@/types/recipes.types";

/**
 * Ручные значения КБЖУ на 100 г в форме входа расчёта: в объект попадают
 * только заполненные поля, потому что расчёт различает «не задано» и «ноль».
 */
export function getNutritionOverrides(recipe: IRecipe): Partial<INutrients> {
  const overrides: Partial<INutrients> = {};

  if (recipe.kcal100Override !== null) overrides.kcal = recipe.kcal100Override;
  if (recipe.protein100Override !== null) overrides.protein = recipe.protein100Override;
  if (recipe.fat100Override !== null) overrides.fat = recipe.fat100Override;
  if (recipe.carbs100Override !== null) overrides.carbs = recipe.carbs100Override;

  return overrides;
}

/** Считать КБЖУ не из чего: нет веса сырья и нет ни одного введённого вручную значения. */
export function isNutritionEmpty({
  rawWeightGrams,
  overriddenFields,
}: Pick<IRecipeNutrition, "rawWeightGrams" | "overriddenFields">): boolean {
  return rawWeightGrams === 0 && overriddenFields.length === 0;
}

/**
 * Приводит поиск главного экрана к каноничному виду: пустой запрос и
 * неизвестное значение фильтра отбрасываются, остальные поля сохраняются.
 *
 * Принимает неразобранные значения: адрес правит и человек, и старая закладка,
 * поэтому каждое поле проверяется само. Роутер читает значения как JSON, так что
 * запрос «123» приходит числом. Отброшенные поля возвращаются явным `undefined`:
 * роутер накладывает результат валидации на сырой поиск из адреса, и без явного
 * ключа неподходящее значение осталось бы в поиске как есть.
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
