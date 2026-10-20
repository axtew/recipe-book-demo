import { useMemo, useState } from "react";

import { useDishCategories, useProducts, useRecipes } from "@/hooks/useAppData.hook";
import type { IRecipesSearch } from "@/types/recipes.types";
import { normalizeRecipesSearch } from "@/utils/helpers/recipes";

import { buildListItems, countActiveFilters, filterListItems, groupListItems } from "./_helpers";

/**
 * Данные главного экрана: строки списка, их раскладка по категориям и счётчики.
 *
 * Источник истины для поиска и фильтров — адрес. Набираемый текст дополнительно
 * держится локально, чтобы поле не ждало роутер, и подтягивается из адреса, когда
 * тот изменился снаружи: таб «Рецепты», шаг назад или вперёд по истории.
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

  // КБЖУ считается один раз на изменение данных, а не на каждую букву запроса.
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
    /** Число уникальных неархивных рецептов: попавший в несколько групп считается один раз. */
    total: allItems.length,
    /** Сколько уникальных рецептов осталось после поиска и фильтров. */
    found: items.length,
    hasRecipes: allItems.length > 0,
    isSearching: query.trim() !== "",
    isFiltered: query.trim() !== "" || activeFiltersCount > 0,
    changeQuery,
    changeFilters,
    reset,
  };
}
