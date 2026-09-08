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
  protein100Override: number | null;
  servingsBase: number;
  videoUrls: string[];
  yieldGrams: number | null;
  steps: IRecipeStep[];
  ingredients: IRecipeIngredient[];
  dishCategoryIds: string[];
}
