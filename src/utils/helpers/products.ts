import type { IProduct } from "@/types/products.types";

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
