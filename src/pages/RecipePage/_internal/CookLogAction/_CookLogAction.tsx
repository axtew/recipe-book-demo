import { useState } from "react";

import { Button } from "@/components/Button";
import { useI18nSelector } from "@/context/I18nContext";
import type { INutritionSnapshot } from "@/domain/nutrition";

import { CookLogSheet } from "./_internal/CookLogSheet";

interface IProps {
  recipeId: string;
  snapshot: INutritionSnapshot;
}

/** The “Log a cook” button at the end of the card and the sheet it opens. */
export function CookLogAction({ recipeId, snapshot }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeCard);
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <Button variant="primary" type="button" onClick={() => setIsOpened(true)}>
        {l.recordCookButton}
      </Button>

      <CookLogSheet
        isOpened={isOpened}
        recipeId={recipeId}
        snapshot={snapshot}
        onClose={() => setIsOpened(false)}
      />
    </>
  );
}
