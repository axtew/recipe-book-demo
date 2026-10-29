import { useState } from "react";

import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { Button } from "@/components/Button";
import { SSelect } from "@/components/Select";
import { SSheetField, SSheetForm } from "@/components/SheetForm";
import { STextInput } from "@/components/TextInput";
import { B2, Caption2 } from "@/components/Typography";
import { VariantFormSheet } from "@/components/VariantFormSheet";
import { useI18nSelector } from "@/context/I18nContext";
import type { IProduct } from "@/types/products.types";
import type { IRecipeIngredientDraft } from "@/types/recipes.types";

import { SActions, SCheckbox, SCheckboxLabel } from "./_styles";

interface IProps {
  isOpened: boolean;
  ingredient: IRecipeIngredientDraft;
  product: IProduct | null;
  onChange: (patch: Partial<IRecipeIngredientDraft>) => void;
  onRemove: () => void;
  onClose: () => void;
}

/**
 * Ingredient row menu: optionality, pinned variant, note, deletion.
 *
 * Styled as a bottom sheet rather than a dropdown menu: on a phone these are large tap targets and
 * the system keyboard for the note without fighting for space.
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
      <SSheetForm as="div">
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
            <SSheetField>
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
            </SSheetField>

            <Button variant="secondary" type="button" onClick={() => setIsVariantSheetOpened(true)}>
              {l.addVariant}
            </Button>

            <VariantFormSheet
              isOpened={isVariantSheetOpened}
              productId={product.id}
              onClose={() => setIsVariantSheetOpened(false)}
            />
          </>
        )}

        <SSheetField>
          <Caption2 color="textMuted">{l.noteLabel}</Caption2>
          <STextInput
            type="text"
            placeholder={l.notePlaceholder}
            value={ingredient.note}
            onChange={(event) => onChange({ note: event.target.value })}
          />
        </SSheetField>

        <SActions>
          <Button variant="dangerOutline" type="button" onClick={onRemove}>
            {l.remove}
          </Button>
          <Button variant="secondary" type="button" onClick={onClose}>
            {l.done}
          </Button>
        </SActions>
      </SSheetForm>
    </SBottomSheetDrawer>
  );
}
