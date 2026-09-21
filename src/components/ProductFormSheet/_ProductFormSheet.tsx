import { NumberInput } from "@mantine/core";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { B2, B3, Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useProductCategories } from "@/hooks/useAppData.hook";

import { SActions, SCancel, SField, SForm, SInput, SSelect, SSubmit } from "./_styles";
import type { IProductFormSheetProps } from "./_types";
import { useProductForm } from "./_useProductForm";

/**
 * Bottom sheet быстрого создания продукта с первым вариантом.
 *
 * Одна форма — две сущности: продукт и вариант создаются одним вызовом
 * `useCreateProductWithVariantMutation` (функция в базе, одна транзакция).
 * Все четыре числа КБЖУ необязательны — продукт с пустым вариантом валиден и
 * попадает в «неполное КБЖУ» на экране рецепта.
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
    isPending,
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
      <SForm onSubmit={handleSubmit}>
        <SField>
          <Caption2 color="textMuted">{l.nameLabel}</Caption2>
          <SInput
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </SField>

        <SField>
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
