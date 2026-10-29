import { z } from "zod";

import type { IProductInput, IProductVariantInput } from "@/types/products.types";

import { idSchema, nameSchema, nutrientPer100Schema } from "./_common";

export const productCategoryInputSchema = z.object({
  name: nameSchema,
  sortOrder: z.int(),
});

/**
 * A product without variants.
 *
 * `activeVariantId` is not part of it: the active variant is chosen on the product card
 * by a separate action, and at product creation there are no variants yet.
 */
export const productInputSchema = z.object({
  name: nameSchema,
  categoryId: idSchema,
  note: z.string().nullable(),
}) satisfies z.ZodType<IProductInput>;

/** A product variant. All four numbers are nullable — a product is added in a hurry, the numbers are filled in later. */
export const productVariantInputSchema = z.object({
  name: nameSchema.nullable(),
  kcal100: nutrientPer100Schema,
  protein100: nutrientPer100Schema,
  fat100: nutrientPer100Schema,
  carbs100: nutrientPer100Schema,
  isApproximate: z.boolean(),
  source: z.enum(["seed", "manual", "label", "llm"]),
  note: z.string().nullable(),
}) satisfies z.ZodType<IProductVariantInput>;
