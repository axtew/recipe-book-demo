import { NumberInput } from "@mantine/core";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { STextInput } from "@/components/TextInput";
import { B2, B3, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import { SActions, SCancel, SField, SForm, SSubmit } from "./_styles";
import type { IVariantFormSheetProps } from "./_types";
import { useVariantForm } from "./_useVariantForm";

/**
 * Bottom sheet добавления ещё одного варианта уже существующему продукту.
 *
 * В отличие от `ProductFormSheet` категория не нужна — продукт уже есть,
 * добавляется только строка в `product_variants` (однотабличная мутация).
 * Название варианта и все четыре числа КБЖУ необязательны.
 */
export function VariantFormSheet({ isOpened, productId, onClose }: IVariantFormSheetProps) {
  const l = useI18nSelector(({ l }) => ({ ...l.products.addVariantSheet, nutrients: l.nutrients }));

  const {
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
  } = useVariantForm({
    isOpened,
    productId,
    validationError: l.validationError,
    submitError: l.submitError,
    onClose,
  });

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SForm onSubmit={handleSubmit}>
        <SField>
          <Caption2 color="textMuted">{l.nameLabel}</Caption2>
          <STextInput
            type="text"
            placeholder={l.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </SField>

        <SField>
          <Caption2 color="textMuted">{l.nutrients.kcal}</Caption2>
          <NumberInput
            size="md"
            min={0}
            value={kcal}
            onChange={(nextValue) => setKcal(typeof nextValue === "number" ? nextValue : "")}
          />
        </SField>
        <SField>
          <Caption2 color="textMuted">{l.nutrients.protein}</Caption2>
          <NumberInput
            size="md"
            min={0}
            decimalScale={1}
            value={protein}
            onChange={(nextValue) => setProtein(typeof nextValue === "number" ? nextValue : "")}
          />
        </SField>
        <SField>
          <Caption2 color="textMuted">{l.nutrients.fat}</Caption2>
          <NumberInput
            size="md"
            min={0}
            decimalScale={1}
            value={fat}
            onChange={(nextValue) => setFat(typeof nextValue === "number" ? nextValue : "")}
          />
        </SField>
        <SField>
          <Caption2 color="textMuted">{l.nutrients.carbs}</Caption2>
          <NumberInput
            size="md"
            min={0}
            decimalScale={1}
            value={carbs}
            onChange={(nextValue) => setCarbs(typeof nextValue === "number" ? nextValue : "")}
          />
        </SField>

        {error !== null && <B3 color="danger">{error}</B3>}

        <SActions>
          <SCancel type="button" onClick={onClose}>
            <B2 as="span">{l.cancelButton}</B2>
          </SCancel>
          <SSubmit type="submit" disabled={isPending}>
            <B2 as="span">{l.submitButton}</B2>
          </SSubmit>
        </SActions>
      </SForm>
    </SBottomSheetDrawer>
  );
}
