import { B2, Caption1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipeNutrition } from "@/domain/nutrition";
import { routerPaths } from "@/routes/_paths";

import { SList, SProductLink, SWarning } from "./_styles";

interface IProps {
  products: IRecipeNutrition["incompleteProducts"];
}

/**
 * Warning above the nutrition numbers: products without nutrition were left out of the total, and
 * each is named by a link to its own card, where the numbers are filled in. No products — nothing.
 */
export function IncompleteWarning({ products }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard.incomplete);

  if (products.length === 0) return null;

  return (
    <SWarning role="alert">
      <B2 color="danger">{l.title}</B2>
      <Caption1 color="textMuted">{l.hint}</Caption1>
      <SList>
        {products.map(({ productId, productName }) => (
          <li key={productId}>
            <SProductLink to={routerPaths.productCard} params={{ productId }}>
              <B2 as="span">{productName}</B2>
            </SProductLink>
          </li>
        ))}
      </SList>
    </SWarning>
  );
}
