import { Caption1, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import type { IRecipeGroup } from "../../_types";
import { RecipeCard } from "../RecipeCard";
import { SChevron, SGroup, SHeader, SList, STitle } from "./_styles";

interface IProps {
  group: IRecipeGroup;
  isCollapsed: boolean;
  onToggle: (groupId: string) => void;
}

/** Категория блюд со счётчиком и списком рецептов; заголовок сворачивает список. */
export function CategoryGroup({ group, isCollapsed, onToggle }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeList);

  return (
    <SGroup>
      <H3>
        <SHeader
          type="button"
          aria-expanded={!isCollapsed}
          aria-label={`${group.name ?? l.uncategorized}: ${isCollapsed ? l.expandGroup : l.collapseGroup}`}
          onClick={() => onToggle(group.id)}
        >
          <STitle>
            {group.name ?? l.uncategorized}
            <Caption1 as="span" color="textMuted">
              {group.items.length}
            </Caption1>
          </STitle>
          <SChevron aria-hidden $isCollapsed={isCollapsed}>
            ▾
          </SChevron>
        </SHeader>
      </H3>

      {!isCollapsed && (
        <SList>
          {group.items.map((item) => (
            <RecipeCard key={item.recipe.id} item={item} />
          ))}
        </SList>
      )}
    </SGroup>
  );
}
