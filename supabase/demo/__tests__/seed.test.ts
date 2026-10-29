import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { parseBackup } from "@/domain/backup";
import {
  calculateNutrition,
  type INutritionIngredient,
  resolveIngredients,
} from "@/domain/nutrition";

import { buildPhotoManifest, buildSeed, buildSeedLoadSql } from "../_build";
import { RECIPES } from "../source/recipes";

const SEED_PATH = fileURLToPath(new URL("../seed.json", import.meta.url));
const LOAD_SQL_PATH = fileURLToPath(new URL("../load-seed.sql", import.meta.url));
const MANIFEST_PATH = fileURLToPath(new URL("../photos.json", import.meta.url));
const PHOTOS_DIR = fileURLToPath(new URL("../photos/", import.meta.url));

// Rebuilding the seed: `WRITE_DEMO_SEED=1 pnpm vitest run supabase/demo` (see the README alongside).
// Without the variable the test only compares the file with the sources.
const seed = buildSeed();
const seedText = `${JSON.stringify(seed, null, 2)}\n`;

const loadSqlText = buildSeedLoadSql(seedText);
const manifestText = `${JSON.stringify(buildPhotoManifest(), null, 2)}\n`;

if (process.env.WRITE_DEMO_SEED === "1") {
  writeFileSync(SEED_PATH, seedText, "utf-8");
  writeFileSync(LOAD_SQL_PATH, loadSqlText, "utf-8");
  writeFileSync(MANIFEST_PATH, manifestText, "utf-8");
}

// With `core.autocrlf` git may return a file with CRLF; `.gitattributes` forbids that,
// and the normalization keeps the test from failing on such a file.
const fileText = readFileSync(SEED_PATH, "utf-8").replace(/\r\n/g, "\n");

