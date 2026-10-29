import { z } from "zod";

import type { IRecipeDraft, IRecipeInput } from "@/types/recipes.types";

import { idSchema, nameSchema, nutrientPer100Schema } from "./_common";

export const dishCategoryInputSchema = z.object({
  name: nameSchema,
  sortOrder: z.int(),
});

/** A cooking step. Order is set by position in the recipe array, not by a field. */
export const recipeStepInputSchema = z.object({
  text: z.string().trim().min(1),
});

/** An ingredient row. Order is set by position in the recipe array, not by a field. */
export const recipeIngredientInputSchema = z.object({
  productId: idSchema,
  pinnedVariantId: idSchema.nullable(),
  amountGrams: z.number().positive(),
  isOptional: z.boolean(),
  note: z.string().nullable(),
});

/**
 * A whole recipe, as the editor hands it over.
 *
 * Steps, ingredients and dish categories live inside because they are filled in by one form
 * and saved in one transaction. There may be zero categories — “at least one” is a
 * product wish, not a constraint, and the recipe list must show the
 * “No category” group. Numeric limits repeat the `recipes` table check constraints.
 */
export const recipeInputSchema = z.object({
  name: nameSchema,
  servingsBase: z.int().positive(),
  yieldGrams: z.number().positive().nullable(),
  cookTimeMin: z.int().positive().nullable(),
  photoPath: z.string().nullable(),
  notes: z.string().nullable(),
  videoUrls: z.array(z.httpUrl()),
  freezable: z.boolean(),
  freezerDays: z.int().nonnegative().nullable(),
  fridgeDays: z.int().nonnegative().nullable(),
  kcal100Override: nutrientPer100Schema,
  protein100Override: nutrientPer100Schema,
  fat100Override: nutrientPer100Schema,
  carbs100Override: nutrientPer100Schema,
  dishCategoryIds: z.array(idSchema),
  steps: z.array(recipeStepInputSchema),
  ingredients: z.array(recipeIngredientInputSchema),
}) satisfies z.ZodType<IRecipeInput>;

/**
 * The editor draft from localStorage.
 *
 * The storage lives across app versions and, unlike the query cache, is not protected by a shape version,
 * so what is read passes through this schema: a draft of the old shape
 * must not crash the screen, it is simply not offered for restoring.
 */
export const recipeDraftSchema = z.object({
  name: z.string(),
  servingsBase: z.number().nullable(),
  yieldGrams: z.number().nullable(),
  cookTimeMin: z.number().nullable(),
  photoPath: z.string().nullable(),
  notes: z.string(),
  freezable: z.boolean(),
  freezerDays: z.number().nullable(),
  fridgeDays: z.number().nullable(),
  videoUrls: z.array(z.string()),
  dishCategoryIds: z.array(z.string()),
  steps: z.array(z.object({ key: z.string(), text: z.string() })),
  ingredients: z.array(
    z.object({
      key: z.string(),
      productId: z.string().nullable(),
      pinnedVariantId: z.string().nullable(),
      amountGrams: z.number().nullable(),
      isOptional: z.boolean(),
      note: z.string(),
    }),
  ),
}) satisfies z.ZodType<IRecipeDraft>;
