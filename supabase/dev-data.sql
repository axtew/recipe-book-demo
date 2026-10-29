-- Temporary data for development and acceptance of Phases 6-10.
--
-- NOT a migration and not seed.sql: lies alongside, applied by hand, removed by its
-- paired dev-data-cleanup.sql. Does not reach production via db push.
--
-- All rows have fixed ids with the prefix dddddddd- — cleanup uses it to find them
-- exactly, regardless of whether they were renamed in the interface later or not.
-- Re-running is safe (on conflict do nothing).
--
-- The set is chosen for the phase checks, not just to fill the screen:
--   * a product with one variant   -> nesting is not shown
--   * with two and with three      -> variant list, switching the active one
--   * a product without nutrition  -> warning about incomplete data
--   * an archived product          -> invisible in lists and autocomplete
--   * a recipe with ingredients    -> the "used in" block is not empty
--   * an optional ingredient       -> excluded from the calculation
--   * a pinned variant             -> shown in the recipe card
--
-- Nutrition (kcal/protein/fat/carbs) is given for the product as it is weighed:
-- cereals dry, meat raw.

begin;

insert into product_categories (id, name, sort_order) values
  ('dddddddd-0000-4000-8000-000000000001', 'Молочное',         10),
  ('dddddddd-0000-4000-8000-000000000002', 'Мясо и птица',     20),
  ('dddddddd-0000-4000-8000-000000000003', 'Овощи',            30),
  ('dddddddd-0000-4000-8000-000000000004', 'Крупы и макароны', 40),
  ('dddddddd-0000-4000-8000-000000000005', 'Масла и соусы',    50)
on conflict (id) do nothing;

insert into products (id, name, category_id, note) values
  ('dddddddd-0000-4000-8000-000000000101', 'Молоко',             'dddddddd-0000-4000-8000-000000000001', null),
  ('dddddddd-0000-4000-8000-000000000102', 'Сметана 20%',        'dddddddd-0000-4000-8000-000000000001', null),
  ('dddddddd-0000-4000-8000-000000000103', 'Яйцо куриное',       'dddddddd-0000-4000-8000-000000000001', null),
  ('dddddddd-0000-4000-8000-000000000104', 'Куриное филе',       'dddddddd-0000-4000-8000-000000000002', null),
  ('dddddddd-0000-4000-8000-000000000105', 'Свинина, лопатка',   'dddddddd-0000-4000-8000-000000000002', null),
  ('dddddddd-0000-4000-8000-000000000106', 'Огурцы',             'dddddddd-0000-4000-8000-000000000003', null),
  ('dddddddd-0000-4000-8000-000000000107', 'Помидоры',           'dddddddd-0000-4000-8000-000000000003', null),
  ('dddddddd-0000-4000-8000-000000000108', 'Лук репчатый',       'dddddddd-0000-4000-8000-000000000003', null),
  ('dddddddd-0000-4000-8000-000000000109', 'Рис',                'dddddddd-0000-4000-8000-000000000004', 'КБЖУ для сухого'),
  ('dddddddd-0000-4000-8000-00000000010a', 'Гречка',             'dddddddd-0000-4000-8000-000000000004', 'КБЖУ для сухой'),
  ('dddddddd-0000-4000-8000-00000000010b', 'Масло растительное', 'dddddddd-0000-4000-8000-000000000005', null),
  ('dddddddd-0000-4000-8000-00000000010c', 'Соевый соус',        'dddddddd-0000-4000-8000-000000000005', 'КБЖУ намеренно не заполнено — проверка предупреждения'),
  ('dddddddd-0000-4000-8000-00000000010d', 'Кинза',              'dddddddd-0000-4000-8000-000000000003', 'архивирован — проверка, что не виден в списках')
on conflict (id) do nothing;

update products set archived_at = now()
where id = 'dddddddd-0000-4000-8000-00000000010d' and archived_at is null;

