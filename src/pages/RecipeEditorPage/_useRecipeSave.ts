import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
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
  /** A compressed photo chosen in this session and not yet uploaded. */
  photoFile: File | null;
  finishDraft: () => void;
}

/**
 * Submitting a recipe: schema validation, uploading a new photo, saving it as a whole.
 *
 * The photo goes to Storage before the recipe: a failed save leaves a harmless file without an
 * owner, while the reverse order would give a recipe linking to a nonexistent file. The mutation
 * error is shown by the common `MutationCache` as a toast; here it only sets the message under the
 * button and does not lock the form against a retry.
 */
export function useRecipeSave({ recipeId, recipe, draft, photoFile, finishDraft }: IProps) {
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const { mutateAsync: saveRecipe } = useSaveRecipeMutation();
  const { mutateAsync: uploadPhoto } = useUploadRecipePhotoMutation();

  const [error, setError] = useState<TSaveError | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // The product and variant creation sheets sit inside the ingredient rows and have their own
    // forms. The portal moves them into body, but the submit event bubbles up the React tree and
    // would reach here — the recipe would be saved instead of the product.
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

      // When editing — a step back to the card the editor was opened from, so the history does not
      // keep a “card → editor → card” pair. A new recipe replaces the creation page: “back” from
      // its card leads to where the user came from.
      if (recipe !== null && canGoBack) {
        router.history.back();
      } else {
        await navigate({ to: routerPaths.recipeCard, params: { recipeId }, replace: true });
      }
    } catch {
      setError("submit");
    } finally {
      setIsPending(false);
    }
  }

  return { error, isPending, handleSubmit };
}
