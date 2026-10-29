import type { QueryData } from "@supabase/supabase-js";

import type { ICategory, TCategoryKind } from "@/types/categories.types";
import type { IProductCategory } from "@/types/products.types";
import type { IDishCategory } from "@/types/recipes.types";

import { supabase } from "../supabase";

function buildProductCategoriesQuery() {
  return supabase.from("product_categories").select("*").order("sort_order");
}

export async function getProductCategories(): Promise<IProductCategory[]> {
  const { data, error } = await buildProductCategoriesQuery();

  if (error)
    throw new Error("An error occurred while requesting product categories.", { cause: error });

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

  if (error)
    throw new Error("An error occurred while requesting dish categories.", { cause: error });

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

const CATEGORY_TABLES = {
  product: "product_categories",
  dish: "dish_categories",
} as const satisfies Record<TCategoryKind, string>;

export async function renameCategory({
  kind,
  id,
  name,
}: {
  kind: TCategoryKind;
  id: string;
  name: string;
}): Promise<void> {
  const { error } = await supabase.from(CATEGORY_TABLES[kind]).update({ name }).eq("id", id);

  if (error) throw new Error("An error occurred while renaming the category.", { cause: error });
}

/**
 * Writes the new order of categories.
 *
 * Only ids in the required order are sent: the name is not part of the request, so a reorder
 * cannot overwrite a rename made in parallel. The write goes through a database function —
 * one statement, one transaction, the order is never half-reordered.
 */
export async function reorderCategories({
  kind,
  categories,
}: {
  kind: TCategoryKind;
  categories: ICategory[];
}): Promise<void> {
  const { error } = await supabase.rpc("reorder_categories", {
    p_kind: kind,
    p_ids: categories.map((category) => category.id),
  });

  if (error)
    throw new Error("An error occurred while saving the category order.", { cause: error });
}
