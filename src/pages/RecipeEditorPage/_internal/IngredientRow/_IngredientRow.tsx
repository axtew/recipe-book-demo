import { NumberInput } from "@mantine/core";
import { useRef, useState } from "react";

import { ProductPicker } from "@/components/ProductPicker";
import { Caption2 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import { useProductsById } from "@/hooks/useAppData.hook";
import type { IRecipeIngredientDraft } from "@/types/recipes.types";

import { IngredientOptionsSheet } from "./_internal/IngredientOptionsSheet";
import { SBadges, SBody, SMenuButton, SMetaLine, SPickerLine } from "./_styles";

interface IProps {
  ingredient: IRecipeIngredientDraft;
  onChange: (patch: Partial<IRecipeIngredientDraft>) => void;
  onRemove: () => void;
}

/**
 * Строка состава: выбор продукта, граммы и меню действий над строкой.
 *
 * После выбора (или инлайн-создания) продукта фокус уходит на поле граммов —
 * ингредиент вводится без лишних тапов, экран рецепта не покидается.
 */
export function IngredientRow({ ingredient, onChange, onRemove }: IProps) {
  const l = useI18nSelector(({ l }) => l.recipeEditor.ingredient);
  const productsById = useProductsById();
  const gramsRef = useRef<HTMLInputElement>(null);
  const [isOptionsOpened, setIsOptionsOpened] = useState(false);

  const product =
    ingredient.productId === null ? null : (productsById.get(ingredient.productId) ?? null);
  const pinnedVariant =
    product?.variants.find((variant) => variant.id === ingredient.pinnedVariantId) ?? null;

  function handleProductChange(productId: string) {
    onChange({ productId, pinnedVariantId: null });
    // Фокус переносится после коммита: к этому моменту выпадающий список или
    // лист создания продукта уже закрыт и не перехватывает его обратно.
    setTimeout(() => gramsRef.current?.focus(), 0);
  }

  return (
    <SBody>
      <SPickerLine>
        <ProductPicker value={ingredient.productId} onChange={handleProductChange} />
        <SMenuButton
          type="button"
          aria-label={l.menuLabel}
          onClick={() => setIsOptionsOpened(true)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <circle cx="4" cy="10" r="1.8" />
            <circle cx="10" cy="10" r="1.8" />
            <circle cx="16" cy="10" r="1.8" />
          </svg>
        </SMenuButton>
      </SPickerLine>

      <SMetaLine>
        <NumberInput
          size="md"
          enterKeyHint="done"
          ref={gramsRef}
          aria-label={l.gramsLabel}
          placeholder={l.gramsPlaceholder}
          min={0}
          decimalScale={1}
          suffix={` ${l.gramsUnit}`}
          value={ingredient.amountGrams ?? ""}
          onChange={(value) => onChange({ amountGrams: typeof value === "number" ? value : null })}
        />
        <SBadges>
          {ingredient.isOptional && <Caption2 color="textMuted">{l.optionalBadge}</Caption2>}
          {pinnedVariant !== null && (
            <Caption2 color="textMuted">
              {l.pinnedBadge}: {pinnedVariant.name ?? l.unnamedVariant}
            </Caption2>
          )}
          {ingredient.note.trim() !== "" && (
            <Caption2 color="textMuted">{ingredient.note}</Caption2>
          )}
        </SBadges>
      </SMetaLine>

      <IngredientOptionsSheet
        isOpened={isOptionsOpened}
        ingredient={ingredient}
        product={product}
        onChange={onChange}
        onRemove={onRemove}
        onClose={() => setIsOptionsOpened(false)}
      />
    </SBody>
  );
}
