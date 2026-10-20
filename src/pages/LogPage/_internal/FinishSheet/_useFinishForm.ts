import { useFinishCookLogMutation } from "@/api/mutations/cookLogs.mutations";
import { useForm } from "@/hooks/useForm";
import { getTodayDate } from "@/utils/helpers/dates";

import type { IUseFinishFormProps, TFinishFields } from "./_types";

/**
 * Состояние формы выбора даты «доели» и сброс при открытии листа.
 *
 * Сегодняшняя дата сама по себе осмысленный ввод, поэтому `prevValue` пуст и
 * подтвердить можно без выбора. Ошибку записи показывает общий обработчик мутаций.
 */
export function useFinishForm({ isOpened, logId, onSaved }: IUseFinishFormProps) {
  const { mutateAsync } = useFinishCookLogMutation();

  const { form, disabled, isPending, updateFieldValue, onSubmit } = useForm<TFinishFields>(
    { finishedAt: { value: getTodayDate(), prevValue: "", required: true } },
    async (state) => {
      await mutateAsync({ id: logId, finishedAt: state.finishedAt.value });
      onSaved();
    },
    false,
    isOpened,
  );

  return {
    finishedAt: form.finishedAt.value,
    isSubmitDisabled: disabled || isPending,
    setFinishedAt: (value: string) => updateFieldValue("finishedAt", value),
    handleSubmit: onSubmit,
  };
}
