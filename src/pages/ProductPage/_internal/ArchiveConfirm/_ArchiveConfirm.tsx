import { useArchiveProductMutation } from "@/api/mutations/products.mutations";
import { SBottomSheetDrawer } from "@/components/BottomSheetDrawer";
import { Button } from "@/components/Button";
import { SSheetActions } from "@/components/SheetForm";
import { B2, Caption1 } from "@/components/Typography";
import { useI18nSelector } from "@/context/I18nContext";
import type { IRecipe } from "@/types/recipes.types";

import { SContent, SRecipes } from "./_styles";

interface IProps {
  isOpened: boolean;
  productId: string;
  usedInRecipes: IRecipe[];
  onClose: () => void;
}

/**
 * Подтверждение архивирования продукта.
 *
 * Использование в рецептах операцию не запрещает, а только предупреждает:
 * продукт остаётся в составе уже написанных рецептов и пропадает лишь из
 * списков и выбора.
 */
export function ArchiveConfirm({ isOpened, productId, usedInRecipes, onClose }: IProps) {
  const l = useI18nSelector(({ l }) => l.products.archiveConfirm);
  const { mutate, isPending } = useArchiveProductMutation();

  const handleConfirm = () => {
    mutate(productId, { onSuccess: onClose });
  };

  return (
    <SBottomSheetDrawer opened={isOpened} onClose={onClose} position="bottom" title={l.title}>
      <SContent>
        <B2 color="textMuted">{l.description}</B2>

        {usedInRecipes.length > 0 && (
          <>
            <B2>{l.usedInWarning}</B2>
            <SRecipes>
              {usedInRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <Caption1>{recipe.name}</Caption1>
                </li>
              ))}
            </SRecipes>
          </>
        )}

        <SSheetActions>
          <Button variant="secondary" type="button" onClick={onClose}>
            {l.cancelButton}
          </Button>
          <Button variant="danger" type="button" disabled={isPending} onClick={handleConfirm}>
            {l.confirmButton}
          </Button>
        </SSheetActions>
      </SContent>
    </SBottomSheetDrawer>
  );
}
