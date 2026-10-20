import { useMemo, useState } from "react";

import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/Button";
import { B2, Caption1, H1, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useProductCategories, useProductsById, useRecipes } from "@/hooks/useAppData.hook";
import { routerPaths } from "@/routes/_paths";

import { findRecipesUsingProduct } from "./_helpers";
import { ArchiveConfirm } from "./_internal/ArchiveConfirm";
import { UsedInRecipes } from "./_internal/UsedInRecipes";
import { VariantList } from "./_internal/VariantList";
import { SBadge, SHeader, SPage, SPlaceholder, SSection } from "./_styles";

interface IProductPage {
  productId: string;
}

/** Карточка продукта: варианты, где используется, архивирование. */
export function ProductPage({ productId }: IProductPage) {
  const l = useI18nSelector(({ l }) => l.products.card);
  const productsById = useProductsById();
  const categories = useProductCategories();
  const recipes = useRecipes();
  const [isArchiveOpened, setIsArchiveOpened] = useState(false);

  const usedInRecipes = useMemo(
    () => findRecipesUsingProduct(recipes, productId),
    [recipes, productId],
  );

  const product = productsById.get(productId) ?? null;

  if (product === null) {
    return (
      <SPage>
        <BackLink to={routerPaths.products}>
          <B2 as="span">{l.backLink}</B2>
        </BackLink>
        <SPlaceholder>
          <H3>{l.notFoundTitle}</H3>
          <B2 color="textMuted">{l.notFoundHint}</B2>
        </SPlaceholder>
      </SPage>
    );
  }

  const category = categories.find(({ id }) => id === product.categoryId) ?? null;

  return (
    <SPage>
      <BackLink to={routerPaths.products}>
        <B2 as="span">{l.backLink}</B2>
      </BackLink>

      <SHeader>
        <H1>{product.name}</H1>
        {category !== null && <Caption1 color="textMuted">{category.name}</Caption1>}
        {product.archivedAt !== null && (
          <SBadge>
            <Caption1 as="span" color="textMuted">
              {l.archivedBadge}
            </Caption1>
          </SBadge>
        )}
      </SHeader>

      {product.note !== null && <B2 color="textMuted">{product.note}</B2>}

      <SSection>
        <H3>{l.variantsTitle}</H3>
        <VariantList product={product} />
      </SSection>

      <SSection>
        <H3>{l.usedInTitle}</H3>
        <UsedInRecipes recipes={usedInRecipes} />
      </SSection>

      {product.archivedAt === null && (
        <Button variant="dangerOutline" type="button" onClick={() => setIsArchiveOpened(true)}>
          {l.archiveButton}
        </Button>
      )}

      <ArchiveConfirm
        isOpened={isArchiveOpened}
        productId={product.id}
        usedInRecipes={usedInRecipes}
        onClose={() => setIsArchiveOpened(false)}
      />
    </SPage>
  );
}
