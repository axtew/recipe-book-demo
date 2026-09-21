import { type SubmitEvent, useState } from "react";

import { useAddProductVariantMutation } from "@/api/mutations/products.mutations";
import { productVariantInputSchema } from "@/domain/schemas";

import type { IUseVariantFormProps, IUseVariantFormResult } from "./_types";

/** Состояние формы добавления варианта существующему продукту и сброс при открытии листа. */
export function useVariantForm({
  isOpened,
  productId,
  validationError,
  submitError,
  onClose,
}: IUseVariantFormProps): IUseVariantFormResult {
  const { mutate, isPending } = useAddProductVariantMutation();

  const [name, setName] = useState("");
  const [kcal, setKcal] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  // Сброс формы на открытии — сравнение во время рендера, а не в эффекте:
  // React рекомендует именно так подстраивать состояние под смену пропа.
  const [wasOpened, setWasOpened] = useState(isOpened);
  if (isOpened !== wasOpened) {
    setWasOpened(isOpened);
    if (isOpened) {
      setName("");
      setKcal("");
      setProtein("");
      setFat("");
      setCarbs("");
      setError(null);
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);

    const variantResult = productVariantInputSchema.safeParse({
      name: name.trim() === "" ? null : name,
      kcal100: kcal === "" ? null : kcal,
      protein100: protein === "" ? null : protein,
      fat100: fat === "" ? null : fat,
      carbs100: carbs === "" ? null : carbs,
      isApproximate: false,
      source: "manual",
      note: null,
    });

    if (!variantResult.success) {
      setError(validationError);
      return;
    }

    mutate(
      { productId, variant: variantResult.data },
      {
        onSuccess: onClose,
        onError: () => setError(submitError),
      },
    );
  }

  return {
    name,
    kcal,
    protein,
    fat,
    carbs,
    error,
    isPending,
    setName,
    setKcal,
    setProtein,
    setFat,
    setCarbs,
    handleSubmit,
  };
}
