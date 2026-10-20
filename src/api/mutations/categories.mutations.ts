import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ICategory, TCategoryKind } from "@/types/categories.types";

import {
  DISH_CATEGORIES_QUERY_KEY,
  PRODUCT_CATEGORIES_QUERY_KEY,
} from "../queries/categories.queries";
import { renameCategory, reorderCategories } from "../services/categories.service";

const CATEGORIES_QUERY_KEYS: Record<TCategoryKind, string> = {
  product: PRODUCT_CATEGORIES_QUERY_KEY,
  dish: DISH_CATEGORIES_QUERY_KEY,
};

export function useRenameCategoryMutation(kind: TCategoryKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: string; name: string }) => renameCategory({ kind, ...variables }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEYS[kind]] });
    },
  });
}

export function useReorderCategoriesMutation(kind: TCategoryKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categories: ICategory[]) => reorderCategories({ kind, categories }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEYS[kind]] });
    },
  });
}