insert into product_variants
  (id, product_id, name, kcal_100, protein_100, fat_100, carbs_100, is_approximate, source) values
  -- three variants: the variant list and switching the active one
  ('dddddddd-0000-4000-8000-000000000201', 'dddddddd-0000-4000-8000-00000000010b', 'Подсолнечное', 899.0,  0.0,  99.9,  0.0, false, 'label'),
  ('dddddddd-0000-4000-8000-000000000202', 'dddddddd-0000-4000-8000-00000000010b', 'Оливковое',    898.0,  0.0,  99.8,  0.0, false, 'label'),
  ('dddddddd-0000-4000-8000-000000000203', 'dddddddd-0000-4000-8000-00000000010b', 'Кунжутное',    884.0,  0.0, 100.0,  0.0, false, 'label'),
  -- two variants
  ('dddddddd-0000-4000-8000-000000000204', 'dddddddd-0000-4000-8000-000000000101', '3.2%',          60.0,  2.9,   3.2,  4.7, false, 'label'),
  ('dddddddd-0000-4000-8000-000000000205', 'dddddddd-0000-4000-8000-000000000101', '3.5%',          64.0,  3.0,   3.5,  4.7, false, 'label'),
  ('dddddddd-0000-4000-8000-000000000206', 'dddddddd-0000-4000-8000-000000000109', 'Жасминовый',   345.0,  7.0,   0.6, 78.0, true,  'seed'),
  ('dddddddd-0000-4000-8000-000000000207', 'dddddddd-0000-4000-8000-000000000109', 'Басмати',      350.0,  8.0,   0.9, 77.0, true,  'seed'),
  -- one variant each: nesting is not shown
  ('dddddddd-0000-4000-8000-000000000208', 'dddddddd-0000-4000-8000-000000000102', null,           204.0,  2.8,  20.0,  3.2, false, 'label'),
  ('dddddddd-0000-4000-8000-000000000209', 'dddddddd-0000-4000-8000-000000000103', null,           157.0, 12.7,  11.5,  0.7, true,  'seed'),
  ('dddddddd-0000-4000-8000-00000000020a', 'dddddddd-0000-4000-8000-000000000104', null,           113.0, 23.6,   1.9,  0.4, true,  'seed'),
  ('dddddddd-0000-4000-8000-00000000020b', 'dddddddd-0000-4000-8000-000000000105', null,           257.0, 16.0,  21.0,  0.0, true,  'seed'),
  ('dddddddd-0000-4000-8000-00000000020c', 'dddddddd-0000-4000-8000-000000000106', null,            15.0,  0.8,   0.1,  2.8, true,  'seed'),
  ('dddddddd-0000-4000-8000-00000000020d', 'dddddddd-0000-4000-8000-000000000107', null,            20.0,  1.1,   0.2,  3.7, true,  'seed'),
  ('dddddddd-0000-4000-8000-00000000020e', 'dddddddd-0000-4000-8000-000000000108', null,            41.0,  1.4,   0.2,  8.2, true,  'seed'),
  ('dddddddd-0000-4000-8000-00000000020f', 'dddddddd-0000-4000-8000-00000000010a', null,           343.0, 13.3,   3.4, 62.1, true,  'seed'),
  ('dddddddd-0000-4000-8000-000000000210', 'dddddddd-0000-4000-8000-00000000010d', null,            23.0,  2.1,   0.5,  3.7, true,  'seed'),
  -- nutrition not filled in: check of the incomplete-data warning
  ('dddddddd-0000-4000-8000-000000000211', 'dddddddd-0000-4000-8000-00000000010c', null,            null,  null,  null, null, false, 'manual')
on conflict (id) do nothing;

update products p set active_variant_id = v.id
from product_variants v
where v.product_id = p.id
  and p.id::text like 'dddddddd-%'
  and p.active_variant_id is null
  -- order by ... limit 1, not min(): the min/max aggregates do not work with uuid
  -- in PostgreSQL before version 18.
  and v.id = (
    select v2.id from product_variants v2
    where v2.product_id = p.id
    order by v2.id
    limit 1
  );

-- A recipe: the "used in" block stops being empty, plus an optional
-- ingredient, a pinned variant and a product without nutrition data in one place.
insert into recipes (id, name, servings_base, yield_grams, cook_time_min, freezable, fridge_days, notes) values
  ('dddddddd-0000-4000-8000-000000000301', 'Омлет с помидорами', 2, 380.0, 15, false, 2, 'Тестовый рецепт из dev-data.sql')
on conflict (id) do nothing;

insert into recipe_dish_categories (recipe_id, dish_category_id)
select 'dddddddd-0000-4000-8000-000000000301', id from dish_categories where name = 'Завтраки'
on conflict do nothing;

insert into recipe_ingredients
  (id, recipe_id, product_id, pinned_variant_id, amount_grams, is_optional, sort_order) values
  ('dddddddd-0000-4000-8000-000000000401', 'dddddddd-0000-4000-8000-000000000301', 'dddddddd-0000-4000-8000-000000000103', null,                                   150.0, false, 1),
  ('dddddddd-0000-4000-8000-000000000402', 'dddddddd-0000-4000-8000-000000000301', 'dddddddd-0000-4000-8000-000000000101', 'dddddddd-0000-4000-8000-000000000204',  50.0, false, 2),
  ('dddddddd-0000-4000-8000-000000000403', 'dddddddd-0000-4000-8000-000000000301', 'dddddddd-0000-4000-8000-000000000107', null,                                   120.0, false, 3),
  ('dddddddd-0000-4000-8000-000000000404', 'dddddddd-0000-4000-8000-000000000301', 'dddddddd-0000-4000-8000-00000000010b', 'dddddddd-0000-4000-8000-000000000201',  10.0, false, 4),
  ('dddddddd-0000-4000-8000-000000000405', 'dddddddd-0000-4000-8000-000000000301', 'dddddddd-0000-4000-8000-00000000010c', null,                                     5.0, true,  5)
on conflict (id) do nothing;

insert into recipe_steps (id, recipe_id, sort_order, text) values
  ('dddddddd-0000-4000-8000-000000000501', 'dddddddd-0000-4000-8000-000000000301', 1, 'Помидоры нарезать, обжарить на масле 3 минуты.'),
  ('dddddddd-0000-4000-8000-000000000502', 'dddddddd-0000-4000-8000-000000000301', 2, 'Яйца взбить с молоком, посолить.'),
  ('dddddddd-0000-4000-8000-000000000503', 'dddddddd-0000-4000-8000-000000000301', 3, 'Влить к помидорам, готовить под крышкой 7 минут.')
on conflict (id) do nothing;

commit;
