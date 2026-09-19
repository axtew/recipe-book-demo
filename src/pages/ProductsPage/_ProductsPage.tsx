import { B1, B2, H1, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { ProductListItem } from "./_internal/ProductListItem";
import { SGroup, SList, SPage, SPlaceholder, SSearch } from "./_styles";
import { useProductsList } from "./_useProductsList";

/** Справочник продуктов: поиск по названию и список, сгруппированный по категориям. */
export function ProductsPage() {
  const l = useI18nSelector(({ l }) => l.products.list);
  const { query, setQuery, groups, hasProducts } = useProductsList();

  return (
    <SPage>
      <H1>{l.title}</H1>

      {hasProducts && (
        <SSearch
          type="search"
          value={query}
          placeholder={l.searchPlaceholder}
          aria-label={l.searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
        />
      )}

      {!hasProducts && (
        <SPlaceholder>
          <B1 color="textMuted">{l.emptyTitle}</B1>
          <B2 color="textMuted">{l.emptyHint}</B2>
        </SPlaceholder>
      )}

      {hasProducts && groups.length === 0 && (
        <SPlaceholder>
          <B1 color="textMuted">{l.nothingFound}</B1>
        </SPlaceholder>
      )}

      {groups.map((group) => (
        <SGroup key={group.categoryId}>
          <H3>{group.categoryName}</H3>
          <SList>
            {group.products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </SList>
        </SGroup>
      ))}
    </SPage>
  );
}