describe("seed.json", () => {
  it("matches what the generator builds from the sources", () => {
    expect(fileText).toBe(seedText);
  });

  it("is stored in load-seed.sql exactly as the generator builds it", () => {
    expect(readFileSync(LOAD_SQL_PATH, "utf-8").replace(/\r\n/g, "\n")).toBe(loadSqlText);
  });

  it("keeps paths in photos.json that match the photo_path of the seed recipes", () => {
    const manifestFile = readFileSync(MANIFEST_PATH, "utf-8").replace(/\r\n/g, "\n");
    const manifest: { file: string; path: string }[] = JSON.parse(manifestFile);

    expect(manifestFile).toBe(manifestText);
    expect(manifest.map((item) => item.path).sort()).toEqual(
      seed.recipes
        .flatMap((recipe) => (recipe.photo_path === null ? [] : [recipe.photo_path]))
        .sort(),
    );
    expect(manifest.every((item) => existsSync(`${PHOTOS_DIR}${item.file}`))).toBe(true);
  });

  it("passes the backup schema and the referential integrity check", () => {
    const result = parseBackup(fileText);

    expect(result).toMatchObject({ status: "ok" });
  });

  it("fits the composition declared for the demo", () => {
    const usedCategories = new Set(
      seed.recipe_dish_categories.map((link) => link.dish_category_id),
    );
    const categoryCountByRecipe = new Map<string, number>();

    for (const link of seed.recipe_dish_categories) {
      categoryCountByRecipe.set(
        link.recipe_id,
        (categoryCountByRecipe.get(link.recipe_id) ?? 0) + 1,
      );
    }

    expect(seed.recipes).toHaveLength(20);
    expect(seed.dish_categories).toHaveLength(7);
    expect(usedCategories.size).toBe(7);
    expect(seed.product_categories).toHaveLength(5);
    expect(seed.products.length).toBeGreaterThanOrEqual(50);
    expect(seed.products.length).toBeLessThanOrEqual(80);
    expect(seed.cook_logs.length).toBeGreaterThanOrEqual(20);
    expect(seed.cook_logs.length).toBeLessThanOrEqual(40);

    const withoutCategory = seed.recipes.filter((recipe) => !categoryCountByRecipe.has(recipe.id));
    const withSeveralCategories = [...categoryCountByRecipe.values()].filter((count) => count > 1);

    expect(withoutCategory.length).toBeGreaterThanOrEqual(1);
    expect(withoutCategory.length).toBeLessThanOrEqual(2);
    expect(withSeveralCategories.length).toBeGreaterThan(0);
  });

  it("contains every case the demo is meant to show", () => {
    const variantCountByProduct = new Map<string, number>();

    for (const variant of seed.product_variants) {
      variantCountByProduct.set(
        variant.product_id,
        (variantCountByProduct.get(variant.product_id) ?? 0) + 1,
      );
    }

    const multiVariant = [...variantCountByProduct.values()].filter((count) => count >= 2);
    const archivedProductIds = new Set(
      seed.products.filter((product) => product.archived_at !== null).map((product) => product.id),
    );
    const emptyNutritionVariants = seed.product_variants.filter(
      (variant) => variant.kcal_100 === null,
    );

    expect(multiVariant.length).toBeGreaterThanOrEqual(5);
    expect(multiVariant.length).toBeLessThanOrEqual(10);
    expect(Math.max(...variantCountByProduct.values())).toBeLessThanOrEqual(3);
    expect(seed.product_variants.filter((variant) => variant.is_approximate)).toHaveLength(1);

    expect(emptyNutritionVariants).toHaveLength(1);
    expect(archivedProductIds.size).toBe(1);

    expect(
      seed.recipe_ingredients.some(
        (ingredient) => !ingredient.is_optional && archivedProductIds.has(ingredient.product_id),
      ),
    ).toBe(true);
    expect(
      seed.recipe_ingredients.some((ingredient) => ingredient.pinned_variant_id !== null),
    ).toBe(true);
    expect(seed.recipe_ingredients.some((ingredient) => ingredient.is_optional)).toBe(true);
    expect(seed.recipes.some((recipe) => recipe.yield_grams === null)).toBe(true);
    expect(seed.recipes.some((recipe) => recipe.yield_grams !== null)).toBe(true);
    expect(seed.recipes.some((recipe) => recipe.freezable)).toBe(true);
  });

  it("every recipe has ingredients and steps, and its photo is in photos/", () => {
    for (const recipe of seed.recipes) {
      expect(seed.recipe_ingredients.some((row) => row.recipe_id === recipe.id)).toBe(true);
      expect(seed.recipe_steps.some((row) => row.recipe_id === recipe.id)).toBe(true);
    }

    for (const source of RECIPES) {
      const recipe = seed.recipes.find((row) => row.name === source.name);

      expect(source.photo).toBeDefined();
      expect(recipe?.photo_path).toBe(`${recipe?.id}/cover.webp`);
      expect(existsSync(`${PHOTOS_DIR}${source.photo}`)).toBe(true);
    }
  });

  it("keeps no extra photos in photos/ and describes the source of each in CREDITS.md", () => {
    const used = new Set(RECIPES.map((recipe) => recipe.photo));
    const files = readdirSync(PHOTOS_DIR).filter((name) => name.endsWith(".webp"));
    const credits = readFileSync(`${PHOTOS_DIR}CREDITS.md`, "utf-8");

    expect(new Set(files)).toEqual(used);
    expect(used.size).toBe(RECIPES.length);

    for (const file of files) {
      expect(credits).toContain(file);
    }
  });

  it("sets video links on two recipes", () => {
    const withVideo = seed.recipes.filter((recipe) => recipe.video_urls.length > 0);

    expect(withVideo.map((recipe) => recipe.name).sort()).toEqual(["Блины", "Овсяное печенье"]);
  });

  it("keeps the log within the window of recent months and after the recipe's added date", () => {
    const recipesById = new Map(seed.recipes.map((recipe) => [recipe.id, recipe]));

    for (const log of seed.cook_logs) {
      const recipe = recipesById.get(log.recipe_id);

      expect(recipe).toBeDefined();
      expect(log.cooked_at >= "2026-07-21").toBe(true);
      expect(log.cooked_at <= "2026-10-21").toBe(true);
      expect(log.cooked_at >= (recipe?.created_at ?? "").slice(0, 10)).toBe(true);
    }
  });

  it("stores snapshots in the log that match the domain module's calculation", () => {
    const products = seed.products.map((product) => ({
      id: product.id,
      name: product.name,
      activeVariantId: product.active_variant_id,
    }));
    const variants = seed.product_variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      kcal100: variant.kcal_100,
      protein100: variant.protein_100,
      fat100: variant.fat_100,
      carbs100: variant.carbs_100,
    }));

    for (const log of seed.cook_logs) {
      const recipe = seed.recipes.find((row) => row.id === log.recipe_id);
      const ingredients: INutritionIngredient[] = seed.recipe_ingredients
        .filter((row) => row.recipe_id === log.recipe_id)
        .map((row) => ({
          id: row.id,
          productId: row.product_id,
          pinnedVariantId: row.pinned_variant_id,
          amountGrams: row.amount_grams,
          isOptional: row.is_optional,
        }));

      const nutrition = calculateNutrition(resolveIngredients(ingredients, products, variants), {
        servingsBase: recipe?.servings_base ?? 1,
        yieldGrams: recipe?.yield_grams ?? null,
        overrides: {},
      });

      expect(log.snapshot.version).toBe(1);
      expect(log.snapshot.servingsBase).toBe(recipe?.servings_base);
      expect(log.snapshot.nutrition).toEqual(nutrition);
      expect(log.snapshot.ingredients).toHaveLength(ingredients.length);
      expect(Number.isFinite(log.snapshot.nutrition.perServing.kcal)).toBe(true);
    }
  });

  it("shows the incomplete-nutrition warning exactly in recipes with a product that has no figures", () => {
    const incomplete = seed.cook_logs.filter(
      (log) => log.snapshot.nutrition.incompleteProducts.length > 0,
    );

    expect(incomplete.length).toBeGreaterThan(0);

    for (const log of incomplete) {
      expect(log.snapshot.nutrition.incompleteProducts.map((item) => item.productName)).toEqual([
        "Аджика домашняя",
      ]);
    }
  });
});
