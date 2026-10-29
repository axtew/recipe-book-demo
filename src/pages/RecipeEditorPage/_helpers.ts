import type { KeyboardEvent } from "react";

import type { INutrients } from "@/domain/nutrition";
import type { IRecipe, IRecipeDraft } from "@/types/recipes.types";

import type { TRecipeFields, TValidationKey } from "./_types";

type TIngredientDraft = IRecipeDraft["ingredients"][number];

/**
 * A new UUID v4.
 *
 * `crypto.randomUUID` exists only in a secure context (HTTPS or localhost); on the dev server over
 * `http://<IP>` it is absent, so the fallback path builds the UUID from `getRandomValues`, which is
 * available everywhere.
 */
export function createId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // Version 4 and the RFC 4122 variant.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

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
    key: createId(),
    productId: null,
    pinnedVariantId: null,
    amountGrams: null,
    isOptional: false,
    note: "",
  };
}

/** A recipe from the dataset into the draft form; row ids become list keys. */
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

/**
 * Fields driven by `useForm`: an empty number is an empty string in the form and null in the draft.
 */
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
 * A candidate for `recipeInputSchema` built from the draft.
 *
 * Completely empty rows (no product, grams or note), steps without text and empty links are dropped
 * as superfluous. A partially filled ingredient row stays and will not pass the schema — entered
 * grams cannot be silently thrown away. Storage times without “can be frozen” are not saved: the
 * storage block is not shown for such a recipe.
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

/** Which form block to name to the user by the path of the first schema error. */
export function getValidationKey(path: PropertyKey[]): TValidationKey {
  return VALIDATION_KEYS.find((key) => key === path[0]) ?? "generic";
}

/**
 * Whether two drafts match regardless of key order — writing to localStorage is needed only after
 * an edit.
 */
export function areDraftsEqual(first: IRecipeDraft, second: IRecipeDraft): boolean {
  return serializeSorted(first) === serializeSorted(second);
}

/** JSON with object keys in alphabetical order: key order does not affect the result. */
function serializeSorted(value: IRecipeDraft): string {
  return JSON.stringify(value, (_key, nested: unknown) =>
    typeof nested === "object" && nested !== null && !Array.isArray(nested)
      ? Object.fromEntries(Object.entries(nested).sort(([a], [b]) => a.localeCompare(b)))
      : nested,
  );
}

/**
 * Manual “per 100 g” nutrition set on the recipe. The editor does not change it — it passes through
 * saving as is, otherwise editing the ingredients would silently erase it.
 */
export function getOverrideColumns(recipe: IRecipe | null) {
  return {
    kcal100Override: recipe?.kcal100Override ?? null,
    protein100Override: recipe?.protein100Override ?? null,
    fat100Override: recipe?.fat100Override ?? null,
    carbs100Override: recipe?.carbs100Override ?? null,
  };
}

/** The same manual values in the form of the calculation input: an unset field is simply absent. */
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

const NON_TEXT_INPUT_TYPES = new Set(["checkbox", "radio", "file", "button", "submit", "reset"]);

/**
 * Enter in a single-line form field blurs it instead of submitting the form.
 *
 * Implicit submission on Enter (on iPhone the “Go” button) would save an unfinished recipe. A
 * `textarea` is not affected: there Enter is a line break. The product and variant creation sheets
 * render through a portal, but keyboard events bubble up the React tree; a target outside the form
 * in the DOM is skipped so that in these sheets Enter still submits their own forms.
 */
export function blurOnEnter(event: KeyboardEvent<HTMLFormElement>): void {
  const { target } = event;

  if (event.key !== "Enter" || event.nativeEvent.isComposing || event.defaultPrevented) return;
  if (!(target instanceof HTMLInputElement) || NON_TEXT_INPUT_TYPES.has(target.type)) return;
  if (!event.currentTarget.contains(target)) return;

  event.preventDefault();
  target.blur();
}
