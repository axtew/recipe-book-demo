import type { INutritionSnapshot, IRecipeNutrition, IResolvedIngredient } from "./_types";

/**
 * Замораживает расчёт и состав в том виде, в каком они были на момент готовки.
 *
 * Ложится в `cook_logs.snapshot` и больше не пересчитывается: смена активного
 * варианта продукта не должна переписывать историю. Опциональные ингредиенты
 * сюда попадают тоже — это протокол того, что реально клали.
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
