import { z } from "zod";

import type { IRecipeDraft, IRecipeInput } from "@/types/recipes.types";

import { idSchema, nameSchema, nutrientPer100Schema } from "./_common";

export const dishCategoryInputSchema = z.object({
  name: nameSchema,
  sortOrder: z.int(),
});

/** Шаг приготовления. Порядок задаёт позиция в массиве рецепта, а не поле. */
export const recipeStepInputSchema = z.object({
  text: z.string().trim().min(1),
});

/** Строка состава. Порядок задаёт позиция в массиве рецепта, а не поле. */
export const recipeIngredientInputSchema = z.object({
  productId: idSchema,
  pinnedVariantId: idSchema.nullable(),
  amountGrams: z.number().positive(),
  isOptional: z.boolean(),
  note: z.string().nullable(),
});

/**
 * Рецепт целиком, как его отдаёт редактор.
 *
 * Шаги, состав и категории блюда лежат внутри, потому что заполняются одной формой
 * и сохраняются одной транзакцией. Категорий может быть ноль — «хотя бы одна» это
 * продуктовое пожелание, а не ограничение, и список рецептов обязан показывать
 * группу «Без категории». Числовые ограничения повторяют check'и таблицы `recipes`.
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
 * Черновик редактора из localStorage.
 *
 * Хранилище живёт между версиями приложения и не защищено версией формы, как
 * кэш запросов, поэтому прочитанное проходит эту схему: черновик старой формы
 * не должен ронять экран, он просто не предлагается к восстановлению.
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
