import type { SubmitEvent } from "react";

export interface IProductFormSheetProps {
  isOpened: boolean;
  initialName: string;
  onClose: () => void;
  onCreated: (product: { id: string; name: string }) => void;
}

export interface IUseProductFormProps {
  isOpened: boolean;
  initialName: string;
  validationError: string;
  submitError: string;
  onCreated: (product: { id: string; name: string }) => void;
}

type TProductFieldName = "name" | "categoryId" | "kcal" | "protein" | "fat" | "carbs";

export type TProductFields = {
  [K in TProductFieldName]: K extends "name" | "categoryId" ? string : number | "";
};

export interface IUseProductFormResult {
  name: string;
  categoryId: string;
  kcal: number | "";
  protein: number | "";
  fat: number | "";
  carbs: number | "";
  error: string | null;
  isSubmitDisabled: boolean;
  setName: (value: string) => void;
  setCategoryId: (value: string) => void;
  setKcal: (value: number | "") => void;
  setProtein: (value: number | "") => void;
  setFat: (value: number | "") => void;
  setCarbs: (value: number | "") => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}
