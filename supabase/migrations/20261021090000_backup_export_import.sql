-- Database backup: export of all tables as a single JSON and restore from it.
--
-- The export is one function rather than nine client queries: a single SELECT sees
-- one consistent database state (nine separate queries could catch a write in the
-- middle and produce a file with dangling references), and PostgREST does not
-- truncate the result by max_rows (1000 rows) — a jsonb scalar is one row.
--
-- The import is one transaction. It writes to nine tables at once, and a failure
-- midway must not leave half of the data behind. The "database is empty" check
-- lives inside the function: moved to the client, it would not protect against a
-- write that happens between the check and the insert.
--
-- The file format is table rows under their column names. The format version and
-- the file schema live in `src/domain/backup/`; when you add a column to a table,
-- update the schema and bump the version there.

create or replace function public.export_backup()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'product_categories', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.sort_order, t.id), '[]'::jsonb)
      from public.product_categories t
    ),
    'dish_categories', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.sort_order, t.id), '[]'::jsonb)
      from public.dish_categories t
    ),
    'products', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.id), '[]'::jsonb)
      from public.products t
    ),
    'product_variants', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.id), '[]'::jsonb)
      from public.product_variants t
    ),
    'recipes', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.id), '[]'::jsonb)
      from public.recipes t
    ),
    'recipe_steps', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.recipe_id, t.sort_order, t.id), '[]'::jsonb)
      from public.recipe_steps t
    ),
    'recipe_dish_categories', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.recipe_id, t.dish_category_id), '[]'::jsonb)
      from public.recipe_dish_categories t
    ),
    'recipe_ingredients', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.recipe_id, t.sort_order, t.id), '[]'::jsonb)
      from public.recipe_ingredients t
    ),
    'cook_logs', (
      select coalesce(jsonb_agg(to_jsonb(t) order by t.id), '[]'::jsonb)
      from public.cook_logs t
    )
  );
$$;

revoke execute on function public.export_backup() from public, anon;
grant execute on function public.export_backup() to authenticated;

-- Restore from a file that has already passed the schema check on the client.
--
-- "Empty database" means no products and variants, no recipes, no cook log
-- entries. Categories do not count as user data: dish categories exist in any
-- fresh database (the reference_data migration), and product categories may have
-- been created by hand before the import. The file does not reject them but
-- reconciles with them:
--   - a row with the same id is updated (name, order);
--   - otherwise a row with the same name takes the id from the file — references
--     in the file to the category stay valid, and the starter dish categories are
--     not duplicated;
--   - otherwise the category is added.
-- Categories in the database that are not in the file stay: there is no DELETE
-- right on them, and they are not data that should be lost. Changing an id is safe
-- because only products and recipes reference categories, and an empty database
-- has none.
--
-- Refusal on a non-empty database is an exception with the text
-- `backup_target_not_empty`; the client tells it apart from other errors by the text.
--
-- Returns the number of imported records for the three main tables.

create or replace function public.import_backup(p_backup jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_row record;
  v_existing_id uuid;
  v_products integer;
  v_recipes integer;
  v_cook_logs integer;
begin
  -- The lock closes the race between the check and the insert: while it is held,
  -- another write to these tables waits, and a second import sees an already filled database.
  lock table public.products, public.product_variants, public.recipes, public.cook_logs
    in share row exclusive mode;

  if exists (select 1 from public.products)
    or exists (select 1 from public.product_variants)
    or exists (select 1 from public.recipes)
    or exists (select 1 from public.cook_logs)
  then
    raise exception 'backup_target_not_empty';
  end if;

  for v_row in
    select * from jsonb_populate_recordset(null::public.product_categories, p_backup -> 'product_categories')
  loop
    if exists (select 1 from public.product_categories where id = v_row.id) then
      update public.product_categories
      set name = v_row.name, sort_order = v_row.sort_order, created_at = v_row.created_at
      where id = v_row.id;
    else
      select c.id into v_existing_id
      from public.product_categories c
      where c.name = v_row.name
        and not exists (
          select 1
          from jsonb_populate_recordset(null::public.product_categories, p_backup -> 'product_categories') b
          where b.id = c.id
        )
      limit 1;

      if v_existing_id is not null then
        update public.product_categories
        set id = v_row.id, sort_order = v_row.sort_order, created_at = v_row.created_at
        where id = v_existing_id;
      else
        insert into public.product_categories (id, name, sort_order, created_at)
        values (v_row.id, v_row.name, v_row.sort_order, v_row.created_at);
      end if;
    end if;

    v_existing_id := null;
  end loop;

  for v_row in
    select * from jsonb_populate_recordset(null::public.dish_categories, p_backup -> 'dish_categories')
  loop
    if exists (select 1 from public.dish_categories where id = v_row.id) then
      update public.dish_categories
      set name = v_row.name, sort_order = v_row.sort_order, created_at = v_row.created_at
      where id = v_row.id;
    else
      select c.id into v_existing_id
      from public.dish_categories c
      where c.name = v_row.name
        and not exists (
          select 1
          from jsonb_populate_recordset(null::public.dish_categories, p_backup -> 'dish_categories') b
          where b.id = c.id
        )
      limit 1;

      if v_existing_id is not null then
        update public.dish_categories
        set id = v_row.id, sort_order = v_row.sort_order, created_at = v_row.created_at
        where id = v_existing_id;
      else
        insert into public.dish_categories (id, name, sort_order, created_at)
        values (v_row.id, v_row.name, v_row.sort_order, v_row.created_at);
      end if;
    end if;

    v_existing_id := null;
  end loop;

  -- products <-> product_variants reference each other; the product's composite FK
  -- is deferred to the end of the transaction, so the insert order between them does not matter.
  insert into public.products
  select * from jsonb_populate_recordset(null::public.products, p_backup -> 'products');
  get diagnostics v_products = row_count;

  insert into public.product_variants
  select * from jsonb_populate_recordset(null::public.product_variants, p_backup -> 'product_variants');

  insert into public.recipes
  select * from jsonb_populate_recordset(null::public.recipes, p_backup -> 'recipes');
  get diagnostics v_recipes = row_count;

  insert into public.recipe_steps
  select * from jsonb_populate_recordset(null::public.recipe_steps, p_backup -> 'recipe_steps');

  insert into public.recipe_dish_categories
  select * from jsonb_populate_recordset(null::public.recipe_dish_categories, p_backup -> 'recipe_dish_categories');

  insert into public.recipe_ingredients
  select * from jsonb_populate_recordset(null::public.recipe_ingredients, p_backup -> 'recipe_ingredients');

  insert into public.cook_logs
  select * from jsonb_populate_recordset(null::public.cook_logs, p_backup -> 'cook_logs');
  get diagnostics v_cook_logs = row_count;

  return jsonb_build_object(
    'products', v_products,
    'recipes', v_recipes,
    'cook_logs', v_cook_logs
  );
end;
$$;

revoke execute on function public.import_backup(jsonb) from public, anon;
grant execute on function public.import_backup(jsonb) to authenticated;
