import { useState } from "react";

import { useAddProductVariantMutation } from "@/api/mutations/products.mutations";
import { productVariantInputSchema } from "@/domain/schemas";
import { useForm } from "@/hooks/useForm";

import type { IUseVariantFormProps, IUseVariantFormResult, TVariantFields } from "./_types";

/** Состояние формы добавления варианта существующему продукту и сброс при открытии листа. */
export function useVariantForm({
  isOpened,
  productId,
  validationError,
  submitError,
  onClose,
}: IUseVariantFormProps): IUseVariantFormResult {
  const { mutateAsync } = useAddProductVariantMutation();
  const [error, setError] = useState<string | null>(null);

  // Баннер общей ошибки формы живёт вне useForm — переживает открытие/закрытие
  // листа отдельно от полей, сбрасывается тем же сравнением во время рендера.
  const [wasOpened, setWasOpened] = useState(isOpened);
  if (isOpened !== wasOpened) {
    setWasOpened(isOpened);
    setError(null);
  }

  const { form, disabled, isPending, updateFieldValue, onSubmit } = useForm<TVariantFields>(
    { name: "", kcal: "", protein: "", fat: "", carbs: "" },
    async (state) => {
      setError(null);

      const variantResult = productVariantInputSchema.safeParse({
        name: state.name.value.trim() === "" ? null : state.name.value,
        kcal100: state.kcal.value === "" ? null : state.kcal.value,
        protein100: state.protein.value === "" ? null : state.protein.value,
        fat100: state.fat.value === "" ? null : state.fat.value,
        carbs100: state.carbs.value === "" ? null : state.carbs.value,
        isApproximate: false,
        source: "manual",
        note: null,
      });

      if (!variantResult.success) {
        setError(validationError);
        // Бросаем, чтобы useForm не пометил форму «сохранённой» — иначе
        // повторная отправка тех же (всё ещё невалидных) значений ничего не
        // отправит, пока пользователь не поменяет хоть одно поле.
        throw new Error("Вариант не прошёл валидацию");
      }

      try {
        await mutateAsync({ productId, variant: variantResult.data });
        onClose();
      } catch (mutationError) {
        setError(submitError);
        throw mutationError;
      }
    },
    false,
    isOpened,
  );

  return {
    name: form.name.value,
    kcal: form.kcal.value,
    protein: form.protein.value,
    fat: form.fat.value,
    carbs: form.carbs.value,
    error,
    isSubmitDisabled: disabled || isPending,
    setName: (value) => updateFieldValue("name", value),
    setKcal: (value) => updateFieldValue("kcal", value),
    setProtein: (value) => updateFieldValue("protein", value),
    setFat: (value) => updateFieldValue("fat", value),
    setCarbs: (value) => updateFieldValue("carbs", value),
    handleSubmit: onSubmit,
  };
}
