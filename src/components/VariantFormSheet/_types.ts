import type { SubmitEvent } from "react";

export interface IVariantFormSheetProps {
  isOpened: boolean;
  productId: string;
  onClose: () => void;
}

export interface IUseVariantFormProps {
  isOpened: boolean;
  productId: string;
  validationError: string;
  submitError: string;
  onClose: () => void;
}

type TVariantFieldName = "name" | "kcal" | "protein" | "fat" | "carbs";

export type TVariantFields = {
  [K in TVariantFieldName]: K extends "name" ? string : number | "";
};

export interface IUseVariantFormResult {
  name: string;
  kcal: number | "";
  protein: number | "";
  fat: number | "";
  carbs: number | "";
  error: string | null;
  isPending: boolean;
  setName: (value: string) => void;
  setKcal: (value: number | "") => void;
  setProtein: (value: number | "") => void;
  setFat: (value: number | "") => void;
  setCarbs: (value: number | "") => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}
