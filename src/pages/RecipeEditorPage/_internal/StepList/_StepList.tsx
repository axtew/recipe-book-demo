import { B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipeStepDraft } from "@/types/recipes.types";

import { SAddButton, SSection } from "../../_styles";
import { SortableItem, SortableList } from "../SortableList";
import { StepRow } from "./_StepRow";

interface IProps {
  steps: IRecipeStepDraft[];
  onAdd: (step: IRecipeStepDraft) => void;
  onChange: (key: string, patch: Partial<IRecipeStepDraft>) => void;
  onRemove: (key: string) => void;
  onMove: (activeKey: string, overKey: string) => void;
}

/** Шаги приготовления: переставляемые строки с нумерацией и кнопка добавления. */
export function StepList({ steps, onAdd, onChange, onRemove, onMove }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.steps);

  return (
    <SSection>
      <H3>{l.title}</H3>

      <SortableList keys={steps.map(({ key }) => key)} onMove={onMove}>
        {steps.map((step, index) => (
          <SortableItem key={step.key} id={step.key} handleLabel={l.moveHandle}>
            <StepRow
              number={index + 1}
              text={step.text}
              onChange={(text) => onChange(step.key, { text })}
              onRemove={() => onRemove(step.key)}
            />
          </SortableItem>
        ))}
      </SortableList>

      <SAddButton type="button" onClick={() => onAdd({ key: crypto.randomUUID(), text: "" })}>
        <B2 as="span">{l.add}</B2>
      </SAddButton>
    </SSection>
  );
}
