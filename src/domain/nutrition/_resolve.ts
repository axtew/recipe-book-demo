import type {
  INutrients,
  INutritionIngredient,
  INutritionProduct,
  INutritionVariant,
  IResolvedIngredient,
} from "./_types";

/** Nutrition of a variant, or null if any of the four fields is not filled in. */
function readNutrientsPer100(variant: INutritionVariant): INutrients | null {
  const { kcal100, protein100, fat100, carbs100 } = variant;

  if (kcal100 === null || protein100 === null || fat100 === null || carbs100 === null) {
    return null;
  }

  return { kcal: kcal100, protein: protein100, fat: fat100, carbs: carbs100 };
}

/**
 * Assigns each ingredient its variant and that variant's nutrition.
 *
 * The variant is the pinned one, otherwise the product's active variant, otherwise there is no nutrition.
 * A dangling reference — to a missing product or variant — is an inconsistent
 * dataset, not empty nutrition: the function throws, because a silently
 * substituted zero is indistinguishable from a genuine zero here.
 */
export function resolveIngredients(
  ingredients: INutritionIngredient[],
  products: INutritionProduct[],
  variants: INutritionVariant[],
): IResolvedIngredient[] {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

  return ingredients.map((ingredient) => {
    const product = productsById.get(ingredient.productId);

    if (product === undefined) {
      throw new Error(
        `Ingredient ${ingredient.id} references product ${ingredient.productId}, which is not in the provided set`,
      );
    }

    const variantId = ingredient.pinnedVariantId ?? product.activeVariantId;
    const variant = variantId === null ? null : variantsById.get(variantId);

    if (variant === undefined) {
      throw new Error(
        `Ingredient ${ingredient.id} references variant ${variantId}, which is not in the provided set`,
      );
    }

    return {
      ingredientId: ingredient.id,
      productId: product.id,
      productName: product.name,
      variantId: variant === null ? null : variant.id,
      variantName: variant === null ? null : variant.name,
      amountGrams: ingredient.amountGrams,
      isOptional: ingredient.isOptional,
      isPinned: ingredient.pinnedVariantId !== null,
      nutrientsPer100: variant === null ? null : readNutrientsPer100(variant),
    };
  });
}
