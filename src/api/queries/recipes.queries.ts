import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { STALE_TIME } from "@/constants/caching.constants";

import { getRecipePhotoUrl, getRecipes } from "../services/recipes.service";

export const RECIPES_QUERY_KEY = "recipes";

export function useRecipesQuery() {
  return useQuery({ queryKey: [RECIPES_QUERY_KEY], staleTime: STALE_TIME, queryFn: getRecipes });
}

/** Публичный адрес фото рецепта, либо null, если фото нет. */
export function useRecipePhotoUrl(photoPath: string | null): string | null {
  return useMemo(() => (photoPath === null ? null : getRecipePhotoUrl(photoPath)), [photoPath]);
}
