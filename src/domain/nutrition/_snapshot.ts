import type { INutritionSnapshot, IRecipeNutrition, IResolvedIngredient } from "./_types";

/**
 * Freezes the calculation and composition as they were at the moment of cooking.
 *
 * Goes into `cook_logs.snapshot` and is never recalculated: changing a product's
 * active variant must not rewrite history. Optional ingredients
 * are included too — it is a record of what was actually used.
 */
export function buildSnapshot(
  nutrition: IRecipeNutrition,
  resolved: IResolvedIngredient[],
  servingsBase: number,
): INutritionSnapshot {
  return {
    version: 1,
    nutrition,
    servingsBase,
    ingredients: resolved.map((ingredient) => ({
      productId: ingredient.productId,
      productName: ingredient.productName,
      variantId: ingredient.variantId,
      variantName: ingredient.variantName,
      amountGrams: ingredient.amountGrams,
      isOptional: ingredient.isOptional,
    })),
  };
}
