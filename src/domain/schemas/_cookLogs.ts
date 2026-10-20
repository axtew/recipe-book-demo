import { z } from "zod";

import type { INutritionSnapshot } from "@/domain/nutrition";
import type { ICookLogInput } from "@/types/cookLogs.types";

import { dateSchema, idSchema } from "./_common";

const nutrientsSchema = z.object({
  kcal: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  carbs: z.number().nonnegative(),
});

const recipeNutritionSchema = z.object({
  total: nutrientsSchema,
  per100g: nutrientsSchema,
  perServing: nutrientsSchema,
  basis: z.enum(["yield", "rawWeight"]),
  rawWeightGrams: z.number().nonnegative(),
  yieldGrams: z.number().positive().nullable(),
  overriddenFields: z.array(z.enum(["kcal", "protein", "fat", "carbs"])),
  incompleteProducts: z.array(z.object({ productId: idSchema, productName: z.string() })),
});

/**
 * Схема столбца `cook_logs.snapshot`.
 *
 * `jsonb` приходит из сгенерированных типов рекурсивным `Json` без единого поля,
 * поэтому форму снимка проверяет эта схема — на границе, при чтении журнала.
 * `satisfies` держит её в согласии с интерфейсом: разъедутся — не соберётся.
 */
export const nutritionSnapshotSchema = z.object({
  version: z.literal(1),
  nutrition: recipeNutritionSchema,
  servingsBase: z.int().positive(),
  ingredients: z.array(
    z.object({
      productId: idSchema,
      productName: z.string(),
      variantId: idSchema.nullable(),
      variantName: z.string().nullable(),
      amountGrams: z.number().positive(),
      isOptional: z.boolean(),
    }),
  ),
}) satisfies z.ZodType<INutritionSnapshot>;

/** Предел `numeric(4,2)` у `cook_logs.multiplier`: больше 99.99 в базу не поместится. */
export const MULTIPLIER_MAX = 99.99;

export const cookLogInputSchema = z
  .object({
    cookedAt: dateSchema,
    multiplier: z.number().positive().max(MULTIPLIER_MAX),
    actualYieldGrams: z.number().positive().nullable(),
    containers: z.int().positive().nullable(),
    finishedAt: dateSchema.nullable(),
    rating: z.int().min(1).max(5).nullable(),
    note: z.string().nullable(),
    snapshot: nutritionSnapshotSchema,
  })
  .refine((log) => log.finishedAt === null || log.finishedAt >= log.cookedAt, {
    // Сообщение — код для словаря, а не текст: текст, видимый пользователю, живёт
    // только в `public/dictionaries/`. Даты в формате `YYYY-MM-DD` сравнимы как строки.
    message: "finishedBeforeCooked",
    path: ["finishedAt"],
  }) satisfies z.ZodType<ICookLogInput>;
