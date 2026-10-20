import { useState } from "react";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { SSelect } from "@/components/Select";
import { B2, Caption2 } from "@/components/Typography";
import { VariantFormSheet } from "@/components/VariantFormSheet";
import { useI18nSelector } from "@/context/I18nContext";
import type { IProduct } from "@/types/products.types";
import type { IRecipeIngredientDraft } from "@/types/recipes.types";

import { SDangerButton, SField, SInput, SSecondaryButton } from "../../../../_styles";
import { SActions, SCheckbox, SCheckboxLabel, SSheetBody } from "./_styles";

interface IProps {
  isOpened: boolean;
  ingredient: IRecipeIngredientDraft;
  product: IProduct | null;
  onChange: (patch: Partial<IRecipeIngredientDraft>) => void;
  onRemove: () => void;
  onClose: () => void;
}

/**
 * Меню строки состава: необязательность, закреплённый вариант, заметка, удаление.
 *
 * Оформлено нижним листом, а не выпадающим меню: на телефоне это крупные
 * цели нажатия и системная клавиатура для заметки без борьбы за место.
 */
export function IngredientOptionsSheet({
  isOpened,
  ingredient,
  product,
  onChange,
  onRemove,
  onClose,
}: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.ingredient.sheet);
  const [isVariantSheetOpened, setIsVariantSheetOpened] = useState(false);

  const variants =
    product?.variants.filter(
      (variant) => variant.archivedAt === null || variant.id === ingredient.pinnedVariantId,
    ) ?? [];

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SSheetBody>
        <SCheckboxLabel>
          <SCheckbox
            type="checkbox"
            checked={ingredient.isOptional}
            onChange={(event) => onChange({ isOptional: event.target.checked })}
          />
          <B2 as="span">{l.optionalLabel}</B2>
        </SCheckboxLabel>

        {product !== null && (
          <>
            <SField>
              <Caption2 color="textMuted">{l.pinnedLabel}</Caption2>
              <SSelect
                value={ingredient.pinnedVariantId ?? ""}
                onChange={(event) =>
                  onChange({
                    pinnedVariantId: event.target.value === "" ? null : event.target.value,
                  })
                }
              >
                <option value="">{l.pinnedAuto}</option>
                {variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name ?? l.unnamedVariant}
                  </option>
                ))}
              </SSelect>
            </SField>

            <SSecondaryButton type="button" onClick={() => setIsVariantSheetOpened(true)}>
              <B2 as="span">{l.addVariant}</B2>
            </SSecondaryButton>

            <VariantFormSheet
              isOpened={isVariantSheetOpened}
              productId={product.id}
              onClose={() => setIsVariantSheetOpened(false)}
            />
          </>
        )}

        <SField>
          <Caption2 color="textMuted">{l.noteLabel}</Caption2>
          <SInput
            type="text"
            placeholder={l.notePlaceholder}
            value={ingredient.note}
            onChange={(event) => onChange({ note: event.target.value })}
          />
        </SField>

        <SActions>
          <SDangerButton type="button" onClick={onRemove}>
            <B2 as="span">{l.remove}</B2>
          </SDangerButton>
          <SSecondaryButton type="button" onClick={onClose}>
            <B2 as="span">{l.done}</B2>
          </SSecondaryButton>
        </SActions>
      </SSheetBody>
    </SBottomSheetDrawer>
  );
}
