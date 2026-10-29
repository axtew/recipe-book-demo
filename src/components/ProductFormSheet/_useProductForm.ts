import { useState } from "react";

import { useCreateProductWithVariantMutation } from "@/api/mutations/products.mutations";
import { productInputSchema, productVariantInputSchema } from "@/domain/schemas";
import { useForm } from "@/hooks/useForm";

import type { IUseProductFormProps, IUseProductFormResult, TProductFields } from "./_types";

/**
 * State of the form for creating a product with its first variant, and its reset when the sheet
 * opens.
 */
export function useProductForm({
  isOpened,
  initialName,
  validationError,
  submitError,
  onCreated,
}: IUseProductFormProps): IUseProductFormResult {
  const { mutateAsync } = useCreateProductWithVariantMutation();
  const [error, setError] = useState<string | null>(null);

  // The form-level error banner lives outside useForm — it survives the sheet opening/closing
  // separately from the fields and is reset by the same render-time comparison.
  const [wasOpened, setWasOpened] = useState(isOpened);
  if (isOpened !== wasOpened) {
    setWasOpened(isOpened);
    setError(null);
  }

  const { form, disabled, isPending, updateFieldValue, onSubmit } = useForm<TProductFields>(
    {
      name: { value: initialName, prevValue: "" },
      categoryId: "",
      kcal: "",
      protein: "",
      fat: "",
      carbs: "",
    },
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
        // Throw so useForm does not mark the form as “saved” — otherwise resubmitting the same
        // (still invalid) values would send nothing until the user changes at least one field.
        throw new Error("The product or variant failed validation");
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
    isSubmitDisabled: disabled || isPending,
    setName: (value) => updateFieldValue("name", value),
    setCategoryId: (value) => updateFieldValue("categoryId", value),
    setKcal: (value) => updateFieldValue("kcal", value),
    setProtein: (value) => updateFieldValue("protein", value),
    setFat: (value) => updateFieldValue("fat", value),
    setCarbs: (value) => updateFieldValue("carbs", value),
    handleSubmit: onSubmit,
  };
}
