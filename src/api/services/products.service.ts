import type { QueryData } from "@supabase/supabase-js";

import type { IProduct, IProductInput, IProductVariantInput } from "@/types/products.types";

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
      createdAt: variant.created_at,
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

export async function setActiveProductVariant({
  productId,
  variantId,
}: {
  productId: string;
  variantId: string;
}): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ active_variant_id: variantId })
    .eq("id", productId);

  if (error)
    throw new Error("Произошла ошибка при изменении активного варианта продукта.", {
      cause: error,
    });
}

export async function archiveProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", productId);

  if (error)
    throw new Error("Произошла ошибка при архивировании продукта.", {
      cause: error,
    });
}

export async function addProductVariant({
  productId,
  variant,
}: {
  productId: string;
  variant: IProductVariantInput;
}): Promise<void> {
  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    name: variant.name,
    kcal_100: variant.kcal100,
    protein_100: variant.protein100,
    fat_100: variant.fat100,
    carbs_100: variant.carbs100,
    is_approximate: variant.isApproximate,
    note: variant.note,
    source: "manual",
  });

  if (error)
    throw new Error("Произошла ошибка при добавлении варианта продукта.", {
      cause: error,
    });
}

export async function createProductWithVariant({
  product,
  variant,
}: {
  product: IProductInput;
  variant: IProductVariantInput;
}): Promise<string> {
  const { data, error } = await supabase.rpc("create_product_with_variant", {
    p_product_name: product.name,
    p_category_id: product.categoryId,
    p_product_note: product.note ?? undefined,
    p_variant_name: variant.name ?? undefined,
    p_kcal_100: variant.kcal100 ?? undefined,
    p_protein_100: variant.protein100 ?? undefined,
    p_fat_100: variant.fat100 ?? undefined,
    p_carbs_100: variant.carbs100 ?? undefined,
    p_is_approximate: variant.isApproximate,
    p_variant_note: variant.note ?? undefined,
  });

  if (error)
    throw new Error("Произошла ошибка при создании продукта.", {
      cause: error,
    });

  return data;
}
