import type { INutrients } from "@/domain/nutrition";
import type { IRecipe } from "@/types/recipes.types";

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
