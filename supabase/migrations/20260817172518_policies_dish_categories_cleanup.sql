-- 1. Missing RLS policies.
-- init.sql created a policy only for products. RLS enabled without a policy
-- closes the table completely, authenticated included, so the application would
-- have seen empty lists everywhere.

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

-- 2. Dish categories — many-to-many.
-- One recipe can belong to several categories at once (pancakes are both breakfast
-- and dessert), so the single reference recipes.dish_category_id is replaced
-- by a junction table.

create table recipe_dish_categories (
  recipe_id        uuid not null references recipes(id)         on delete cascade,
  dish_category_id uuid not null references dish_categories(id) on delete restrict,
  primary key (recipe_id, dish_category_id)
);

-- The composite primary key already provides an index with leading recipe_id, so
-- the lookup "categories of this recipe" is covered. The reverse direction —
-- "recipes of this category", needed for grouping on the main screen — requires
-- its own index.
create index idx_rdc_category on recipe_dish_categories(dish_category_id);

alter table recipe_dish_categories enable row level security;

create policy "authenticated full access" on recipe_dish_categories
  for all to authenticated using (true) with check (true);

alter table recipes drop column dish_category_id;

-- 3. Cleanup of prefilled products.
-- The product catalogue is filled by hand with what is actually bought.
-- Dish categories stay — they are universal.
--
-- Order matters: fk_active_variant is declared on delete restrict, and RESTRICT
-- in Postgres is checked immediately and cannot be deferred even for a deferrable
-- constraint. So first we clear the references to active variants, and only
-- then delete the variants themselves.

update products set active_variant_id = null;
delete from product_variants;
delete from products;
delete from product_categories;

-- 4. Table privileges for the authenticated role.
-- RLS decides which rows are visible, but before it a query must pass the ordinary
-- privilege check. In this project anon / authenticated turned out to have neither
-- SELECT, nor INSERT, nor UPDATE — only REFERENCES / TRIGGER / TRUNCATE. So the
-- query failed with 42501 permission denied before the policies even came into play.
--
-- The anon role gets nothing: unauthenticated access is not intended.

-- Archivable entities: there is no deletion, only archived_at. The absence of the
-- DELETE right makes it impossible to break this invariant from the application.
grant select, insert, update on
  product_categories,
  dish_categories,
  products,
  product_variants,
  recipes
  to authenticated;

-- Child rows that live only inside a parent: removing an ingredient or a step
-- from a recipe is a real row deletion, there is nothing to archive.
-- Same for cook_logs: a mistaken log entry has no archived_at field.
grant select, insert, update, delete on
  recipe_steps,
  recipe_ingredients,
  recipe_dish_categories,
  cook_logs
  to authenticated;

-- Deliberately NOT setting alter default privileges: let a new table fail with
-- a clear permission denied rather than get privileges silently. The checklist for
-- any new table is enable rls + policy + grant.
