-- Removal of the temporary data from dev-data.sql.
--
-- Run when the interface is ready for filling the catalogue by itself
-- (after Phase 7 — product creation appears there, after Phase 8 — recipes).
--
-- Deletes strictly rows with the id prefix dddddddd-, so everything you created
-- by hand through the interface stays untouched. Re-running is safe.
--
-- Order matters: first the references are cleared, then child rows are deleted,
-- then the parents. Deleting products before product_variants is not possible —
-- fk_active_variant is declared on delete restrict, and RESTRICT in Postgres
-- is checked immediately, not deferred to the end of the transaction.

begin;

-- 1. The recipe and everything attached to it.
delete from recipe_ingredients     where id::text        like 'dddddddd-%';
delete from recipe_steps           where id::text        like 'dddddddd-%';
delete from recipe_dish_categories where recipe_id::text like 'dddddddd-%';
delete from cook_logs              where recipe_id::text like 'dddddddd-%';
delete from recipes                where id::text        like 'dddddddd-%';

-- 2. Ingredients of other recipes that reference the test products must not be
--    deleted silently — if there are any, you have already used these products
--    for real. Abort and report.
do $$
declare
  used int;
begin
  select count(*) into used
  from recipe_ingredients ri
  where ri.product_id::text like 'dddddddd-%';

  if used > 0 then
    raise exception 'Test products are used in % ingredients of real recipes. Replace them manually before cleanup.', used;
  end if;
end $$;

-- 3. Products: first clear the reference to the active variant, then the variants,
--    then the products themselves.
update products set active_variant_id = null where id::text like 'dddddddd-%';
delete from product_variants   where id::text like 'dddddddd-%';
delete from products           where id::text like 'dddddddd-%';
delete from product_categories where id::text like 'dddddddd-%';

commit;
