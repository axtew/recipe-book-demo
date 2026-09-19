import type { IProduct, IProductCategory } from "@/types/products.types";

/** Категория со своими продуктами — единица списка на экране. */
interface IProductGroup {
  categoryId: string;
  categoryName: string;
  products: IProduct[];
}

/**
 * Приведение строки к виду, пригодному для сравнения.
 *
 * `ё` → `е` обязательна с обеих сторон сравнения: без неё «мед» не находит
 * «мёд», и наоборот — а набирают на телефоне обычно без точек.
 */
export function normalizeSearch(value: string): string {
  return value.toLowerCase().replaceAll("ё", "е").trim();
}

/** Неархивные продукты, чьё название содержит запрос. Пустой запрос не фильтрует. */
export function filterProducts(products: IProduct[], query: string): IProduct[] {
  const normalizedQuery = normalizeSearch(query);
  const visible = products.filter((product) => product.archivedAt === null);

  if (normalizedQuery === "") return visible;

  return visible.filter((product) => normalizeSearch(product.name).includes(normalizedQuery));
}

/**
 * Раскладка продуктов по категориям в порядке `sortOrder`.
 *
 * Пустые категории в список не попадают: справочник заполняется постепенно, и
 * десяток пустых заголовков сверху прятал бы то немногое, что уже заведено.
 */
export function groupProducts(
  products: IProduct[],
  categories: IProductCategory[],
): IProductGroup[] {
  const productsByCategory = new Map<string, IProduct[]>();

  products.forEach((product) => {
    const group = productsByCategory.get(product.categoryId);

    if (group === undefined) {
      productsByCategory.set(product.categoryId, [product]);
      return;
    }

    group.push(product);
  });

  return [...categories]
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      products: productsByCategory.get(category.id) ?? [],
    }))
    .filter((group) => group.products.length > 0);
}
