import type {
  INutrients,
  INutritionIngredient,
  INutritionProduct,
  INutritionVariant,
  IResolvedIngredient,
} from "./_types";

/** КБЖУ варианта, либо null, если хоть одно из четырёх полей не заполнено. */
function readNutrientsPer100(variant: INutritionVariant): INutrients | null {
  const { kcal100, protein100, fat100, carbs100 } = variant;

  if (kcal100 === null || protein100 === null || fat100 === null || carbs100 === null) {
    return null;
  }

  return { kcal: kcal100, protein: protein100, fat: fat100, carbs: carbs100 };
}

/**
 * Подставляет каждому ингредиенту его вариант и КБЖУ этого варианта.
 *
 * Вариант берётся закреплённый, иначе активный вариант продукта, иначе КБЖУ нет.
 * Оборванная ссылка — на отсутствующий продукт или вариант — это рассогласованный
 * набор данных, а не пустой КБЖУ: функция бросает исключение, потому что тихо
 * подставленный ноль здесь неотличим от честного нуля.
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
        `Ингредиент ${ingredient.id} ссылается на продукт ${ingredient.productId}, которого нет в переданном наборе`,
      );
    }

    const variantId = ingredient.pinnedVariantId ?? product.activeVariantId;
    const variant = variantId === null ? null : variantsById.get(variantId);

    if (variant === undefined) {
      throw new Error(
        `Ингредиент ${ingredient.id} ссылается на вариант ${variantId}, которого нет в переданном наборе`,
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
