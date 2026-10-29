import { NumberInput } from "@mantine/core";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { Button } from "@/components/Button";
import { SSelect } from "@/components/Select";
import { SSheetActions, SSheetField, SSheetForm } from "@/components/SheetForm";
import { STextInput } from "@/components/TextInput";
import { B3, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useProductCategories } from "@/hooks/useAppData.hook";

import type { IProductFormSheetProps } from "./_types";
import { useProductForm } from "./_useProductForm";

/**
 * Bottom sheet for quickly creating a product with its first variant.
 *
 * One form, two entities: the product and the variant are created by a single call to
 * `useCreateProductWithVariantMutation` (a database function, one transaction). All four nutrition
 * numbers are optional — a product with an empty variant is valid and lands in “incomplete
 * nutrition” on the recipe screen.
 */
export function ProductFormSheet({
  isOpened,
  initialName,
  onClose,
  onCreated,
}: IProductFormSheetProps) {
  const l = useI18nSelector(({ l }) => ({ ...l.products.createSheet, nutrients: l.nutrients }));
  const categories = useProductCategories();

  const {
    name,
    categoryId,
    kcal,
    protein,
    fat,
    carbs,
    error,
    isSubmitDisabled,
    setName,
    setCategoryId,
    setKcal,
    setProtein,
    setFat,
    setCarbs,
    handleSubmit,
  } = useProductForm({
    isOpened,
    initialName,
    validationError: l.validationError,
    submitError: l.submitError,
    onCreated,
  });

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SSheetForm onSubmit={handleSubmit}>
        <SSheetField>
          <Caption2 color="textMuted">{l.nameLabel}</Caption2>
          <STextInput
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </SSheetField>

        <SSheetField>
          <Caption2 color="textMuted">{l.categoryLabel}</Caption2>
          <SSelect
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">{l.categoryPlaceholder}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SSelect>
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
