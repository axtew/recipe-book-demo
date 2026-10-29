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
 * Schema of the `cook_logs.snapshot` column.
 *
 * `jsonb` comes from the generated types as a recursive `Json` without a single field,
 * so the snapshot shape is checked by this schema — at the boundary, when reading the log.
 * `satisfies` keeps it in agreement with the interface: if they diverge, it won't compile.
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

/** Limit of `numeric(4,2)` for `cook_logs.multiplier`: above 99.99 does not fit in the database. */
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
    // The message is a dictionary code, not a text: the text visible to the user lives
    // only in `public/dictionaries/`. Dates in `YYYY-MM-DD` format are comparable as strings.
    message: "finishedBeforeCooked",
    path: ["finishedAt"],
  }) satisfies z.ZodType<ICookLogInput>;
