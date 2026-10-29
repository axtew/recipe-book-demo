import type { TBackup } from "@/domain/backup";

/** Kcal, protein, fat, carbs per 100 g. */
type TPer100 = [kcal: number, protein: number, fat: number, carbs: number];

type TVariantSource = TBackup["product_variants"][number]["source"];

interface IDemoVariant {
  /** Variant name (brand, fat content). Not set for a product with a single variant. */
  name?: string;
  /** `null` — nutrition not filled in: a recipe with such a product shows the incomplete-calculation warning. */
  per100: TPer100 | null;
  /** Marked as "approximate". */
  approximate?: true;
  /** Defaults to `seed` — figures from general nutrition tables. */
  source?: TVariantSource;
  note?: string;
}

interface IDemoProduct {
  name: string;
  note?: string;
  /** Archived product: hidden in lists but stays in old recipes. */
  archived?: true;
  /** The first variant becomes the active one. */
  variants: IDemoVariant[];
}

export interface IDemoProductCategory {
  name: string;
  products: IDemoProduct[];
}

interface IDemoIngredient {
  /** Product name from `products.ts`. */
  product: string;
  /** Name of this product's variant, if it is pinned to the ingredient. */
  variant?: string;
  grams: number;
  optional?: true;
  note?: string;
}

export interface IDemoRecipe {
  name: string;
  /** Dish category names; empty — the recipe has no category. */
  categories: string[];
  /** Date added, `YYYY-MM-DD`. */
  addedAt: string;
  servings: number;
  /** Weight of the finished dish; without it nutrition per 100 g is computed from the raw weight. */
  yieldGrams?: number;
  cookTimeMin: number;
  fridgeDays?: number;
  /** A set number of days — the recipe is marked as freezable. */
  freezerDays?: number;
  notes?: string;
  /**
   * File name from `supabase/demo/photos/` (for example, `syrniki.webp`).
   * Without it the recipe has no photo.
   */
  photo?: string;
  /** Links to videos; a recipe based on a video is retold in own words. */
  videoUrls?: string[];
  ingredients: IDemoIngredient[];
  steps: string[];
}

export interface IDemoCookLog {
  /** Recipe name from `recipes.ts`. */
  recipe: string;
  /** Cooking date, `YYYY-MM-DD`. */
  cookedAt: string;
  /** How many times the portion is larger than the base one; defaults to 1. */
  multiplier?: number;
  yieldGrams?: number;
  containers?: number;
  /** Date when it was "finished", `YYYY-MM-DD`. */
  finishedAt?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}
