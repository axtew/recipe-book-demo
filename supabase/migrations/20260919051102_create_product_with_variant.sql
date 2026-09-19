create or replace function public.create_product_with_variant(
  p_product_name text,
  p_category_id uuid,
  p_product_note text default null,
  p_variant_name text default null,
  p_kcal_100 numeric default null,
  p_protein_100 numeric default null,
  p_fat_100 numeric default null,
  p_carbs_100 numeric default null,
  p_is_approximate boolean default false,
  p_variant_note text default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_product_id uuid;
  v_variant_id uuid;
begin
  insert into public.products (name, category_id, note)
  values (p_product_name, p_category_id, p_product_note)
  returning id into v_product_id;

  insert into public.product_variants (product_id, name, kcal_100, protein_100, fat_100, carbs_100, is_approximate, note)
  values (v_product_id, p_variant_name, p_kcal_100, p_protein_100, p_fat_100, p_carbs_100, p_is_approximate, p_variant_note)
  returning id into v_variant_id;

  update public.products
  set active_variant_id = v_variant_id
  where id = v_product_id;

  return v_product_id;
end;
$$;

revoke execute on function public.create_product_with_variant(
  text,
  uuid,
  text,
  text,
  numeric,
  numeric,
  numeric,
  numeric,
  boolean,
  text
) from public, anon;
grant  execute on function public.create_product_with_variant(
  text,
  uuid,
  text,
  text,
  numeric,
  numeric,
  numeric,
  numeric,
  boolean,
  text
) to authenticated;