import { useState } from "react";

import { useAddProductVariantMutation } from "@/api/mutations/products.mutations";
import { productVariantInputSchema } from "@/domain/schemas";
import { useForm } from "@/hooks/useForm";

import type { IUseVariantFormProps, IUseVariantFormResult, TVariantFields } from "./_types";

/**
 * State of the form for adding a variant to an existing product, and its reset when the sheet
 * opens.
 */
export function useVariantForm({
  isOpened,
  productId,
  validationError,
  submitError,
  onClose,
}: IUseVariantFormProps): IUseVariantFormResult {
  const { mutateAsync } = useAddProductVariantMutation();
  const [error, setError] = useState<string | null>(null);

  // The form-level error banner lives outside useForm — it survives the sheet opening/closing
  // separately from the fields and is reset by the same render-time comparison.
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
        // Throw so useForm does not mark the form as “saved” — otherwise resubmitting the same
        // (still invalid) values would send nothing until the user changes at least one field.
        throw new Error("The variant failed validation");
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
