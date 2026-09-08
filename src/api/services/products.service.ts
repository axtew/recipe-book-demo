import type { QueryData } from "@supabase/supabase-js";

import type { IProduct } from "@/types/products.types";

import { supabase } from "../supabase";

function buildProductsQuery() {
  return supabase.from("products").select("*, product_variants!product_id (*)").order("name");
}

export async function getProducts(): Promise<IProduct[]> {
  const { data, error } = await buildProductsQuery();

  if (error) throw new Error("Произошла ошибка при запросе списка продуктов.", { cause: error });

  return data.map(mapProduct);
}

type TDBProduct = QueryData<ReturnType<typeof buildProductsQuery>>[number];

function mapProduct(product: TDBProduct): IProduct {
  return {
    activeVariantId: product.active_variant_id,
    archivedAt: product.archived_at,
    categoryId: product.category_id,
    id: product.id,
    name: product.name,
    note: product.note,
    variants: product.product_variants.map((variant) => ({
      archivedAt: variant.archived_at,
      carbs100: variant.carbs_100,
      fat100: variant.fat_100,
      id: variant.id,
      isApproximate: variant.is_approximate,
      kcal100: variant.kcal_100,
      name: variant.name,
      note: variant.note,
      productId: variant.product_id,
      protein100: variant.protein_100,
      source: variant.source,
    })),
  };
}
