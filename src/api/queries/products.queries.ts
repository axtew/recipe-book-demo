import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants/caching.constants";

import { getProducts } from "../services/products.service";

export const PRODUCTS_QUERY_KEY = "products";

export function useProductsQuery() {
  return useQuery({ queryKey: [PRODUCTS_QUERY_KEY], staleTime: STALE_TIME, queryFn: getProducts });
}
