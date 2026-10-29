import type { IRecipe, IRecipeDraft } from "@/types/recipes.types";

export interface IRecipeEditorPageProps {
  /** Null — a new recipe. */
  recipeId: string | null;
}

/** What the user decided about the found draft. */
export type TDraftChoice = "pending" | "restored" | "discarded";

export interface IRecipeFormProps {
  /** The id the recipe is saved under: its own if it exists, issued in advance if it is new. */
  recipeId: string | null;
  /**
   * The original recipe when editing; fields not shown in the form (manual nutrition) are taken
   * from it.
   */
  recipe: IRecipe | null;
  initialDraft: IRecipeDraft;
  saveDraft: (draft: IRecipeDraft) => void;
  /** Successful save: deletes the draft and stops writing it. */
  finishDraft: () => void;
}

type TRecipeFieldName =
  | "name"
  | "servingsBase"
  | "yieldGrams"
  | "cookTimeMin"
  | "freezable"
  | "freezerDays"
  | "fridgeDays"
  | "notes";

/** Scalar form fields. Lists (ingredients, steps, links, categories) live outside `useForm`. */
export type TRecipeFields = {
  [K in TRecipeFieldName]: K extends "name" | "notes"
    ? string
    : K extends "freezable"
      ? boolean
      : number | "";
};

export type TValidationKey =
  | "name"
  | "servingsBase"
  | "yieldGrams"
  | "cookTimeMin"
  | "freezerDays"
  | "fridgeDays"
  | "videoUrls"
  | "steps"
  | "ingredients"
  | "generic";

/**
 * What to show under the save button: the form block that failed validation, or a rejected
 * submission.
 */
export type TSaveError = TValidationKey | "submit";

/** Writing a value of a scalar form field by name — what `useForm` provides. */
export type TUpdateField = (
  name: keyof TRecipeFields,
  value: TRecipeFields[keyof TRecipeFields],
) => void;
