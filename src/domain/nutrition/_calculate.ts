import type {
  INutrients,
  INutritionParams,
  IRecipeNutrition,
  IResolvedIngredient,
  TNutritionBasis,
} from "./_types";

/** Канонический порядок полей — от него зависит порядок `overriddenFields`. */
const NUTRIENT_FIELDS = ["kcal", "protein", "fat", "carbs"] as const;

function zeroNutrients(): INutrients {
  return { kcal: 0, protein: 0, fat: 0, carbs: 0 };
}

function mapNutrients(nutrients: INutrients, transform: (value: number) => number): INutrients {
  return {
    kcal: transform(nutrients.kcal),
    protein: transform(nutrients.protein),
    fat: transform(nutrients.fat),
    carbs: transform(nutrients.carbs),
  };
}

function addNutrients(first: INutrients, second: INutrients): INutrients {
  return {
    kcal: first.kcal + second.kcal,
    protein: first.protein + second.protein,
    fat: first.fat + second.fat,
    carbs: first.carbs + second.carbs,
  };
}

/** Сумма вкладов: КБЖУ варианта на 100 г, взятое на фактическую граммовку ингредиента. */
function sumNutrients(ingredients: IResolvedIngredient[]): INutrients {
  return ingredients.reduce<INutrients>((total, ingredient) => {
    if (ingredient.nutrientsPer100 === null) {
      return total;
    }

    return addNutrients(
      total,
      mapNutrients(ingredient.nutrientsPer100, (value) => (value * ingredient.amountGrams) / 100),
    );
  }, zeroNutrients());
}

/** Продукты без КБЖУ, по одному разу каждый — из них собирается предупреждение в карточке. */
function collectIncompleteProducts(
  ingredients: IResolvedIngredient[],
): IRecipeNutrition["incompleteProducts"] {
  const incomplete: IRecipeNutrition["incompleteProducts"] = [];
  const seen = new Set<string>();

  for (const ingredient of ingredients) {
    if (ingredient.nutrientsPer100 !== null || seen.has(ingredient.productId)) {
      continue;
    }

    seen.add(ingredient.productId);
    incomplete.push({ productId: ingredient.productId, productName: ingredient.productName });
  }

  return incomplete;
}

/**
 * Считает КБЖУ рецепта: на всё блюдо, на 100 г и на порцию.
 *
 * Опциональные ингредиенты не участвуют ни в весе сырья, ни в КБЖУ, ни в списке
 * продуктов с незаполненными цифрами: они не входят в сумму, значит и занизить её
 * не могут. Override задан на уровне «на 100 г» и по каждому полю отдельно, поэтому
 * при любом заданном override итог пересчитывается обратно из эффективных ста граммов.
 * Округления здесь нет — числа сырые, округляет отображение.
 */
export function calculateNutrition(
  resolved: IResolvedIngredient[],
  params: INutritionParams,
): IRecipeNutrition {
  const { servingsBase, yieldGrams, overrides } = params;

  if (!Number.isFinite(servingsBase) || servingsBase <= 0) {
    throw new Error(`servingsBase должен быть больше нуля, получено ${servingsBase}`);
  }

  const counted = resolved.filter((ingredient) => !ingredient.isOptional);
  const rawWeightGrams = counted.reduce((sum, ingredient) => sum + ingredient.amountGrams, 0);

  const useYield = yieldGrams !== null && yieldGrams > 0;
  const basis: TNutritionBasis = useYield ? "yield" : "rawWeight";
  const basisWeight = useYield ? yieldGrams : rawWeightGrams;

  const computedTotal = sumNutrients(counted);
  const computedPer100 =
    basisWeight > 0
      ? mapNutrients(computedTotal, (value) => (value / basisWeight) * 100)
      : zeroNutrients();

  const overriddenFields = NUTRIENT_FIELDS.filter((field) => overrides[field] !== undefined);
  const per100g: INutrients = {
    kcal: overrides.kcal ?? computedPer100.kcal,
    protein: overrides.protein ?? computedPer100.protein,
    fat: overrides.fat ?? computedPer100.fat,
    carbs: overrides.carbs ?? computedPer100.carbs,
  };

  const total =
    overriddenFields.length > 0
      ? mapNutrients(per100g, (value) => (value * basisWeight) / 100)
      : computedTotal;

  return {
    total,
    per100g,
    perServing: mapNutrients(total, (value) => value / servingsBase),
    basis,
    rawWeightGrams,
    yieldGrams,
    overriddenFields,
    incompleteProducts: collectIncompleteProducts(counted),
  };
}

/** Граммовка ингредиента при готовке не на базовое число порций. Без округления — оно за UI. */
export function scaleAmount(grams: number, multiplier: number): number {
  return grams * multiplier;
}
