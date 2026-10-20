import { useNavigate } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";

import {
  useSaveRecipeMutation,
  useUploadRecipePhotoMutation,
} from "@/api/mutations/recipes.mutations";
import { recipeInputSchema } from "@/domain/schemas";
import { routerPaths } from "@/routes/_paths";
import type { IRecipe, IRecipeDraft } from "@/types/recipes.types";

import { buildRecipeCandidate, getOverrideColumns, getValidationKey } from "./_helpers";
import type { TSaveError } from "./_types";

interface IProps {
  recipeId: string;
  recipe: IRecipe | null;
  draft: IRecipeDraft;
  /** Сжатое фото, выбранное в этой сессии и ещё не загруженное. */
  photoFile: File | null;
  finishDraft: () => void;
}

/**
 * Отправка рецепта: проверка схемой, загрузка нового фото, сохранение целиком.
 *
 * Фото уходит в Storage до рецепта: отказ сохранения оставит безвредный файл без
 * владельца, а обратный порядок дал бы рецепт со ссылкой на несуществующий файл.
 * Ошибку мутации показывает общий `MutationCache` тостом; здесь она лишь
 * выставляет сообщение под кнопкой и не запирает форму для повтора.
 */
export function useRecipeSave({ recipeId, recipe, draft, photoFile, finishDraft }: IProps) {
  const navigate = useNavigate();
  const { mutateAsync: saveRecipe } = useSaveRecipeMutation();
  const { mutateAsync: uploadPhoto } = useUploadRecipePhotoMutation();

  const [error, setError] = useState<TSaveError | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // Листы создания продукта и варианта лежат внутри строк состава и имеют свои
    // формы. Портал выносит их в body, но событие submit всплывает по дереву
    // React и дошло бы сюда — рецепт ушёл бы на сохранение вместо продукта.
    if (event.target !== event.currentTarget) return;

    setError(null);

    const result = recipeInputSchema.safeParse(
      buildRecipeCandidate(draft, {
        photoPath: draft.photoPath,
        overrides: getOverrideColumns(recipe),
      }),
    );

    if (!result.success) {
      setError(getValidationKey(result.error.issues[0].path));
      return;
    }

    setIsPending(true);

    try {
      const photoPath =
        photoFile === null
          ? result.data.photoPath
          : await uploadPhoto({ recipeId, file: photoFile });

      await saveRecipe({ recipeId, recipe: { ...result.data, photoPath } });

      finishDraft();
      await navigate({ to: routerPaths.recipeCard, params: { recipeId } });
    } catch {
      setError("submit");
    } finally {
      setIsPending(false);
    }
  }

  return { error, isPending, handleSubmit };
}
