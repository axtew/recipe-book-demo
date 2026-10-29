import type { IRecipe } from "@/types/recipes.types";

/**
 * Recipes that contain the product.
 *
 * Archived recipes are not shown: they do not surface in any list, and in the archiving warning
 * they would be noise rather than an argument.
 */
export function findRecipesUsingProduct(recipes: IRecipe[], productId: string): IRecipe[] {
  return recipes.filter(
    (recipe) =>
      recipe.archivedAt === null &&
      recipe.ingredients.some((ingredient) => ingredient.productId === productId),
  );
}
