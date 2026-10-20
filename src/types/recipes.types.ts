/** Верхняя граница времени готовки в фильтре списка рецептов; `over60` — дольше часа. */
export type TCookTimeFilter = "upTo15" | "upTo30" | "upTo60" | "over60";

/** Поиск и фильтры списка рецептов — то, что живёт в адресе главного экрана. */
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
  /** Публичный адрес обложки с версией; null, если фото нет. */
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
  /** Стабильный ключ строки для React и перетаскивания; в базу не уходит. */
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
 * Состояние формы редактора, как оно лежит в localStorage.
 *
 * Это не `IRecipeInput`: черновик допускает недозаполненное — строку без
 * продукта, шаг без текста, незаконченную ссылку, — потому что сохраняется на
 * лету. Проверка на полноту происходит только при отправке.
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
