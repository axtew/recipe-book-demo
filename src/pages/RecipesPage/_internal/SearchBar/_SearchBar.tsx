import { STextInput } from "@/components/TextInput";
import { B2, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SBadge, SBar, SFiltersButton, SSearchWrapper } from "./_styles";

interface IProps {
  query: string;
  activeFiltersCount: number;
  onQueryChange: (query: string) => void;
  onOpenFilters: () => void;
}

/** A search field and a filters button with a counter of the enabled ones. */
export function SearchBar({ query, activeFiltersCount, onQueryChange, onOpenFilters }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeList);

  return (
    <SBar>
      <SSearchWrapper>
        <STextInput
          type="search"
          value={query}
          placeholder={l.searchPlaceholder}
          aria-label={l.searchPlaceholder}
          enterKeyHint="search"
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </SSearchWrapper>
      <SFiltersButton type="button" onClick={onOpenFilters}>
        <B2 as="span">{l.filtersButton}</B2>
        {activeFiltersCount > 0 && (
          <SBadge>
            <Caption2 as="span">{activeFiltersCount}</Caption2>
          </SBadge>
        )}
      </SFiltersButton>
    </SBar>
  );
}
