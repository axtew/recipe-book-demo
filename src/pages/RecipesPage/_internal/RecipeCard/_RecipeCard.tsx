import { B1, Caption1, Caption2, Num2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";
import { formatKcal } from "@/utils/helpers/nutrients";

import type { IRecipeListItem } from "../../_types";
import {
  SBody,
  SItem,
  SLink,
  SMeta,
  SName,
  SNutrition,
  SPhoto,
  SPhotoPlaceholder,
  SSnowflake,
} from "./_styles";

interface IProps {
  item: IRecipeListItem;
}

/**
 * A list row: photo or placeholder, name, time, a snowflake for freezable ones and kcal per 100 g.
 *
 * Incomplete nutrition is marked with the same warning as in the product directory rows: a number
 * without it would look exact. A recipe with nothing to calculate from shows a dash.
 */
export function RecipeCard({ item }: IProps) {
  const l = useI18nSelector(({ l }) => ({ ...l.recipeList.card, nutrients: l.nutrients }));
  const { recipe, kcal100, isNutritionIncomplete } = item;

  return (
    <SItem>
      <SLink to={routerPaths.recipeCard} params={{ recipeId: recipe.id }}>
        {recipe.photoUrl === null ? (
          <SPhotoPlaceholder />
        ) : (
          <SPhoto src={recipe.photoUrl} alt="" loading="lazy" />
        )}

        <SBody>
          <SName>
            <B1>{recipe.name}</B1>
          </SName>

          {(recipe.cookTimeMin !== null || recipe.freezable) && (
            <SMeta>
              {recipe.cookTimeMin !== null && (
                <Caption1 color="textMuted">{`${recipe.cookTimeMin} ${l.minutesUnit}`}</Caption1>
              )}
              {recipe.freezable && (
                <SSnowflake role="img" aria-label={l.freezable}>
                  ❄
                </SSnowflake>
              )}
            </SMeta>
          )}

          <SNutrition>
            <Num2>{kcal100 === null ? l.nutrients.empty : formatKcal(kcal100)}</Num2>
            <Caption2 color="textMuted">{`${l.nutrients.kcal} ${l.per100g}`}</Caption2>
            {isNutritionIncomplete && <Caption2 color="danger">{l.nutrients.incomplete}</Caption2>}
          </SNutrition>
        </SBody>
      </SLink>
    </SItem>
  );
}
