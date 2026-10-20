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
 * Строка списка: фото или плейсхолдер, название, время, снежинка для
 * замораживаемых и ккал на 100 г.
 *
 * Неполное КБЖУ помечено тем же предупреждением, что и в строках справочника
 * продуктов: цифра без него выглядела бы как точная. Рецепт, у которого считать
 * не из чего, показывает прочерк.
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
