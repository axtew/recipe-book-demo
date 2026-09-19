import { NutrientsRow } from "@/components/NutrientsRow";
import { B1, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";
import type { IProduct } from "@/types/products.types";

import { SHeading, SItem, SLink } from "./_styles";

interface IProps {
  product: IProduct;
}

/** Строка справочника: название, КБЖУ активного варианта и число вариантов, если их больше одного. */
export function ProductListItem({ product }: IProps) {
  const l = useI18nSelector(({ l }) => l.products.list);

  const variants = product.variants.filter((variant) => variant.archivedAt === null);
  const activeVariant = variants.find((variant) => variant.id === product.activeVariantId) ?? null;

  return (
    <SItem>
      <SLink to={routerPaths.productCard} params={{ productId: product.id }}>
        <SHeading>
          <B1>{product.name}</B1>
          {variants.length > 1 && (
            <Caption2 color="textMuted">{`${l.variantsLabel}: ${variants.length}`}</Caption2>
          )}
        </SHeading>
        <NutrientsRow
          kcal={activeVariant?.kcal100 ?? null}
          protein={activeVariant?.protein100 ?? null}
          fat={activeVariant?.fat100 ?? null}
          carbs={activeVariant?.carbs100 ?? null}
        />
      </SLink>
    </SItem>
  );
}
