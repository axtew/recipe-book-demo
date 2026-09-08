import type { QueryData } from "@supabase/supabase-js";

import type { IRecipe } from "@/types/recipes.types";

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

  if (error) throw new Error("Произошла ошибка при запросе списка рецептов.", { cause: error });

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
