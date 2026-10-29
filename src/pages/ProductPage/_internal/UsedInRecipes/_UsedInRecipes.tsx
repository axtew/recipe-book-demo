import { B1, B2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipe } from "@/types/recipes.types";

import { SItem, SList } from "./_styles";

interface IProps {
  recipes: IRecipe[];
}

/**
 * Recipes that contain the product.
 *
 * The recipe names are plain text, not links to the recipe card.
 */
export function UsedInRecipes({ recipes }: IProps) {
  const l = useI18nSelector(({ l }) => l.products.card);

  if (recipes.length === 0) {
    return <B2 color="textMuted">{l.usedInEmpty}</B2>;
  }

  return (
    <SList>
      {recipes.map((recipe) => (
        <SItem key={recipe.id}>
          <B1>{recipe.name}</B1>
        </SItem>
      ))}
    </SList>
  );
}
