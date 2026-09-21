import { useMemo, useState } from "react";

import { useProductCategories, useProducts } from "@/hooks/useAppData.hook";
import { filterProducts } from "@/utils/helpers/products";

import { groupProducts } from "./_helpers";

/** Поиск по справочнику и раскладка результата по категориям. */
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
    /** В справочнике нет ни одного неархивного продукта — не путать с пустой выдачей поиска. */
    hasProducts: products.some((product) => product.archivedAt === null),
  };
}
