import { z } from "zod";

import { idSchema, nameSchema, nutrientPer100Schema } from "./_common";

export const dishCategoryInputSchema = z.object({
  name: nameSchema,
  sortOrder: z.int(),
});

export const recipeStepInputSchema = z.object({
  sortOrder: z.int(),
  text: z.string().trim().min(1),
});

export const recipeIngredientInputSchema = z.object({
  productId: idSchema,
  pinnedVariantId: idSchema.nullable(),
  amountGrams: z.number().positive(),
  isOptional: z.boolean(),
  note: z.string().nullable(),
  sortOrder: z.int(),
});

/**
 * Рецепт целиком, как его отдаёт редактор.
 *
 * Шаги, состав и категории блюда лежат внутри, потому что заполняются одной формой
 * и сохраняются одной транзакцией. Категорий может быть ноль — «хотя бы одна» это
 * продуктовое пожелание, а не ограничение, и список рецептов обязан показывать
 * группу «Без категории».
 */
export const recipeInputSchema = z.object({
  name: nameSchema,
  servingsBase: z.int().positive(),
  yieldGrams: z.number().positive().nullable(),
  cookTimeMin: z.int().positive().nullable(),
  photoPath: z.string().nullable(),
  notes: z.string().nullable(),
  videoUrls: z.array(z.url()),
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
});
