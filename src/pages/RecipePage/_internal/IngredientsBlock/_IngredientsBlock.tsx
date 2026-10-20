import { useMemo } from "react";

import { B1, B2, Caption2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IResolvedIngredient } from "@/domain/nutrition";
import type { IProduct } from "@/types/products.types";
import type { IRecipe } from "@/types/recipes.types";
import { formatDecimal } from "@/utils/helpers/nutrients";

import { SBody, SItem, SList, SMeta, SPinIcon, SSection } from "./_styles";

interface IProps {
  ingredients: IRecipe["ingredients"];
  resolved: IResolvedIngredient[];
  productsById: Map<string, IProduct>;
}

/**
 * Состав рецепта: продукт и граммы.
 *
 * Название варианта мелким шрифтом под продуктом показывается, только когда у
 * продукта больше одного варианта: при единственном оно ничего не различает.
 * Закреплённый вариант отмечен значком.
 */
export function IngredientsBlock({ ingredients, resolved, productsById }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard.ingredients);

  const resolvedById = useMemo(
    () => new Map(resolved.map((ingredient) => [ingredient.ingredientId, ingredient])),
    [resolved],
  );

  return (
    <SSection>
      <H3>{l.title}</H3>

      {ingredients.length === 0 ? (
        <B2 color="textMuted">{l.empty}</B2>
      ) : (
        <SList>
          {ingredients.map((ingredient) => {
            const resolvedIngredient = resolvedById.get(ingredient.id);
            const product = productsById.get(ingredient.productId);

            if (resolvedIngredient === undefined || product === undefined) {
              throw new Error(`Ингредиент ${ingredient.id} не разрешён: нет продукта или варианта`);
            }

            const showVariant =
              product.variants.length > 1 && resolvedIngredient.variantId !== null;

            return (
              <SItem key={ingredient.id}>
                <SBody>
                  <B1>{resolvedIngredient.productName}</B1>
                  {showVariant && (
                    <SMeta>
                      <Caption2 color="textMuted">
                        {resolvedIngredient.variantName ?? l.unnamedVariant}
                      </Caption2>
                      {resolvedIngredient.isPinned && (
                        <SPinIcon
                          role="img"
                          aria-label={l.pinnedLabel}
                          viewBox="0 0 24 24"
                          width="14"
                          height="14"
                        >
                          <title>{l.pinnedLabel}</title>
                          <path d="M9 3h6l-1 6 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z" />
                        </SPinIcon>
                      )}
                    </SMeta>
                  )}
                  {resolvedIngredient.isOptional && (
                    <Caption2 color="textMuted">{l.optionalBadge}</Caption2>
                  )}
                  {ingredient.note !== null && ingredient.note.trim() !== "" && (
                    <Caption2 color="textMuted">{ingredient.note}</Caption2>
                  )}
                </SBody>
                <B1>{`${formatDecimal(ingredient.amountGrams)} ${l.gramsUnit}`}</B1>
              </SItem>
            );
          })}
        </SList>
      )}
    </SSection>
  );
}
