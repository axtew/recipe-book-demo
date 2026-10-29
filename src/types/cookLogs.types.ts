import type { INutritionSnapshot } from "@/domain/nutrition";

export interface ICookLog {
  actualYieldGrams: number | null;
  containers: number | null;
  cookedAt: string;
  finishedAt: string | null;
  id: string;
  multiplier: number;
  note: string | null;
  rating: number | null;
  recipeId: string;
  snapshot: INutritionSnapshot | null;
}

/** Cook log entry input: everything except `id` and the recipe the entry belongs to. */
export interface ICookLogInput {
  actualYieldGrams: number | null;
  containers: number | null;
  cookedAt: string;
  finishedAt: string | null;
  multiplier: number;
  note: string | null;
  rating: number | null;
  snapshot: INutritionSnapshot;
}
