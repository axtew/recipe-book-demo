import { useMemo } from "react";

import {
  useDishCategoriesQuery,
  useProductCategoriesQuery,
} from "@/api/queries/categories.queries";
import { useCookLogsQuery } from "@/api/queries/cookLogs.queries";
import { useProductsQuery } from "@/api/queries/products.queries";
import { useRecipesQuery } from "@/api/queries/recipes.queries";
import type { ICookLog } from "@/types/cookLogs.types";
import type { IProduct, IProductCategory } from "@/types/products.types";
import type { IDishCategory, IRecipe } from "@/types/recipes.types";

/**
 * Единая точка загрузки всех данных.
 */
export function useAppDataLoader() {
  const recipes = useRecipesQuery();
  const products = useProductsQuery();
  const cookLogs = useCookLogsQuery();
  const productCategories = useProductCategoriesQuery();
  const dishCategories = useDishCategoriesQuery();

  const queries = [recipes, products, cookLogs, productCategories, dishCategories];

  return {
    isPending: queries.some((query) => query.isPending),
    isError: queries.some((query) => query.isError),
    /**
     * Идёт фоновое обновление хотя бы одного запроса.
     */
    isFetching: queries.some((query) => query.isFetching),
    refetch: () => {
      queries.forEach((query) => void query.refetch());
    },
  };
}

export function useProducts(): IProduct[] {
  return useProductsQuery().data ?? [];
}

export function useRecipes(): IRecipe[] {
  return useRecipesQuery().data ?? [];
}

export function useCookLogs(): ICookLog[] {
  return useCookLogsQuery().data ?? [];
}

export function useProductCategories(): IProductCategory[] {
  return useProductCategoriesQuery().data ?? [];
}

export function useDishCategories(): IDishCategory[] {
  return useDishCategoriesQuery().data ?? [];
}

export function useProductsById(): Map<string, IProduct> {
  const products = useProducts();

  return useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
}
