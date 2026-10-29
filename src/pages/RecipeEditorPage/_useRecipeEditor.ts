import { useEffect, useMemo, useState } from "react";

import { useForm } from "@/hooks/useForm";
import type { IRecipeDraft } from "@/types/recipes.types";

import {
  areDraftsEqual,
  createId,
  draftToFields,
  fieldsToDraftPart,
  getNutritionOverrides,
} from "./_helpers";
import type { IRecipeFormProps, TRecipeFields } from "./_types";
import { useKeyedList } from "./_useKeyedList";
import { useRecipeNutrition } from "./_useRecipeNutrition";
import { useRecipeSave } from "./_useRecipeSave";

/**
 * Editor state: scalar fields in `useForm`, lists alongside, the draft in localStorage, nutrition
 * on the fly and submission.
 *
 * Lists are not kept in `useForm`: its fields are strings, numbers and flags. For the same reason
 * the draft autosave does not rely on the form's `saveOnChange` — it would see only the scalar
 * fields and miss edits to ingredients and steps.
 */
export function useRecipeEditor({
  recipeId,
  recipe,
  initialDraft,
  saveDraft,
  finishDraft,
}: IRecipeFormProps) {
  // The id of a new recipe is issued in advance: the photo goes to Storage under it before saving,
  // and a retry after a failure updates the same recipe.
  const [savedRecipeId] = useState(() => recipeId ?? createId());

  const { form, onChange, updateFieldValue } = useForm<TRecipeFields>(draftToFields(initialDraft));

  const ingredients = useKeyedList(initialDraft.ingredients);
  const steps = useKeyedList(initialDraft.steps);
  const [videoUrls, setVideoUrls] = useState(initialDraft.videoUrls);
  const [dishCategoryIds, setDishCategoryIds] = useState(initialDraft.dishCategoryIds);

  const [photoPath, setPhotoPath] = useState(initialDraft.photoPath);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const draft = useMemo<IRecipeDraft>(
    () => ({
      ...fieldsToDraftPart({
        name: form.name.value,
        servingsBase: form.servingsBase.value,
        yieldGrams: form.yieldGrams.value,
        cookTimeMin: form.cookTimeMin.value,
        freezable: form.freezable.value,
        freezerDays: form.freezerDays.value,
        fridgeDays: form.fridgeDays.value,
        notes: form.notes.value,
      }),
      photoPath,
      videoUrls,
      dishCategoryIds,
      steps: steps.items,
      ingredients: ingredients.items,
    }),
    [form, photoPath, videoUrls, dishCategoryIds, steps.items, ingredients.items],
  );

  useEffect(() => {
    if (!areDraftsEqual(draft, initialDraft)) saveDraft(draft);
  }, [draft, initialDraft, saveDraft]);

  const overrides = useMemo(() => getNutritionOverrides(recipe), [recipe]);
  const nutrition = useRecipeNutrition({
    ingredients: draft.ingredients,
    servingsBase: draft.servingsBase,
    yieldGrams: draft.yieldGrams,
    overrides,
  });

  const save = useRecipeSave({ recipeId: savedRecipeId, recipe, draft, photoFile, finishDraft });

  return {
    form,
    onChange,
    updateFieldValue,
    ingredients,
    steps,
    videoUrls,
    setVideoUrls,
    dishCategoryIds,
    setDishCategoryIds,
    photoPath,
    setPhotoPath,
    photoFile,
    setPhotoFile,
    nutrition,
    save,
  };
}
