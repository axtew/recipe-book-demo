import { useState } from "react";

import { useCreateCookLogMutation } from "@/api/mutations/cookLogs.mutations";
import { cookLogInputSchema } from "@/domain/schemas";
import { useForm } from "@/hooks/useForm";
import { getTodayDate } from "@/utils/helpers/dates";

import type { IUseCookLogFormProps, IUseCookLogFormResult, TCookLogFields } from "./_types";

/**
 * State of the cook log form, and its reset when the sheet opens.
 *
 * The “today” date and the ×1 multiplier are meaningful input on their own, so their `prevValue` is
 * empty: the form counts as changed from the first render, and the entry is created without
 * touching a single field.
 */
export function useCookLogForm({
  isOpened,
  recipeId,
  snapshot,
  validationError,
  submitError,
  onSaved,
}: IUseCookLogFormProps): IUseCookLogFormResult {
  const { mutateAsync } = useCreateCookLogMutation();
  const [error, setError] = useState<string | null>(null);

  // The error banner lives outside useForm and is reset by the same render-time comparison.
  const [wasOpened, setWasOpened] = useState(isOpened);
  if (isOpened !== wasOpened) {
    setWasOpened(isOpened);
    setError(null);
  }

  const { form, disabled, isPending, updateFieldValue, onSubmit } = useForm<TCookLogFields>(
    {
      cookedAt: { value: getTodayDate(), prevValue: "", required: true },
      multiplier: { value: 1, prevValue: "", required: true },
      actualYieldGrams: "",
      containers: "",
      rating: null,
      note: "",
    },
    async (state) => {
      setError(null);

      const note = state.note.value.trim();
      const result = cookLogInputSchema.safeParse({
        cookedAt: state.cookedAt.value,
        multiplier: state.multiplier.value,
        actualYieldGrams: state.actualYieldGrams.value === "" ? null : state.actualYieldGrams.value,
        containers: state.containers.value === "" ? null : state.containers.value,
        finishedAt: null,
        rating: state.rating.value,
        note: note === "" ? null : note,
        snapshot,
      });

      if (!result.success) {
        setError(validationError);
        // Throw so useForm does not mark the form as “saved”.
        throw new Error("The cook log entry failed validation");
      }

      try {
        await mutateAsync({ recipeId, log: result.data });
        onSaved();
      } catch (mutationError) {
        setError(submitError);
        throw mutationError;
      }
    },
    false,
    isOpened,
  );

  return {
    cookedAt: form.cookedAt.value,
    multiplier: form.multiplier.value,
    actualYieldGrams: form.actualYieldGrams.value,
    containers: form.containers.value,
    rating: form.rating.value,
    note: form.note.value,
    error,
    isSubmitDisabled: disabled || isPending,
    setCookedAt: (value) => updateFieldValue("cookedAt", value),
    setMultiplier: (value) => updateFieldValue("multiplier", value),
    setActualYieldGrams: (value) => updateFieldValue("actualYieldGrams", value),
    setContainers: (value) => updateFieldValue("containers", value),
    setRating: (value) => updateFieldValue("rating", value),
    setNote: (value) => updateFieldValue("note", value),
    handleSubmit: onSubmit,
  };
}
