import { useState } from "react";

import { Button } from "@/components/Button";
import { B1, B2, Caption1, H1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { routerPaths } from "@/routes/_paths";
import type { IRecipesSearch } from "@/types/recipes.types";

import { CategoryGroup } from "./_internal/CategoryGroup";
import { FiltersSheet } from "./_internal/FiltersSheet";
import { SearchBar } from "./_internal/SearchBar";
import { SFab, SHeader, SPage, SPlaceholder } from "./_styles";
import { useCollapsedGroups } from "./_useCollapsedGroups";
import { useRecipesList } from "./_useRecipesList";

interface IProps {
  search: IRecipesSearch;
  onSearchChange: (next: IRecipesSearch) => void;
}

/**
 * The main screen: recipes by dish category, search by name and ingredients, filters and a
 * create-recipe button.
 *
 * While a search is running, collapsed groups are shown expanded: otherwise what was found would
 * hide under a heading and look like “nothing found”.
 */
export function RecipesPage({ search, onSearchChange }: IProps) {
  const l = useI18nSelector(({ l }) => ({ ...l.recipeList, navigation: l.navigation }));
  const list = useRecipesList(search, onSearchChange);
  const { isCollapsed, toggle } = useCollapsedGroups();
  const [isFiltersOpened, setIsFiltersOpened] = useState(false);

  return (
    <SPage>
      <SHeader>
        <H1>{l.navigation.recipes}</H1>
        {list.hasRecipes && (
          <Caption1 color="textMuted">
            {list.isFiltered ? `${l.found}: ${list.found}` : `${l.total}: ${list.total}`}
          </Caption1>
        )}
      </SHeader>

      {list.hasRecipes && (
        <SearchBar
          query={list.query}
          activeFiltersCount={list.activeFiltersCount}
          onQueryChange={list.changeQuery}
          onOpenFilters={() => setIsFiltersOpened(true)}
        />
      )}

      {!list.hasRecipes && (
        <SPlaceholder>
          <B1 color="textMuted">{l.emptyTitle}</B1>
          <B2 color="textMuted">{l.emptyHint}</B2>
        </SPlaceholder>
      )}

      {list.hasRecipes && list.groups.length === 0 && (
        <SPlaceholder>
          <B1 color="textMuted">{l.nothingFoundTitle}</B1>
          <B2 color="textMuted">{l.nothingFoundHint}</B2>
          {list.isFiltered && (
            <Button variant="primaryOutline" type="button" onClick={list.reset}>
              {l.resetButton}
            </Button>
          )}
        </SPlaceholder>
      )}

      {list.groups.map((group) => (
        <CategoryGroup
          key={group.id}
          group={group}
          isCollapsed={!list.isSearching && isCollapsed(group.id)}
          onToggle={toggle}
        />
      ))}

      <FiltersSheet
        isOpened={isFiltersOpened}
        freezable={list.freezable}
        time={list.time}
        onChange={list.changeFilters}
        onClose={() => setIsFiltersOpened(false)}
      />

      <SFab to={routerPaths.recipeNew} aria-label={l.addButton} />
    </SPage>
  );
}
