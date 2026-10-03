import { useState } from "react";

import { useCreateProductWithVariantMutation } from "@/api/mutations/products.mutations";
import { productInputSchema, productVariantInputSchema } from "@/domain/schemas";
import { useForm } from "@/hooks/useForm";

import type { IUseProductFormProps, IUseProductFormResult, TProductFields } from "./_types";

/** Состояние формы создания продукта с первым вариантом и сброс при открытии листа. */
export function useProductForm({
  isOpened,
  initialName,
  validationError,
  submitError,
  onCreated,
}: IUseProductFormProps): IUseProductFormResult {
  const { mutateAsync } = useCreateProductWithVariantMutation();
  const [error, setError] = useState<string | null>(null);

  // Баннер общей ошибки формы живёт вне useForm — переживает открытие/закрытие
  // листа отдельно от полей, сбрасывается тем же сравнением во время рендера.
  const [wasOpened, setWasOpened] = useState(isOpened);
  if (isOpened !== wasOpened) {
    setWasOpened(isOpened);
    setError(null);
  }

  const { form, isPending, updateFieldValue, onSubmit } = useForm<TProductFields>(
    { name: initialName, categoryId: "", kcal: "", protein: "", fat: "", carbs: "" },
    async (state) => {
      setError(null);

      const productResult = productInputSchema.safeParse({
        name: state.name.value,
        categoryId: state.categoryId.value,
        note: null,
      });
      const variantResult = productVariantInputSchema.safeParse({
        name: null,
        kcal100: state.kcal.value === "" ? null : state.kcal.value,
        protein100: state.protein.value === "" ? null : state.protein.value,
        fat100: state.fat.value === "" ? null : state.fat.value,
        carbs100: state.carbs.value === "" ? null : state.carbs.value,
        isApproximate: false,
        source: "manual",
        note: null,
      });

      if (!productResult.success || !variantResult.success) {
        setError(validationError);
        // Бросаем, чтобы useForm не пометил форму «сохранённой» — иначе
        // повторная отправка тех же (всё ещё невалидных) значений ничего не
        // отправит, пока пользователь не поменяет хоть одно поле.
        throw new Error("Продукт или вариант не прошли валидацию");
      }

      try {
        const productId = await mutateAsync({
          product: productResult.data,
          variant: variantResult.data,
        });
        onCreated({ id: productId, name: productResult.data.name });
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
    categoryId: form.categoryId.value,
    kcal: form.kcal.value,
    protein: form.protein.value,
    fat: form.fat.value,
    carbs: form.carbs.value,
    error,
    isPending,
    setName: (value) => updateFieldValue("name", value),
    setCategoryId: (value) => updateFieldValue("categoryId", value),
    setKcal: (value) => updateFieldValue("kcal", value),
    setProtein: (value) => updateFieldValue("protein", value),
    setFat: (value) => updateFieldValue("fat", value),
    setCarbs: (value) => updateFieldValue("carbs", value),
    handleSubmit: onSubmit,
  };
}
