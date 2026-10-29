/** Upper bound of cooking time in the recipe list filter; `over60` — longer than an hour. */
export type TCookTimeFilter = "upTo15" | "upTo30" | "upTo60" | "over60";

/** Search and filters of the recipe list — what lives in the home screen URL. */
export interface IRecipesSearch {
  q?: string;
  freezable?: true;
  time?: TCookTimeFilter;
}

export interface IDishCategory {
  id: string;
  name: string;
  sortOrder: number;
}

interface IRecipeIngredient {
  amountGrams: number;
  id: string;
  isOptional: boolean;
  note: string | null;
  pinnedVariantId: string | null;
  productId: string;
  recipeId: string;
  sortOrder: number;
}

interface IRecipeStep {
  id: string;
  recipeId: string;
  sortOrder: number;
  text: string;
}

export interface IRecipe {
  archivedAt: string | null;
  carbs100Override: number | null;
  cookTimeMin: number | null;
  fat100Override: number | null;
  freezable: boolean;
  freezerDays: number | null;
  fridgeDays: number | null;
  id: string;
  kcal100Override: number | null;
  name: string;
  notes: string | null;
  photoPath: string | null;
  /** Public cover URL with a version; null if there is no photo. */
  photoUrl: string | null;
  protein100Override: number | null;
  servingsBase: number;
  videoUrls: string[];
  yieldGrams: number | null;
  steps: IRecipeStep[];
  ingredients: IRecipeIngredient[];
  dishCategoryIds: string[];
}

interface IRecipeStepInput {
  text: string;
}

interface IRecipeIngredientInput {
  amountGrams: number;
  isOptional: boolean;
  note: string | null;
  pinnedVariantId: string | null;
  productId: string;
}

export interface IRecipeInput {
  carbs100Override: number | null;
  cookTimeMin: number | null;
  dishCategoryIds: string[];
  fat100Override: number | null;
  freezable: boolean;
  freezerDays: number | null;
  fridgeDays: number | null;
  ingredients: IRecipeIngredientInput[];
  kcal100Override: number | null;
  name: string;
  notes: string | null;
  photoPath: string | null;
  protein100Override: number | null;
  servingsBase: number;
  steps: IRecipeStepInput[];
  videoUrls: string[];
  yieldGrams: number | null;
}

export interface IRecipeIngredientDraft {
  amountGrams: number | null;
  isOptional: boolean;
  /** Stable row key for React and drag-and-drop; does not go to the database. */
  key: string;
  note: string;
  pinnedVariantId: string | null;
  productId: string | null;
}

export interface IRecipeStepDraft {
  key: string;
  text: string;
}

/**
 * Editor form state as it is stored in localStorage.
 *
 * This is not `IRecipeInput`: the draft allows incomplete data — a row without a
 * product, a step without text, an unfinished link — because it is saved on
 * the fly. The completeness check happens only on submit.
 */
export interface IRecipeDraft {
  cookTimeMin: number | null;
  dishCategoryIds: string[];
  freezable: boolean;
  freezerDays: number | null;
  fridgeDays: number | null;
  ingredients: IRecipeIngredientDraft[];
  name: string;
  notes: string;
  photoPath: string | null;
  servingsBase: number | null;
  steps: IRecipeStepDraft[];
  videoUrls: string[];
  yieldGrams: number | null;
}
