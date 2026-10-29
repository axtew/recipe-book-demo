import { useMemo, useState } from "react";

import { useProductCategories, useProducts } from "@/hooks/useAppData.hook";
import { filterProducts } from "@/utils/helpers/products";

import { groupProducts } from "./_helpers";

/** Search over the directory and laying the result out by category. */
export function useProductsList() {
  const products = useProducts();
  const categories = useProductCategories();
  const [query, setQuery] = useState("");

  const groups = useMemo(
    () => groupProducts(filterProducts(products, query), categories),
    [products, categories, query],
  );

  return {
    query,
    setQuery,
    groups,
    /**
     * The directory has no non-archived product at all — not to be confused with an empty search
     * result.
     */
    hasProducts: products.some((product) => product.archivedAt === null),
  };
}
