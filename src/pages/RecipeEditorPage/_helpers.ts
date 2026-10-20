import type { INutrients } from "@/domain/nutrition";
import type { IRecipe, IRecipeDraft } from "@/types/recipes.types";

import type { TRecipeFields, TValidationKey } from "./_types";

type TIngredientDraft = IRecipeDraft["ingredients"][number];

export function createEmptyDraft(): IRecipeDraft {
  return {
    name: "",
    servingsBase: 1,
    yieldGrams: null,
    cookTimeMin: null,
    photoPath: null,
    notes: "",
    freezable: false,
    freezerDays: null,
    fridgeDays: null,
    videoUrls: [],
    dishCategoryIds: [],
    steps: [],
    ingredients: [],
  };
}

export function createEmptyIngredient(): TIngredientDraft {
  return {
    key: crypto.randomUUID(),
    productId: null,
    pinnedVariantId: null,
    amountGrams: null,
    isOptional: false,
    note: "",
  };
}

/** Рецепт из датасета в форму черновика; id строк становятся ключами списков. */
export function recipeToDraft(recipe: IRecipe): IRecipeDraft {
  return {
    name: recipe.name,
    servingsBase: recipe.servingsBase,
    yieldGrams: recipe.yieldGrams,
    cookTimeMin: recipe.cookTimeMin,
    photoPath: recipe.photoPath,
    notes: recipe.notes ?? "",
    freezable: recipe.freezable,
    freezerDays: recipe.freezerDays,
    fridgeDays: recipe.fridgeDays,
    videoUrls: recipe.videoUrls,
    dishCategoryIds: recipe.dishCategoryIds,
    steps: recipe.steps.map((step) => ({ key: step.id, text: step.text })),
    ingredients: recipe.ingredients.map((ingredient) => ({
      key: ingredient.id,
      productId: ingredient.productId,
      pinnedVariantId: ingredient.pinnedVariantId,
      amountGrams: ingredient.amountGrams,
      isOptional: ingredient.isOptional,
      note: ingredient.note ?? "",
    })),
  };
}

/** Поля, которые ведёт `useForm`: пустое число в форме — пустая строка, в черновике — null. */
export function draftToFields(draft: IRecipeDraft): TRecipeFields {
  return {
    name: draft.name,
    servingsBase: draft.servingsBase ?? "",
    yieldGrams: draft.yieldGrams ?? "",
    cookTimeMin: draft.cookTimeMin ?? "",
    freezable: draft.freezable,
    freezerDays: draft.freezerDays ?? "",
    fridgeDays: draft.fridgeDays ?? "",
    notes: draft.notes,
  };
}

function numberOrNull(value: number | ""): number | null {
  return value === "" ? null : value;
}

export function fieldsToDraftPart(
  fields: TRecipeFields,
): Pick<
  IRecipeDraft,
  | "name"
  | "servingsBase"
  | "yieldGrams"
  | "cookTimeMin"
  | "freezable"
  | "freezerDays"
  | "fridgeDays"
  | "notes"
> {
  return {
    name: fields.name,
    servingsBase: numberOrNull(fields.servingsBase),
    yieldGrams: numberOrNull(fields.yieldGrams),
    cookTimeMin: numberOrNull(fields.cookTimeMin),
    freezable: fields.freezable,
    freezerDays: numberOrNull(fields.freezerDays),
    fridgeDays: numberOrNull(fields.fridgeDays),
    notes: fields.notes,
  };
}

function textOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Кандидат для `recipeInputSchema` из черновика.
 *
 * Полностью пустые строки (без продукта, граммов и заметки), шаги без текста и
 * пустые ссылки отбрасываются как лишние. Частично заполненная строка состава
 * остаётся и не пройдёт схему — молча выбросить введённые граммы нельзя. Сроки
 * хранения без «можно замораживать» не сохраняются: блок хранения для такого
 * рецепта не показывается.
 */
