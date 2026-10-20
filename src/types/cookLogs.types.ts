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

/** Ввод записи журнала: всё, кроме `id` и рецепта, которому запись принадлежит. */
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
