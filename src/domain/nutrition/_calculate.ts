import type {
  INutrients,
  INutritionParams,
  IRecipeNutrition,
  IResolvedIngredient,
  TNutritionBasis,
} from "./_types";

/** Canonical field order — `overriddenFields` order depends on it. */
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

/** Sum of contributions: the variant's nutrition per 100 g, taken for the ingredient's actual gram amount. */
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

/** Products without nutrition, once each — the warning on the card is built from them. */
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
 * Calculates recipe nutrition: for the whole dish, per 100 g and per serving.
 *
 * Optional ingredients take part in neither the raw weight, nor the nutrition, nor the list
 * of products with unfilled numbers: they are not in the sum, so they cannot understate it.
 * Override is set at the “per 100 g” level and per field, so
 * with any override set the total is recalculated back from the effective hundred grams.
 * There is no rounding here — the numbers are raw, rounding is done by display.
 */
export function calculateNutrition(
  resolved: IResolvedIngredient[],
  params: INutritionParams,
): IRecipeNutrition {
  const { servingsBase, yieldGrams, overrides } = params;

  if (!Number.isFinite(servingsBase) || servingsBase <= 0) {
    throw new Error(`servingsBase must be greater than zero, got ${servingsBase}`);
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

/** Ingredient gram amount when cooking for other than the base number of servings. Not rounded — that is up to the UI. */
export function scaleAmount(grams: number, multiplier: number): number {
  return grams * multiplier;
}
