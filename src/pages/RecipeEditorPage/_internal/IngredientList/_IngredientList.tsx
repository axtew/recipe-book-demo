import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipeIngredientDraft } from "@/types/recipes.types";

import { createEmptyIngredient } from "../../_helpers";
import { SAddButton, SSection } from "../../_styles";
import { IngredientRow } from "../IngredientRow";
import { SortableItem, SortableList } from "../SortableList";

interface IProps {
  ingredients: IRecipeIngredientDraft[];
  onAdd: (ingredient: IRecipeIngredientDraft) => void;
  onChange: (key: string, patch: Partial<IRecipeIngredientDraft>) => void;
  onRemove: (key: string) => void;
  onMove: (activeKey: string, overKey: string) => void;
}

/** Recipe ingredients: reorderable rows and an add button. */
export function IngredientList({ ingredients, onAdd, onChange, onRemove, onMove }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.ingredients);

  return (
    <SSection>
      <H3>{l.title}</H3>

      <SortableList keys={ingredients.map(({ key }) => key)} onMove={onMove}>
        {ingredients.map((ingredient) => (
          <SortableItem key={ingredient.key} id={ingredient.key} handleLabel={l.moveHandle}>
            <IngredientRow
              ingredient={ingredient}
              onChange={(patch) => onChange(ingredient.key, patch)}
              onRemove={() => onRemove(ingredient.key)}
            />
          </SortableItem>
        ))}
      </SortableList>

      <SAddButton type="button" onClick={() => onAdd(createEmptyIngredient())}>
        <B2 as="span">{l.add}</B2>
      </SAddButton>
    </SSection>
  );
}
