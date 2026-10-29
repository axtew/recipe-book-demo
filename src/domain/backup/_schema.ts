import { z } from "zod";

import { nutritionSnapshotSchema } from "@/domain/schemas";

import { BACKUP_VERSION } from "./_constants";

// The backup file schema. Table rows are named by column names, so the fields here are
// snake_case — unlike the other domain schemas, which describe the application's
// entities. The limits repeat the database check constraints: a file that passed the schema must not
// run into them on insert. Rows are strict: a column the schema
// does not know breaks the export instead of silently disappearing from the file. The exception is jsonb
// `snapshot`: its shape is checked by the snapshot schema (non-strict), but the value
// passes on as is, without dropping unknown keys.

/** Any id a `uuid` column can store: the backup does not reject what the database accepted. */
const idSchema = z.guid();

/** `timestamptz` in the form `to_jsonb` returns it: with fractional seconds and an offset. */
const timestampSchema = z.iso.datetime({ offset: true });

const nutrientSchema = z.number().nonnegative().nullable();

/** Product categories and dish categories are structured identically. */
const categoryRowSchema = z.strictObject({
  id: idSchema,
  name: z.string(),
  sort_order: z.int(),
  created_at: timestampSchema,
});

const productRowSchema = z.strictObject({
  id: idSchema,
  name: z.string(),
  category_id: idSchema,
  active_variant_id: idSchema.nullable(),
  note: z.string().nullable(),
  archived_at: timestampSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

const productVariantRowSchema = z.strictObject({
  id: idSchema,
  product_id: idSchema,
  name: z.string().nullable(),
  kcal_100: nutrientSchema,
  protein_100: nutrientSchema,
  fat_100: nutrientSchema,
  carbs_100: nutrientSchema,
  is_approximate: z.boolean(),
  source: z.enum(["seed", "manual", "label", "llm"]),
  note: z.string().nullable(),
  archived_at: timestampSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

const recipeRowSchema = z.strictObject({
  id: idSchema,
  name: z.string(),
  servings_base: z.int().positive(),
  yield_grams: z.number().positive().nullable(),
  cook_time_min: z.int().positive().nullable(),
  photo_path: z.string().nullable(),
  notes: z.string().nullable(),
  video_urls: z.array(z.string()),
  freezable: z.boolean(),
  freezer_days: z.int().nonnegative().nullable(),
  fridge_days: z.int().nonnegative().nullable(),
  kcal_100_override: nutrientSchema,
  protein_100_override: nutrientSchema,
  fat_100_override: nutrientSchema,
  carbs_100_override: nutrientSchema,
  archived_at: timestampSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

const recipeStepRowSchema = z.strictObject({
  id: idSchema,
  recipe_id: idSchema,
  sort_order: z.int(),
  text: z.string(),
});

const recipeDishCategoryRowSchema = z.strictObject({
  recipe_id: idSchema,
  dish_category_id: idSchema,
});

const recipeIngredientRowSchema = z.strictObject({
  id: idSchema,
  recipe_id: idSchema,
  product_id: idSchema,
  pinned_variant_id: idSchema.nullable(),
  amount_grams: z.number().positive(),
  is_optional: z.boolean(),
  note: z.string().nullable(),
  sort_order: z.int(),
});

/** Checks the snapshot with the log schema but returns the original value: parsing must not change the backup contents. */
const snapshotSchema = z
  .custom<z.infer<typeof nutritionSnapshotSchema>>()
  .superRefine((value, ctx) => {
    const result = nutritionSnapshotSchema.safeParse(value);

    if (result.success) return;

    for (const issue of result.error.issues) {
      ctx.addIssue({ code: "custom", path: issue.path, message: issue.message });
    }
  });

const cookLogRowSchema = z.strictObject({
  id: idSchema,
  recipe_id: idSchema,
  cooked_at: z.iso.date(),
  multiplier: z.number().positive(),
  actual_yield_grams: z.number().positive().nullable(),
  containers: z.int().positive().nullable(),
  finished_at: z.iso.date().nullable(),
  rating: z.int().min(1).max(5).nullable(),
  note: z.string().nullable(),
  snapshot: snapshotSchema,
  created_at: timestampSchema,
});

/** The nine database tables as `export_backup` returns them, without the file's service fields. */
const backupTablesSchema = z.strictObject({
  product_categories: z.array(categoryRowSchema),
  dish_categories: z.array(categoryRowSchema),
  products: z.array(productRowSchema),
  product_variants: z.array(productVariantRowSchema),
  recipes: z.array(recipeRowSchema),
  recipe_steps: z.array(recipeStepRowSchema),
  recipe_dish_categories: z.array(recipeDishCategoryRowSchema),
  recipe_ingredients: z.array(recipeIngredientRowSchema),
  cook_logs: z.array(cookLogRowSchema),
});

/**
 * The whole backup file.
 *
 * Besides the shape of each row, reference integrity is checked: a file in which
 * a recipe refers to a nonexistent product is rejected here, with the
 * location, rather than by a foreign key error from the database in the middle of an insert.
 */
export const backupSchema = z
  .strictObject({
    version: z.literal(BACKUP_VERSION),
    exported_at: timestampSchema,
    ...backupTablesSchema.shape,
  })
  .superRefine((backup, ctx) => {
    const report = (table: string, index: number, field: string, message: string) => {
      ctx.addIssue({ code: "custom", path: [table, index, field], message });
    };

    const idSets = {
      product_categories: new Set<string>(),
      dish_categories: new Set<string>(),
      products: new Set<string>(),
      product_variants: new Set<string>(),
      recipes: new Set<string>(),
    };

    for (const table of Object.keys(idSets) as (keyof typeof idSets)[]) {
      backup[table].forEach((row, index) => {
        if (idSets[table].has(row.id)) report(table, index, "id", "duplicate id");
        idSets[table].add(row.id);
      });
    }

    const variantProduct = new Map(backup.product_variants.map((v) => [v.id, v.product_id]));

    backup.products.forEach((product, index) => {
      if (!idSets.product_categories.has(product.category_id)) {
        report("products", index, "category_id", "unknown category");
      }
      if (
        product.active_variant_id !== null &&
        variantProduct.get(product.active_variant_id) !== product.id
      ) {
        report("products", index, "active_variant_id", "variant of another product");
      }
    });

    backup.product_variants.forEach((variant, index) => {
      if (!idSets.products.has(variant.product_id)) {
        report("product_variants", index, "product_id", "unknown product");
      }
    });

    backup.recipe_steps.forEach((step, index) => {
      if (!idSets.recipes.has(step.recipe_id)) {
        report("recipe_steps", index, "recipe_id", "unknown recipe");
      }
    });

    const seenRecipeCategories = new Set<string>();

    backup.recipe_dish_categories.forEach((link, index) => {
      if (!idSets.recipes.has(link.recipe_id)) {
        report("recipe_dish_categories", index, "recipe_id", "unknown recipe");
      }
      if (!idSets.dish_categories.has(link.dish_category_id)) {
        report("recipe_dish_categories", index, "dish_category_id", "unknown category");
      }

      const key = `${link.recipe_id}:${link.dish_category_id}`;
      if (seenRecipeCategories.has(key)) {
        report("recipe_dish_categories", index, "dish_category_id", "duplicate link");
      }
      seenRecipeCategories.add(key);
    });

    backup.recipe_ingredients.forEach((ingredient, index) => {
      if (!idSets.recipes.has(ingredient.recipe_id)) {
        report("recipe_ingredients", index, "recipe_id", "unknown recipe");
      }
      if (!idSets.products.has(ingredient.product_id)) {
        report("recipe_ingredients", index, "product_id", "unknown product");
      }
      if (
        ingredient.pinned_variant_id !== null &&
        variantProduct.get(ingredient.pinned_variant_id) !== ingredient.product_id
      ) {
        report("recipe_ingredients", index, "pinned_variant_id", "variant of another product");
      }
    });

    backup.cook_logs.forEach((log, index) => {
      if (!idSets.recipes.has(log.recipe_id)) {
        report("cook_logs", index, "recipe_id", "unknown recipe");
      }
      if (log.finished_at !== null && log.finished_at < log.cooked_at) {
        report("cook_logs", index, "finished_at", "finished before cooked");
      }
    });
  });
