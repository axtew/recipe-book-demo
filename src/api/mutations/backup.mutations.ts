import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DISH_CATEGORIES_QUERY_KEY,
  PRODUCT_CATEGORIES_QUERY_KEY,
} from "../queries/categories.queries";
import { COOK_LOGS_QUERY_KEY } from "../queries/cookLogs.queries";
import { PRODUCTS_QUERY_KEY } from "../queries/products.queries";
import { RECIPES_QUERY_KEY } from "../queries/recipes.queries";
import { exportBackup, importBackup } from "../services/backup.service";

/** The export changes nothing but is triggered by a user action, not by a render — hence a mutation. */
export function useExportBackupMutation() {
  return useMutation({ mutationFn: exportBackup, meta: { showsOwnError: true } });
}

/** The import rewrites the whole dataset: the previous cache is invalid as a whole. */
export function useImportBackupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importBackup,
    meta: { showsOwnError: true },
    onSuccess: async (result) => {
      if (result.status !== "imported") return;

      await Promise.all(
        [
          PRODUCTS_QUERY_KEY,
          RECIPES_QUERY_KEY,
          COOK_LOGS_QUERY_KEY,
          PRODUCT_CATEGORIES_QUERY_KEY,
          DISH_CATEGORIES_QUERY_KEY,
        ].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      );
    },
  });
}
