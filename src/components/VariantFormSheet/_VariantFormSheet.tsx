import { NumberInput } from "@mantine/core";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { Button } from "@/components/Button";
import { SSheetActions, SSheetField, SSheetForm } from "@/components/SheetForm";
import { STextInput } from "@/components/TextInput";
import { B3, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";

import type { IVariantFormSheetProps } from "./_types";
import { useVariantForm } from "./_useVariantForm";

/**
 * Bottom sheet for adding one more variant to an existing product.
 *
 * Unlike `ProductFormSheet` no category is needed — the product already exists, only a row in
 * `product_variants` is added (a single-table mutation). The variant name and all four nutrition
 * numbers are optional.
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
    isSubmitDisabled,
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
      <SSheetForm onSubmit={handleSubmit}>
        <SSheetField>
          <Caption2 color="textMuted">{l.nameLabel}</Caption2>
          <STextInput
            type="text"
            placeholder={l.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </SSheetField>

        <SSheetField>
          <Caption2 color="textMuted">{l.nutrients.kcal}</Caption2>
          <NumberInput
            size="md"
            min={0}
            value={kcal}
            onChange={(nextValue) => setKcal(typeof nextValue === "number" ? nextValue : "")}
          />
        </SSheetField>
        <SSheetField>
          <Caption2 color="textMuted">{l.nutrients.protein}</Caption2>
          <NumberInput
            size="md"
            min={0}
            decimalScale={1}
            value={protein}
            onChange={(nextValue) => setProtein(typeof nextValue === "number" ? nextValue : "")}
          />
        </SSheetField>
        <SSheetField>
          <Caption2 color="textMuted">{l.nutrients.fat}</Caption2>
          <NumberInput
            size="md"
            min={0}
            decimalScale={1}
            value={fat}
            onChange={(nextValue) => setFat(typeof nextValue === "number" ? nextValue : "")}
          />
        </SSheetField>
        <SSheetField>
          <Caption2 color="textMuted">{l.nutrients.carbs}</Caption2>
          <NumberInput
            size="md"
            min={0}
            decimalScale={1}
            value={carbs}
            onChange={(nextValue) => setCarbs(typeof nextValue === "number" ? nextValue : "")}
          />
        </SSheetField>

        {error !== null && <B3 color="danger">{error}</B3>}

        <SSheetActions>
          <Button variant="secondary" type="button" onClick={onClose}>
            {l.cancelButton}
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitDisabled}>
            {l.submitButton}
          </Button>
        </SSheetActions>
      </SSheetForm>
    </SBottomSheetDrawer>
  );
}
