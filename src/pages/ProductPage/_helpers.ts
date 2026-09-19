import type { IRecipe } from "@/types/recipes.types";

/**
 * Рецепты, в составе которых встречается продукт.
 *
 * Архивные рецепты не показываются: они не всплывают ни в одном списке, и в
 * предупреждении при архивировании были бы шумом, а не аргументом.
 */
export function findRecipesUsingProduct(recipes: IRecipe[], productId: string): IRecipe[] {
  return recipes.filter(
    (recipe) =>
      recipe.archivedAt === null &&
      recipe.ingredients.some((ingredient) => ingredient.productId === productId),
  );
}
