import type { IRecipe, IRecipeDraft } from "@/types/recipes.types";

export interface IRecipeEditorPageProps {
  /** Null — новый рецепт. */
  recipeId: string | null;
}

/** Что пользователь решил про найденный черновик. */
export type TDraftChoice = "pending" | "restored" | "discarded";

export interface IRecipeFormProps {
  /** Id, под которым рецепт будет сохранён: у существующего — его собственный, у нового — выданный заранее. */
  recipeId: string | null;
  /** Исходный рецепт при редактировании; из него берутся не показываемые в форме поля (ручные КБЖУ). */
  recipe: IRecipe | null;
  initialDraft: IRecipeDraft;
  saveDraft: (draft: IRecipeDraft) => void;
  clearDraft: () => void;
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

/** Скалярные поля формы. Списки (состав, шаги, ссылки, категории) живут вне `useForm`. */
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

/** Что показать под кнопкой сохранения: блок формы, не прошедший проверку, либо отказ отправки. */
export type TSaveError = TValidationKey | "submit";

/** Запись значения скалярного поля формы по имени — то, что отдаёт `useForm`. */
export type TUpdateField = (
  name: keyof TRecipeFields,
  value: TRecipeFields[keyof TRecipeFields],
) => void;
