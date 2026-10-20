-- Сохранение рецепта целиком: рецепт, шаги, состав и категории блюда одной транзакцией.
--
-- Одна функция на создание и на редактирование. `insert … on conflict (id) do update`
-- закрывает три случая: id не передан — рецепт создаётся с новым id; передан id
-- существующего рецепта — он обновляется; передан id, которого ещё нет, — рецепт
-- создаётся именно с ним. Третий случай нужен клиенту: фото кладётся в Storage по
-- пути `<id рецепта>/cover.webp` ДО сохранения, поэтому id нового рецепта известен
-- заранее и повторная отправка после сбоя сети не плодит дубли.
--
-- Дочерние строки перезаписываются целиком: delete + insert нового набора. Право
-- DELETE у recipe_steps / recipe_ingredients / recipe_dish_categories выдано; у самих
-- рецептов его нет, и функция его не использует. Любой отказ внутри откатывает всё,
-- включая удаление старого состава.
--
-- Порядок шагов и ингредиентов (sort_order) берётся из позиции в массиве, а не из
-- поля: после перетаскивания клиенту не нужно ничего перенумеровывать.
--
-- Формы массивов:
--   p_dish_category_ids  ["<uuid>", …]
--   p_steps              [{"text": "…"}, …]
--   p_ingredients        [{"product_id": "<uuid>", "pinned_variant_id": "<uuid>" | null,
--                          "amount_grams": 120.5, "is_optional": false, "note": "…" | null}, …]

create or replace function public.save_recipe(
  p_name text,
  p_servings_base integer,
  p_recipe_id uuid default null,
  p_yield_grams numeric default null,
  p_cook_time_min integer default null,
  p_photo_path text default null,
  p_notes text default null,
  p_video_urls text[] default '{}',
  p_freezable boolean default false,
  p_freezer_days integer default null,
  p_fridge_days integer default null,
  p_kcal_100_override numeric default null,
  p_protein_100_override numeric default null,
  p_fat_100_override numeric default null,
  p_carbs_100_override numeric default null,
  p_dish_category_ids jsonb default '[]',
  p_steps jsonb default '[]',
  p_ingredients jsonb default '[]'
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_recipe_id uuid;
begin
  insert into public.recipes (
    id,
    name,
    servings_base,
    yield_grams,
    cook_time_min,
    photo_path,
    notes,
    video_urls,
    freezable,
    freezer_days,
    fridge_days,
    kcal_100_override,
    protein_100_override,
    fat_100_override,
    carbs_100_override
  )
  values (
    coalesce(p_recipe_id, gen_random_uuid()),
    p_name,
    p_servings_base,
    p_yield_grams,
    p_cook_time_min,
    p_photo_path,
    p_notes,
    coalesce(p_video_urls, '{}'),
    coalesce(p_freezable, false),
    p_freezer_days,
    p_fridge_days,
    p_kcal_100_override,
    p_protein_100_override,
    p_fat_100_override,
    p_carbs_100_override
  )
  on conflict (id) do update set
    name = excluded.name,
    servings_base = excluded.servings_base,
    yield_grams = excluded.yield_grams,
    cook_time_min = excluded.cook_time_min,
    photo_path = excluded.photo_path,
    notes = excluded.notes,
    video_urls = excluded.video_urls,
    freezable = excluded.freezable,
    freezer_days = excluded.freezer_days,
    fridge_days = excluded.fridge_days,
    kcal_100_override = excluded.kcal_100_override,
    protein_100_override = excluded.protein_100_override,
    fat_100_override = excluded.fat_100_override,
    carbs_100_override = excluded.carbs_100_override
  returning id into v_recipe_id;

  delete from public.recipe_ingredients where recipe_id = v_recipe_id;
  delete from public.recipe_steps where recipe_id = v_recipe_id;
  delete from public.recipe_dish_categories where recipe_id = v_recipe_id;

  insert into public.recipe_dish_categories (recipe_id, dish_category_id)
  select v_recipe_id, e.category_id::uuid
  from jsonb_array_elements_text(coalesce(p_dish_category_ids, '[]'::jsonb)) as e(category_id);

  insert into public.recipe_steps (recipe_id, sort_order, text)
  select v_recipe_id, (e.idx - 1)::integer, e.item ->> 'text'
  from jsonb_array_elements(coalesce(p_steps, '[]'::jsonb)) with ordinality as e(item, idx);

  insert into public.recipe_ingredients (
    recipe_id,
    product_id,
    pinned_variant_id,
    amount_grams,
    is_optional,
    note,
    sort_order
  )
  select
    v_recipe_id,
    (e.item ->> 'product_id')::uuid,
    (e.item ->> 'pinned_variant_id')::uuid,
    (e.item ->> 'amount_grams')::numeric,
    coalesce((e.item ->> 'is_optional')::boolean, false),
    e.item ->> 'note',
    (e.idx - 1)::integer
  from jsonb_array_elements(coalesce(p_ingredients, '[]'::jsonb)) with ordinality as e(item, idx);

  return v_recipe_id;
end;
$$;

revoke execute on function public.save_recipe(
  text,
  integer,
  uuid,
  numeric,
  integer,
  text,
  text,
  text[],
  boolean,
  integer,
  integer,
  numeric,
  numeric,
  numeric,
  numeric,
  jsonb,
  jsonb,
  jsonb
) from public, anon;
grant execute on function public.save_recipe(
  text,
  integer,
  uuid,
  numeric,
  integer,
  text,
  text,
  text[],
  boolean,
  integer,
  integer,
  numeric,
  numeric,
  numeric,
  numeric,
  jsonb,
  jsonb,
  jsonb
) to authenticated;
