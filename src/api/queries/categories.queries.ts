import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants/caching.constants";

import { getDishCategories, getProductCategories } from "../services/categories.service";

export const PRODUCT_CATEGORIES_QUERY_KEY = "product-categories";
export const DISH_CATEGORIES_QUERY_KEY = "dish-categories";

export function useProductCategoriesQuery() {
  return useQuery({
    queryKey: [PRODUCT_CATEGORIES_QUERY_KEY],
    staleTime: STALE_TIME,
    queryFn: getProductCategories,
  });
}

export function useDishCategoriesQuery() {
  return useQuery({
    queryKey: [DISH_CATEGORIES_QUERY_KEY],
    staleTime: STALE_TIME,
    queryFn: getDishCategories,
  });
}
