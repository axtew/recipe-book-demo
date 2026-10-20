import type { IProduct } from "@/types/products.types";
import { normalizeSearch } from "@/utils/search";

/** Неархивные продукты, чьё название содержит запрос. Пустой запрос не фильтрует. */
export function filterProducts(products: IProduct[], query: string): IProduct[] {
  const normalizedQuery = normalizeSearch(query);
  const visible = products.filter((product) => product.archivedAt === null);

  if (normalizedQuery === "") return visible;

  return visible.filter((product) => normalizeSearch(product.name).includes(normalizedQuery));
}
