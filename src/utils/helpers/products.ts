import type { IProduct } from "@/types/products.types";
import { normalizeSearch } from "@/utils/search";

/** Non-archived products whose name contains the query. An empty query does not filter. */
export function filterProducts(products: IProduct[], query: string): IProduct[] {
  const normalizedQuery = normalizeSearch(query);
  const visible = products.filter((product) => product.archivedAt === null);

  if (normalizedQuery === "") return visible;

  return visible.filter((product) => normalizeSearch(product.name).includes(normalizedQuery));
}
