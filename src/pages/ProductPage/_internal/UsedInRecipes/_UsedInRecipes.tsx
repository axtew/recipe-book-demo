import { B1, B2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";
import type { IRecipe } from "@/types/recipes.types";

import { SItem, SLink, SList } from "./_styles";

interface IProps {
  recipes: IRecipe[];
}

/**
 * Recipes that contain the product, each a link to the recipe card.
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
          <SLink to={routerPaths.recipeCard} params={{ recipeId: recipe.id }}>
            <B1>{recipe.name}</B1>
          </SLink>
        </SItem>
      ))}
    </SList>
  );
}
