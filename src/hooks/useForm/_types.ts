import type { ChangeEvent, SubmitEvent } from "react";

import type { TSetState } from "@/types/common.types";

export type TFieldType = string | number | boolean | null;

// NOTE: pass extra plumbing through meta or similar
export type TFields = { [K: string]: TFieldType };

type TFormInput<T extends TFields, K extends keyof T> = {
  value: T[K];
  /**
   * The value that counts as already saved. If not passed, it equals `value`,
   * and the form is “untouched” until the field is changed.
   *
   * A create form with a default value that is meaningful input on its own
   * passes an empty value here: then the field differs from the saved one
   * from the first render and submit is available without edits.
   *
   * With `saveOnChange` such a form counts as changed right after mounting,
   * so autosave fires without any user action.
   */
  prevValue?: T[K];
  required?: boolean;
  error?: string | null;
  validator?: (value: string) => string | null;
  formatter?: (value: string) => string;
};

export type TInputs<T extends TFields> = { [K in keyof T]: TFieldType | TFormInput<T, K> };

export type TFormStateInput<T extends TFields, K extends keyof T> = {
  value: T[K];
  prevValue: T[K];
  required: boolean;
  error: string | null;
  isDirty: boolean;
  validator: (value: string) => string | null;
  formatter: (value: string) => string;
};

export type TUseFormState<T extends TFields> = {
  [K in keyof T]: TFormStateInput<T, K>;
};

export type TSubmitHandler<T extends TFields> = (
  form: TUseFormState<T>,
  setForm?: TSetState<TUseFormState<T>>,
) => Promise<void>;

export interface IUseFormReturn<T extends TFields> {
  form: TUseFormState<T>;
  disabled: boolean;
  isPending: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  updateFieldValue: (name: keyof T, value: T[keyof T], updatePrevValue?: boolean) => void;
  updateFieldError: (name: keyof T, error: string | null) => void;
  onSubmit: (e?: SubmitEvent<HTMLFormElement>) => Promise<void>;
}
