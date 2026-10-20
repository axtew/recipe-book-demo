-- Бэкап базы: выгрузка всех таблиц одним JSON и восстановление из него.
--
-- Выгрузка — одна функция, а не девять запросов с клиента: один SELECT видит
-- одно согласованное состояние базы (девять отдельных запросов могли бы поймать
-- запись посередине и дать файл с висящими ссылками), и PostgREST не обрезает
-- результат по max_rows (1000 строк) — скаляр jsonb это одна строка.
--
-- Импорт — одна транзакция. Он пишет сразу в девять таблиц, а отказ посередине
-- не должен оставлять половину данных. Проверка «база пуста» стоит внутри
-- функции: вынесенная на клиент, она не защищала бы от записи, случившейся
-- между проверкой и вставкой.
--
-- Формат файла — строки таблиц под именами их колонок. Версия формата и схема
-- файла живут в `src/domain/backup/`; добавил колонку в таблицу — обнови схему
-- и поднимай версию там.

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

-- Восстановление из файла, который уже прошёл схему на клиенте.
--
-- «Пустая база» — нет ни продуктов и вариантов, ни рецептов, ни записей
-- журнала. Категории пользовательскими данными не считаются: категории блюд
-- есть в любой свежей базе (миграция reference_data), а категории продуктов
-- могли завести руками до импорта. Их файл не отвергает, а согласуется с ними:
--   - строка с тем же id обновляется (имя, порядок);
--   - иначе строка с тем же именем получает id из файла — ссылки из файла на
--     категорию остаются верными, а стартовые «Завтраки» не удваиваются;
--   - иначе категория добавляется.
-- Категории базы, которых в файле нет, остаются: права DELETE на них нет, и это
-- не данные, которые нужно терять. Переименование id безопасно, потому что на
-- категории ссылаются только продукты и рецепты, а их в пустой базе нет.
--
-- Отказ при непустой базе — исключение с текстом `backup_target_not_empty`;
-- клиент отличает его от прочих ошибок по тексту.
--
-- Возвращает число импортированных записей по трём главным таблицам.

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
  -- Блокировка закрывает гонку между проверкой и вставкой: пока она держится,
  -- чужая запись в эти таблицы ждёт, а второй импорт увидит уже заполненную базу.
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

  -- products ↔ product_variants ссылаются друг на друга; составной FK продукта
  -- отложен до конца транзакции, поэтому порядок вставки между ними не важен.
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