export function buildRecipeCandidate(
  draft: IRecipeDraft,
  extras: {
    photoPath: string | null;
    overrides: {
      kcal100Override: number | null;
      protein100Override: number | null;
      fat100Override: number | null;
      carbs100Override: number | null;
    };
  },
) {
  return {
    name: draft.name,
    servingsBase: draft.servingsBase,
    yieldGrams: draft.yieldGrams,
    cookTimeMin: draft.cookTimeMin,
    photoPath: extras.photoPath,
    notes: textOrNull(draft.notes),
    videoUrls: draft.videoUrls.map((url) => url.trim()).filter((url) => url !== ""),
    freezable: draft.freezable,
    freezerDays: draft.freezable ? draft.freezerDays : null,
    fridgeDays: draft.freezable ? draft.fridgeDays : null,
    ...extras.overrides,
    dishCategoryIds: draft.dishCategoryIds,
    steps: draft.steps.filter((step) => step.text.trim() !== "").map(({ text }) => ({ text })),
    ingredients: draft.ingredients
      .filter(
        (ingredient) =>
          ingredient.productId !== null ||
          ingredient.amountGrams !== null ||
          ingredient.note.trim() !== "",
      )
      .map((ingredient) => ({
        productId: ingredient.productId,
        pinnedVariantId: ingredient.pinnedVariantId,
        amountGrams: ingredient.amountGrams,
        isOptional: ingredient.isOptional,
        note: textOrNull(ingredient.note),
      })),
  };
}

const VALIDATION_KEYS: readonly TValidationKey[] = [
  "name",
  "servingsBase",
  "yieldGrams",
  "cookTimeMin",
  "freezerDays",
  "fridgeDays",
  "videoUrls",
  "steps",
  "ingredients",
];

/** Какой блок формы назвать пользователю по пути первой ошибки схемы. */
export function getValidationKey(path: PropertyKey[]): TValidationKey {
  return VALIDATION_KEYS.find((key) => key === path[0]) ?? "generic";
}

/** Совпадают ли два черновика независимо от порядка ключей — запись в localStorage нужна только после правки. */
export function areDraftsEqual(first: IRecipeDraft, second: IRecipeDraft): boolean {
  return serializeSorted(first) === serializeSorted(second);
}

/** JSON с ключами объектов в алфавитном порядке: порядок ключей не влияет на результат. */
function serializeSorted(value: IRecipeDraft): string {
  return JSON.stringify(value, (_key, nested: unknown) =>
    typeof nested === "object" && nested !== null && !Array.isArray(nested)
      ? Object.fromEntries(Object.entries(nested).sort(([a], [b]) => a.localeCompare(b)))
      : nested,
  );
}

/**
 * Ручные КБЖУ «на 100 г», заданные у рецепта. Редактор их не меняет — они
 * проходят сквозь сохранение как есть, иначе правка состава молча стёрла бы их.
 */
export function getOverrideColumns(recipe: IRecipe | null) {
  return {
    kcal100Override: recipe?.kcal100Override ?? null,
    protein100Override: recipe?.protein100Override ?? null,
    fat100Override: recipe?.fat100Override ?? null,
    carbs100Override: recipe?.carbs100Override ?? null,
  };
}

/** Те же ручные значения в форме входа расчёта: незаданное поле просто отсутствует. */
export function getNutritionOverrides(recipe: IRecipe | null): Partial<INutrients> {
  const { kcal100Override, protein100Override, fat100Override, carbs100Override } =
    getOverrideColumns(recipe);
  const overrides: Partial<INutrients> = {};

  if (kcal100Override !== null) overrides.kcal = kcal100Override;
  if (protein100Override !== null) overrides.protein = protein100Override;
  if (fat100Override !== null) overrides.fat = fat100Override;
  if (carbs100Override !== null) overrides.carbs = carbs100Override;

  return overrides;
}
