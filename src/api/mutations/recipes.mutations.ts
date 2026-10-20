import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RECIPES_QUERY_KEY } from "../queries/recipes.queries";
import { saveRecipe, uploadRecipePhoto } from "../services/recipes.service";

export function useSaveRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveRecipe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [RECIPES_QUERY_KEY] });
    },
  });
}

/** Загрузка в Storage данных запросов не меняет — инвалидировать нечего. */
export function useUploadRecipePhotoMutation() {
  return useMutation({ mutationFn: uploadRecipePhoto });
}
