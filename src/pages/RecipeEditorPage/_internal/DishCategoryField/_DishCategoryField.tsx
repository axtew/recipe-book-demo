import type { Dispatch, SetStateAction } from "react";

import { B2, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useDishCategories } from "@/hooks/useAppData.hook";

import { SField } from "../../_styles";
import { SChip, SChips } from "./_styles";

interface IProps {
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
}

/**
 * Dish categories: a recipe may have none or several — pancakes are both breakfast and dessert,
 * hence the choice is by toggle chips, not a list.
 */
export function DishCategoryField({ selectedIds, setSelectedIds }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.dishCategories);
  const categories = useDishCategories();

  function toggle(categoryId: string) {
    setSelectedIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  }

  return (
    <SField as="div">
      <Caption2 color="textMuted">{l.label}</Caption2>
      <SChips>
        {categories.map((category) => {
          const isSelected = selectedIds.includes(category.id);

          return (
            <SChip
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              $isSelected={isSelected}
              onClick={() => toggle(category.id)}
            >
              <B2 as="span">{category.name}</B2>
            </SChip>
          );
        })}
      </SChips>
    </SField>
  );
}
