import {
  type ChangeEvent,
  type SubmitEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLatest } from "../useLatest.hook";
import { commitPrevValues, formatValue, initState, validateValue } from "./_helpers";
import type { IUseFormReturn, TFields, TInputs, TSubmitHandler, TUseFormState } from "./_types";

/**
 * Form state: field values, errors, dirty flags, submission and autosave.
 *
 * `resetOn` — a value whose change returns the form to the initial
 * `inputs` (for a sheet it is `isOpened`, for the recipe editor — `recipeId`).
 */
export function useForm<T extends TFields>(
  inputs: TInputs<T>,
  submitHandler?: TSubmitHandler<T>,
  saveOnChange?: boolean,
  resetOn?: unknown,
): IUseFormReturn<T> {
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState<TUseFormState<T>>(() => initState(inputs));

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestForm = useLatest(form);

  // Comparing during render, not in an effect — this is how React recommends
  // adjusting state to a prop change: only this component
  // restarts, before the commit and before the children render.
  const [prevResetOn, setPrevResetOn] = useState(resetOn);
  if (resetOn !== prevResetOn) {
    setPrevResetOn(resetOn);
    setForm(initState(inputs));
  }

  const isValid = useMemo((): boolean => {
    const haveErrors = Object.keys(form).some((key) => {
      const value = form[key].value;
      return form[key].error !== null || (form[key].required && (value === null || value === ""));
    });

    return !haveErrors;
  }, [form]);

  const isDirty = useMemo((): boolean => {
    // FIXME: the general isDirty compares value with prevValue for each field anew,
    // while a field has its own isDirty flag set by updateFieldValue —
    // they can diverge: updateFieldError resets isDirty only for its own
    // field and does not touch this general calculation.
    return Object.keys(form).some((key) => form[key].value !== form[key].prevValue);
  }, [form]);

  const updateFieldValue = useCallback(
    (name: keyof T, newValue: T[keyof T], updatePrevValue = false) => {
      const { value, validator, formatter } = latestForm.current[name];

      if (value !== newValue) {
        setForm((prev) => ({
          ...prev,
          [name]: {
            ...prev[name],
            // FIXME: validator receives the raw newValue, while the value written to state
            // has already passed through the formatter — if the formatter changes
            // the content (for example, trims whitespace), what gets validated is not what
            // ends up in the field.
            value: formatValue(formatter, newValue),
            error: validateValue(validator, newValue),
            prevValue: updatePrevValue ? formatValue(formatter, newValue) : prev[name].prevValue,
            isDirty: !updatePrevValue && newValue !== prev[name].prevValue,
          },
        }));
      }
    },
    [latestForm],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      const {
        target: { name, value },
      } = event;

      const inputName = (name as keyof T) || null;

      if (!inputName) {
        throw new Error("useForm onChange: input doesn't have a name");
      }

      if (latestForm.current[inputName] === undefined) {
        throw new Error("useForm onChange: no field with given name");
      }

      updateFieldValue(inputName, value as T[keyof T]);
    },
    [updateFieldValue, latestForm],
  );

  const updateFieldError = useCallback(
    (name: keyof T, error: string | null) => {
      if (latestForm.current[name].error !== error)
        setForm((prev) => ({ ...prev, [name]: { ...prev[name], isDirty: false, error } }));
    },
    [latestForm],
  );

  const updatePrevValues = useCallback(() => {
    setForm(commitPrevValues);
  }, []);

  const onSubmit = useCallback(
    async (e?: SubmitEvent<HTMLFormElement>) => {
      e?.preventDefault();

      // Submission is blocked while all fields match prevValue: an edit form
      // does not submit unchanged data. A create form with a default value
      // sets prevValue in inputs explicitly and counts as changed right away.
      // prevValue is updated only after a successful submit, so a retry
      // after a failure is available without editing fields.
      if (!isValid || !isDirty) return;

      if (submitHandler) {
        setIsPending(true);

        try {
          await submitHandler(latestForm.current, setForm);
          updatePrevValues();
        } catch {
          // A handler called from here throws on failure (as
          // mutateAsync does); showing the error is the caller's job (the general
          // MutationCache or the mutation's onError), here it is enough not to lock
          // the form against a retry.
        } finally {
          setIsPending(false);
        }
      }
    },
    [submitHandler, isValid, isDirty, latestForm, updatePrevValues],
  );

  useEffect(() => {
    if (!saveOnChange || !isValid || !isDirty) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      // FIXME: edits made while an autosave is in progress are marked saved after it
      // finishes — onSubmit records prevValue of all fields at once, and if the user
      // changed a field during the request, that change silently loses the isDirty
      // flag.
      await onSubmit();

      timeoutRef.current = null;
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // onSubmit is intentionally not in the dependencies: it changes together with submitHandler,
    // while the timer must restart only when the form fields themselves change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveOnChange, isValid, isDirty, form]);

  return {
    form,
    disabled: !isValid || !isDirty,
    isPending,
    onChange,
    updateFieldValue,
    updateFieldError,
    onSubmit,
  };
}
