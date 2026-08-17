-- 1. Недостающие политики RLS.
-- В init.sql политика была создана только для products. Включённая RLS без
-- политики закрывает таблицу полностью, в том числе для authenticated, поэтому
-- приложение видело бы пустые списки везде.

create policy "authenticated full access" on product_categories
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on dish_categories
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on product_variants
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on recipes
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on recipe_steps
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on recipe_ingredients
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on cook_logs
  for all to authenticated using (true) with check (true);

-- 2. Категории блюд — много-ко-многим.
-- Один рецепт может относиться сразу к нескольким категориям (блины — и завтрак,
-- и десерт), поэтому одиночная ссылка recipes.dish_category_id заменяется
-- связующей таблицей.

create table recipe_dish_categories (
  recipe_id        uuid not null references recipes(id)         on delete cascade,
  dish_category_id uuid not null references dish_categories(id) on delete restrict,
  primary key (recipe_id, dish_category_id)
);

-- Составной первичный ключ уже даёт индекс с ведущим recipe_id, то есть выборка
-- «категории этого рецепта» покрыта. Обратное направление — «рецепты этой
-- категории», нужное для группировки на главном экране — требует своего индекса.
create index idx_rdc_category on recipe_dish_categories(dish_category_id);

alter table recipe_dish_categories enable row level security;

create policy "authenticated full access" on recipe_dish_categories
  for all to authenticated using (true) with check (true);

alter table recipes drop column dish_category_id;

-- 3. Очистка предзаполненных продуктов.
-- Справочник продуктов заполняется вручную тем, что реально покупается.
-- Категории блюд остаются — они универсальны.
--
-- Порядок важен: fk_active_variant объявлен как on delete restrict, а RESTRICT
-- в Postgres проверяется немедленно и не поддаётся отсрочке даже у deferrable
-- ограничения. Поэтому сначала снимаем ссылки на активные варианты, и только
-- потом удаляем сами варианты.

update products set active_variant_id = null;
delete from product_variants;
delete from products;
delete from product_categories;

-- 4. Права на таблицы для роли authenticated.
-- RLS решает, какие строки видны, но до неё запрос должен пройти обычную
-- проверку прав. В этом проекте у anon / authenticated не оказалось ни SELECT,
-- ни INSERT, ни UPDATE — только REFERENCES / TRIGGER / TRUNCATE. Поэтому запрос
-- падал с 42501 permission denied ещё до того, как политики вступали в игру.
--
-- Роли anon не выдаётся ничего: неавторизованный доступ не предусмотрен.

-- Архивируемые сущности: удаления нет, только archived_at. Отсутствие права
-- DELETE делает этот инвариант невозможным нарушить из приложения.
grant select, insert, update on
  product_categories,
  dish_categories,
  products,
  product_variants,
  recipes
  to authenticated;

-- Дочерние строки, живущие только внутри родителя: убрать ингредиент или шаг
-- из рецепта — это настоящее удаление строки, архивировать там нечего.
-- cook_logs тоже: у ошибочной записи журнала нет поля archived_at.
grant select, insert, update, delete on
  recipe_steps,
  recipe_ingredients,
  recipe_dish_categories,
  cook_logs
  to authenticated;

-- Намеренно НЕ ставим alter default privileges: пусть новая таблица падает с
-- внятным permission denied, а не получает права молча. Чек-лист для любой
-- новой таблицы — enable rls + политика + grant.
