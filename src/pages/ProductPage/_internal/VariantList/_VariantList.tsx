import { useSetActiveProductVariantMutation } from "@/api/mutations/products.mutations";
import { Button } from "@/components/Button";
import { NutrientsRow } from "@/components/NutrientsRow";
import { B1, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IProduct } from "@/types/products.types";

import { SHeading, SList, SSingle, SVariant } from "./_styles";

interface IProps {
  product: IProduct;
}

/**
 * Product variants with switching the active one in a single tap.
 *
 * A product with a single variant is shown as a simple one: nesting carries no information while
 * there is nothing to choose from. Archived variants are not shown at all — they remain only in old
 * recipes.
 */
export function VariantList({ product }: IProps) {
  const l = useI18nSelector(({ l }) => l.products.card);
  const { mutate, isPending } = useSetActiveProductVariantMutation();

  const variants = product.variants.filter((variant) => variant.archivedAt === null);
  const [firstVariant] = variants;

  if (variants.length === 0) {
    return (
      <SSingle>
        <NutrientsRow kcal={null} protein={null} fat={null} carbs={null} />
      </SSingle>
    );
  }

  if (variants.length === 1) {
    return (
      <SSingle>
        <NutrientsRow
          kcal={firstVariant.kcal100}
          protein={firstVariant.protein100}
          fat={firstVariant.fat100}
          carbs={firstVariant.carbs100}
        />
        {firstVariant.isApproximate && <Caption2 color="textMuted">{l.approximateLabel}</Caption2>}
        {firstVariant.note !== null && <Caption2 color="textMuted">{firstVariant.note}</Caption2>}
        {firstVariant.id !== product.activeVariantId && (
          <Button
            variant="primaryOutline"
            type="button"
            isInline
            disabled={isPending}
            onClick={() => mutate({ productId: product.id, variantId: firstVariant.id })}
          >
            {l.makeActive}
          </Button>
        )}
      </SSingle>
    );
  }

  return (
    <SList>
      {variants.map((variant) => {
        const isActive = variant.id === product.activeVariantId;

        return (
          <li key={variant.id}>
            <SVariant
              type="button"
              $isActive={isActive}
              disabled={isPending || isActive}
              onClick={() => mutate({ productId: product.id, variantId: variant.id })}
            >
              <SHeading>
                <B1>{variant.name ?? l.unnamedVariant}</B1>
                {isActive && <Caption2 color="primary">{l.activeLabel}</Caption2>}
              </SHeading>
              <NutrientsRow
                kcal={variant.kcal100}
                protein={variant.protein100}
                fat={variant.fat100}
                carbs={variant.carbs100}
              />
              {variant.isApproximate && <Caption2 color="textMuted">{l.approximateLabel}</Caption2>}
              {variant.note !== null && <Caption2 color="textMuted">{variant.note}</Caption2>}
            </SVariant>
          </li>
        );
      })}
    </SList>
  );
}
