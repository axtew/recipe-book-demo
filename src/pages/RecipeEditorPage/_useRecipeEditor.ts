import { useEffect, useMemo, useState } from "react";

import { useForm } from "@/hooks/useForm";
import type { IRecipeDraft } from "@/types/recipes.types";

import {
  areDraftsEqual,
  draftToFields,
  fieldsToDraftPart,
  getNutritionOverrides,
} from "./_helpers";
import type { IRecipeFormProps, TRecipeFields } from "./_types";
import { useKeyedList } from "./_useKeyedList";
import { useRecipeNutrition } from "./_useRecipeNutrition";
import { useRecipeSave } from "./_useRecipeSave";

/**
 * Состояние редактора: скалярные поля в `useForm`, списки рядом, черновик в
 * localStorage, КБЖУ на лету и отправка.
 *
 * Списки не лежат в `useForm`: его поля — строки, числа и флаги. По той же
 * причине автосохранение черновика не опирается на `saveOnChange` формы — оно
 * видело бы только скалярные поля и пропускало правки состава и шагов.
 */
export function useRecipeEditor({
  recipeId,
  recipe,
  initialDraft,
  saveDraft,
  clearDraft,
}: IRecipeFormProps) {
  // Id нового рецепта выдаётся заранее: по нему фото ляжет в Storage до
  // сохранения, а повторная отправка после сбоя обновит тот же рецепт.
  const [savedRecipeId] = useState(() => recipeId ?? crypto.randomUUID());

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

  const save = useRecipeSave({ recipeId: savedRecipeId, recipe, draft, photoFile, clearDraft });

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
