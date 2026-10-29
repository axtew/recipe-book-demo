import type { QueryData } from "@supabase/supabase-js";

import type { IRecipe, IRecipeInput } from "@/types/recipes.types";

import { supabase } from "../supabase";

function buildRecipesQuery() {
  return supabase
    .from("recipes")
    .select("*, recipe_steps(*), recipe_ingredients(*), recipe_dish_categories!recipe_id (*)")
    .order("name")
    .order("sort_order", { referencedTable: "recipe_steps" })
    .order("sort_order", { referencedTable: "recipe_ingredients" });
}

export async function getRecipes(): Promise<IRecipe[]> {
  const { data, error } = await buildRecipesQuery();

  if (error)
    throw new Error("An error occurred while requesting the recipe list.", { cause: error });

  return data.map(mapRecipe);
}

type TDBRecipe = QueryData<ReturnType<typeof buildRecipesQuery>>[number];

function mapRecipe(recipe: TDBRecipe): IRecipe {
  return {
    archivedAt: recipe.archived_at,
    carbs100Override: recipe.carbs_100_override,
    cookTimeMin: recipe.cook_time_min,
    fat100Override: recipe.fat_100_override,
    freezable: recipe.freezable,
    freezerDays: recipe.freezer_days,
    fridgeDays: recipe.fridge_days,
    id: recipe.id,
    kcal100Override: recipe.kcal_100_override,
    name: recipe.name,
    notes: recipe.notes,
    photoPath: recipe.photo_path,
    photoUrl:
      recipe.photo_path === null ? null : getRecipePhotoUrl(recipe.photo_path, recipe.updated_at),
    protein100Override: recipe.protein_100_override,
    servingsBase: recipe.servings_base,
    videoUrls: recipe.video_urls,
    yieldGrams: recipe.yield_grams,
    steps: recipe.recipe_steps.map((step) => ({
      id: step.id,
      recipeId: step.recipe_id,
      sortOrder: step.sort_order,
      text: step.text,
    })),
    ingredients: recipe.recipe_ingredients.map((ingredient) => ({
      amountGrams: ingredient.amount_grams,
      id: ingredient.id,
      isOptional: ingredient.is_optional,
      note: ingredient.note,
      pinnedVariantId: ingredient.pinned_variant_id,
      productId: ingredient.product_id,
      recipeId: ingredient.recipe_id,
      sortOrder: ingredient.sort_order,
    })),
    dishCategoryIds: recipe.recipe_dish_categories.map(({ dish_category_id }) => dish_category_id),
  };
}

/**
 * Resets the manual per-100 g nutrition values: after this the numbers are calculated
 * from the composition again.
 *
 * Writes to one table with one request, so a separate rpc function is not needed.
 */
export async function resetRecipeNutritionOverrides(recipeId: string): Promise<void> {
  const { error } = await supabase
    .from("recipes")
    .update({
      kcal_100_override: null,
      protein_100_override: null,
      fat_100_override: null,
      carbs_100_override: null,
    })
    .eq("id", recipeId);

  if (error)
    throw new Error("An error occurred while resetting the manual nutrition values.", {
      cause: error,
    });
}

const RECIPE_PHOTOS_BUCKET = "recipe-photos";

export async function saveRecipe({
  recipeId,
  recipe,
}: {
  recipeId: string;
  recipe: IRecipeInput;
}): Promise<string> {
  const { data, error } = await supabase.rpc("save_recipe", {
    p_recipe_id: recipeId,
    p_name: recipe.name,
    p_servings_base: recipe.servingsBase,
    p_yield_grams: recipe.yieldGrams ?? undefined,
    p_cook_time_min: recipe.cookTimeMin ?? undefined,
    p_photo_path: recipe.photoPath ?? undefined,
    p_notes: recipe.notes ?? undefined,
    p_video_urls: recipe.videoUrls,
    p_freezable: recipe.freezable,
    p_freezer_days: recipe.freezerDays ?? undefined,
    p_fridge_days: recipe.fridgeDays ?? undefined,
    p_kcal_100_override: recipe.kcal100Override ?? undefined,
    p_protein_100_override: recipe.protein100Override ?? undefined,
    p_fat_100_override: recipe.fat100Override ?? undefined,
    p_carbs_100_override: recipe.carbs100Override ?? undefined,
    p_dish_category_ids: recipe.dishCategoryIds,
    p_steps: recipe.steps.map((step) => ({ text: step.text })),
    p_ingredients: recipe.ingredients.map((ingredient) => ({
      product_id: ingredient.productId,
      pinned_variant_id: ingredient.pinnedVariantId,
      amount_grams: ingredient.amountGrams,
      is_optional: ingredient.isOptional,
      note: ingredient.note,
    })),
  });

  if (error)
    throw new Error("An error occurred while saving the recipe.", {
      cause: error,
    });

  return data;
}

/**
 * Puts the recipe cover into Storage and returns the path inside the bucket.
 *
 * There is one path per recipe — replacing the photo overwrites the file instead of accumulating copies.
 */
export async function uploadRecipePhoto({
  recipeId,
  file,
}: {
  recipeId: string;
  file: Blob;
}): Promise<string> {
  const path = `${recipeId}/cover.webp`;

  const { error } = await supabase.storage
    .from(RECIPE_PHOTOS_BUCKET)
    .upload(path, file, { upsert: true, contentType: "image/webp" });

  if (error)
    throw new Error("An error occurred while uploading the recipe photo.", {
      cause: error,
    });

  return path;
}

/**
 * Public URL of the photo from the path in `recipes.photo_path`. Needs no network.
 *
 * Replacing the cover writes the file to the same path, and Storage serves it with
 * `max-age=3600`; the `v` parameter from the recipe's `updated_at` changes the URL on every
 * save, so the browser does not show the previous photo from its cache.
 */
function getRecipePhotoUrl(photoPath: string, updatedAt: string): string {
  const { publicUrl } = supabase.storage.from(RECIPE_PHOTOS_BUCKET).getPublicUrl(photoPath).data;

  return `${publicUrl}?v=${new Date(updatedAt).getTime()}`;
}
