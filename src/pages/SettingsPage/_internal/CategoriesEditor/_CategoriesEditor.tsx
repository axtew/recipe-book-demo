import { useI18nSelector } from "@/context/I18nContext";
import { useDishCategories, useProductCategories } from "@/hooks/useAppData.hook";

import { Section } from "../Section";
import { CategoryList } from "./_internal/CategoryList";
import { SLists } from "./_styles";

/** Названия и порядок категорий обоих справочников: продуктов и блюд. */
export function CategoriesEditor() {
  const l = useI18nSelector(({ l }) => l.settings.categories);
  const productCategories = useProductCategories();
  const dishCategories = useDishCategories();

  return (
    <Section title={l.title}>
      <SLists>
        <CategoryList kind="product" title={l.productsTitle} categories={productCategories} />
        <CategoryList kind="dish" title={l.dishesTitle} categories={dishCategories} />
      </SLists>
    </Section>
  );
}
