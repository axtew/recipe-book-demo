import { useState } from "react";

import { B1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { INutritionSnapshot } from "@/domain/nutrition";

import { CookLogSheet } from "./_internal/CookLogSheet";
import { SButton } from "./_styles";

interface IProps {
  recipeId: string;
  snapshot: INutritionSnapshot;
}

/** Кнопка «Записать готовку» в конце карточки и лист, который она открывает. */
export function CookLogAction({ recipeId, snapshot }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard);
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <SButton type="button" onClick={() => setIsOpened(true)}>
        <B1 as="span">{l.recordCookButton}</B1>
      </SButton>

      <CookLogSheet
        isOpened={isOpened}
        recipeId={recipeId}
        snapshot={snapshot}
        onClose={() => setIsOpened(false)}
      />
    </>
  );
}
