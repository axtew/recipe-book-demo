import { useFinishCookLogMutation } from "@/api/mutations/cookLogs.mutations";
import { useForm } from "@/hooks/useForm";
import { getTodayDate } from "@/utils/helpers/dates";

import type { IUseFinishFormProps, TFinishFields } from "./_types";

/**
 * State of the form for picking the “finished” date, and its reset when the sheet opens.
 *
 * Today's date is a meaningful input on its own, so `prevValue` is empty and it can be confirmed
 * without picking. A save error is shown by the common mutation handler.
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
