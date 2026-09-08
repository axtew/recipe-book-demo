import type { QueryData } from "@supabase/supabase-js";

import type { IProductCategory } from "@/types/products.types";
import type { IDishCategory } from "@/types/recipes.types";

import { supabase } from "../supabase";

function buildProductCategoriesQuery() {
  return supabase.from("product_categories").select("*").order("sort_order");
}

export async function getProductCategories(): Promise<IProductCategory[]> {
  const { data, error } = await buildProductCategoriesQuery();

  if (error) throw new Error("Произошла ошибка при запросе категорий продуктов.", { cause: error });

  return data.map(mapProductCategory);
}

type TDBProductCategory = QueryData<ReturnType<typeof buildProductCategoriesQuery>>[number];

function mapProductCategory(category: TDBProductCategory): IProductCategory {
  return {
    id: category.id,
    name: category.name,
    sortOrder: category.sort_order,
  };
}

function buildDishCategoriesQuery() {
  return supabase.from("dish_categories").select("*").order("sort_order");
}

export async function getDishCategories(): Promise<IDishCategory[]> {
  const { data, error } = await buildDishCategoriesQuery();

  if (error) throw new Error("Произошла ошибка при запросе категорий блюд.", { cause: error });

  return data.map(mapDishCategory);
}

type TDBDishCategory = QueryData<ReturnType<typeof buildDishCategoriesQuery>>[number];

function mapDishCategory(category: TDBDishCategory): IDishCategory {
  return {
    id: category.id,
    name: category.name,
    sortOrder: category.sort_order,
  };
}
