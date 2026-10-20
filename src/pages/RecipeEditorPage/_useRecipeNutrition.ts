import { useMemo } from "react";

import {
  calculateNutrition,
  type INutrients,
  type INutritionIngredient,
  resolveIngredients,
} from "@/domain/nutrition";
import { useProducts } from "@/hooks/useAppData.hook";
import type { IRecipeDraft } from "@/types/recipes.types";

interface IProps {
  ingredients: IRecipeDraft["ingredients"];
  servingsBase: number | null;
  yieldGrams: number | null;
  overrides: Partial<INutrients>;
}

/**
 * КБЖУ черновика рецепта на лету.
 *
 * В расчёт попадают только строки с выбранным продуктом и положительными
 * граммами — недозаполненная строка не должна ни ломать расчёт, ни давать
 * вклад. Расчёт целиком в доменном модуле; здесь только подготовка входа.
 */
export function useRecipeNutrition({ ingredients, servingsBase, yieldGrams, overrides }: IProps) {
  const products = useProducts();

  const variants = useMemo(() => products.flatMap((product) => product.variants), [products]);

  const counted = useMemo(
    () =>
      ingredients.flatMap((ingredient): INutritionIngredient[] =>
        ingredient.productId !== null &&
        ingredient.amountGrams !== null &&
        ingredient.amountGrams > 0
          ? [
              {
                id: ingredient.key,
                productId: ingredient.productId,
                pinnedVariantId: ingredient.pinnedVariantId,
                amountGrams: ingredient.amountGrams,
                isOptional: ingredient.isOptional,
              },
            ]
          : [],
      ),
    [ingredients],
  );

  const isServingsValid = servingsBase !== null && servingsBase > 0;
  const isYieldValid = yieldGrams !== null && yieldGrams > 0;

  const nutrition = useMemo(
    () =>
      calculateNutrition(resolveIngredients(counted, products, variants), {
        servingsBase: isServingsValid ? servingsBase : 1,
        yieldGrams: isYieldValid ? yieldGrams : null,
        overrides,
      }),
    [
      counted,
      products,
      variants,
      isServingsValid,
      servingsBase,
      isYieldValid,
      yieldGrams,
      overrides,
    ],
  );

  return { nutrition, hasCountedIngredients: counted.length > 0, isServingsValid };
}
