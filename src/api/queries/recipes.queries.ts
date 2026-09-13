import { useQuery } from "@tanstack/react-query";

import { STALE_TIME } from "@/constants/caching.constants";

import { getRecipes } from "../services/recipes.service";

const RECIPES_QUERY_KEY = "recipes";

export function useRecipesQuery() {
  return useQuery({ queryKey: [RECIPES_QUERY_KEY], staleTime: STALE_TIME, queryFn: getRecipes });
}
