import { B1, B2, H3 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipe } from "@/types/recipes.types";

import { SList, SNumber, SSection, SStep } from "./_styles";

interface IProps {
  steps: IRecipe["steps"];
}

/** Нумерованный список шагов приготовления. */
export function StepsBlock({ steps }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard.steps);

  return (
    <SSection>
      <H3>{l.title}</H3>

      {steps.length === 0 ? (
        <B2 color="textMuted">{l.empty}</B2>
      ) : (
        <SList>
          {steps.map((step, index) => (
            <SStep key={step.id}>
              <SNumber>
                <B1 as="span">{index + 1}</B1>
              </SNumber>
              <B1>{step.text}</B1>
            </SStep>
          ))}
        </SList>
      )}
    </SSection>
  );
}
