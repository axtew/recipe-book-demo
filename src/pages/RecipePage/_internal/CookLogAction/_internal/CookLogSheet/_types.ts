import type { SubmitEvent } from "react";

import type { INutritionSnapshot } from "@/domain/nutrition";

export interface ICookLogSheetProps {
  isOpened: boolean;
  recipeId: string;
  /** КБЖУ и состав рецепта на текущий момент — уходит в запись как есть. */
  snapshot: INutritionSnapshot;
  onClose: () => void;
}

export interface IUseCookLogFormProps {
  isOpened: boolean;
  recipeId: string;
  snapshot: INutritionSnapshot;
  validationError: string;
  submitError: string;
  onSaved: () => void;
}

export type TCookLogFields = {
  cookedAt: string;
  multiplier: number | "";
  actualYieldGrams: number | "";
  containers: number | "";
  rating: number | null;
  note: string;
};

export interface IUseCookLogFormResult {
  cookedAt: string;
  multiplier: number | "";
  actualYieldGrams: number | "";
  containers: number | "";
  rating: number | null;
  note: string;
  error: string | null;
  isSubmitDisabled: boolean;
  setCookedAt: (value: string) => void;
  setMultiplier: (value: number | "") => void;
  setActualYieldGrams: (value: number | "") => void;
  setContainers: (value: number | "") => void;
  setRating: (value: number | null) => void;
  setNote: (value: string) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}
