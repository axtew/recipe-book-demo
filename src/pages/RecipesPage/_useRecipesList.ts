import { useMemo, useState } from "react";

import { useDishCategories, useProducts, useRecipes } from "@/hooks/useAppData.hook";
import type { IRecipesSearch } from "@/types/recipes.types";
import { normalizeRecipesSearch } from "@/utils/helpers/recipes";

import { buildListItems, countActiveFilters, filterListItems, groupListItems } from "./_helpers";

/**
 * Data of the main screen: list rows, their layout by category and the counters.
 *
 * The source of truth for search and filters is the address. The text being typed is additionally
 * kept locally so the field does not wait for the router, and is pulled from the address when that
 * changed from outside: the “Recipes” tab, a step back or forward in the history.
 */
export function useRecipesList(
  search: IRecipesSearch,
  onSearchChange: (next: IRecipesSearch) => void,
) {
  const recipes = useRecipes();
  const products = useProducts();
  const dishCategories = useDishCategories();

  const urlQuery = search.q ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);

  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  // Nutrition is calculated once per data change, not on every letter of the query.
  const allItems = useMemo(() => buildListItems(recipes, products), [recipes, products]);

  const items = useMemo(
    () => filterListItems(allItems, { ...search, q: query }),
    [allItems, search, query],
  );

  const groups = useMemo(() => groupListItems(items, dishCategories), [items, dishCategories]);

  function changeQuery(value: string) {
    setQuery(value);
    onSearchChange(normalizeRecipesSearch({ ...search, q: value }));
  }

  function changeFilters(next: Pick<IRecipesSearch, "freezable" | "time">) {
    onSearchChange(normalizeRecipesSearch({ q: query, ...next }));
  }

  function reset() {
    setQuery("");
    onSearchChange({});
  }

  const activeFiltersCount = countActiveFilters(search);

  return {
    query,
    freezable: search.freezable === true,
    time: search.time,
    activeFiltersCount,
    groups,
    /**
     * Number of unique non-archived recipes: one that falls into several groups is counted once.
     */
    total: allItems.length,
    /** How many unique recipes remain after search and filters. */
    found: items.length,
    hasRecipes: allItems.length > 0,
    isSearching: query.trim() !== "",
    isFiltered: query.trim() !== "" || activeFiltersCount > 0,
    changeQuery,
    changeFilters,
    reset,
  };
}
