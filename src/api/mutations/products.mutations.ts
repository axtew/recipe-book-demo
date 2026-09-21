import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PRODUCTS_QUERY_KEY } from "../queries/products.queries";
import {
  addProductVariant,
  archiveProduct,
  createProductWithVariant,
  setActiveProductVariant,
} from "../services/products.service";

export function useSetActiveProductVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setActiveProductVariant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useArchiveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useCreateProductWithVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductWithVariant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useAddProductVariantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductVariant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}
