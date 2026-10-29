import type { IRecipe } from "@/types/recipes.types";

/** A recipe in a form ready for the list: calculated nutrition and texts for search. */
export interface IRecipeListItem {
  recipe: IRecipe;
  /** Normalized recipe name and names of the ingredient products. */
  searchTexts: string[];
  /** Kcal per 100 g; `null` if there is nothing to calculate from. */
  kcal100: number | null;
  /** Some products have no nutrition — the number is understated, and the card must show it. */
  isNutritionIncomplete: boolean;
}

/** A category with its recipes; `name === null` — the “No category” group. */
export interface IRecipeGroup {
  id: string;
  name: string | null;
  items: IRecipeListItem[];
}
