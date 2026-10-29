import { useMemo } from "react";

import { useCookLogs, useRecipes } from "@/hooks/useAppData.hook";

import { groupLogsByMonth } from "./_helpers";

/** Data of the log screen: entries by month and recipe names by id. */
export function useLogPage() {
  const cookLogs = useCookLogs();
  const recipes = useRecipes();

  const groups = useMemo(() => groupLogsByMonth(cookLogs), [cookLogs]);
  const recipeNames = useMemo(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe.name])),
    [recipes],
  );

  return { groups, recipeNames, isEmpty: cookLogs.length === 0 };
}
