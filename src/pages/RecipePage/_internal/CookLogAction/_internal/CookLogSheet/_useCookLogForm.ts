import { useState } from "react";

import { useCreateCookLogMutation } from "@/api/mutations/cookLogs.mutations";
import { cookLogInputSchema } from "@/domain/schemas";
import { useForm } from "@/hooks/useForm";
import { getTodayDate } from "@/utils/helpers/dates";

import type { IUseCookLogFormProps, IUseCookLogFormResult, TCookLogFields } from "./_types";

/**
 * Состояние формы записи готовки и сброс при открытии листа.
 *
 * Дата «сегодня» и множитель ×1 — осмысленный ввод сами по себе, поэтому их
 * `prevValue` задан пустым: форма считается изменённой с первого рендера, и
 * запись создаётся без единой правки полей.
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

  // Баннер ошибки живёт вне useForm и сбрасывается тем же сравнением во время рендера.
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
        // Бросаем, чтобы useForm не пометил форму «сохранённой».
        throw new Error("Запись журнала не прошла валидацию");
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
