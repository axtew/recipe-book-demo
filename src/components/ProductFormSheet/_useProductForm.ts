import { type SubmitEvent, useState } from "react";

import { useCreateProductWithVariantMutation } from "@/api/mutations/products.mutations";
import { productInputSchema, productVariantInputSchema } from "@/domain/schemas";

import type { IUseProductFormProps, IUseProductFormResult } from "./_types";

/** Состояние формы создания продукта с первым вариантом и сброс при открытии листа. */
export function useProductForm({
  isOpened,
  initialName,
  validationError,
  submitError,
  onCreated,
}: IUseProductFormProps): IUseProductFormResult {
  const { mutate, isPending } = useCreateProductWithVariantMutation();

  const [name, setName] = useState(initialName);
  const [categoryId, setCategoryId] = useState("");
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
      setName(initialName);
      setCategoryId("");
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

    const productResult = productInputSchema.safeParse({ name, categoryId, note: null });
    const variantResult = productVariantInputSchema.safeParse({
      name: null,
      kcal100: kcal === "" ? null : kcal,
      protein100: protein === "" ? null : protein,
      fat100: fat === "" ? null : fat,
      carbs100: carbs === "" ? null : carbs,
      isApproximate: false,
      source: "manual",
      note: null,
    });

    if (!productResult.success || !variantResult.success) {
      setError(validationError);
      return;
    }

    mutate(
      { product: productResult.data, variant: variantResult.data },
      {
        onSuccess: (productId) => {
          onCreated({ id: productId, name: productResult.data.name });
        },
        onError: () => setError(submitError),
      },
    );
  }

  return {
    name,
    categoryId,
    kcal,
    protein,
    fat,
    carbs,
    error,
    isPending,
    setName,
    setCategoryId,
    setKcal,
    setProtein,
    setFat,
    setCarbs,
    handleSubmit,
  };
}
