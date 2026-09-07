import { z } from "zod";

import { idSchema, nameSchema, nutrientPer100Schema } from "./_common";

export const productCategoryInputSchema = z.object({
  name: nameSchema,
  sortOrder: z.int(),
});

/**
 * Продукт без вариантов.
 *
 * `activeVariantId` сюда не входит: активный вариант выбирают на карточке продукта
 * отдельным действием, а в момент создания продукта вариантов ещё нет.
 */
export const productInputSchema = z.object({
  name: nameSchema,
  categoryId: idSchema,
  note: z.string().nullable(),
});

/** Вариант продукта. Все четыре числа nullable — продукт заводится быстро, цифры дописываются потом. */
export const productVariantInputSchema = z.object({
  name: nameSchema.nullable(),
  kcal100: nutrientPer100Schema,
  protein100: nutrientPer100Schema,
  fat100: nutrientPer100Schema,
  carbs100: nutrientPer100Schema,
  isApproximate: z.boolean(),
  source: z.enum(["seed", "manual", "label", "llm"]),
  note: z.string().nullable(),
});
