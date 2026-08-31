-- Удаление временных данных из dev-data.sql.
--
-- Запускать, когда интерфейс дозреет до самостоятельного наполнения справочника
-- (после Фазы 7 — там появляется создание продукта, после Фазы 8 — рецептов).
--
-- Удаляет строго строки с id-префиксом dddddddd-, поэтому всё, что вы завели
-- руками через интерфейс, остаётся нетронутым. Повторный запуск безопасен.
--
-- Порядок важен: сначала снимаются ссылки, потом удаляются дочерние строки,
-- потом родительские. Пробовать удалять products до product_variants нельзя —
-- fk_active_variant объявлен on delete restrict, и RESTRICT в Postgres
-- проверяется немедленно, не откладываясь до конца транзакции.

begin;

-- 1. Рецепт и всё, что к нему привязано.
delete from recipe_ingredients     where id::text        like 'dddddddd-%';
delete from recipe_steps           where id::text        like 'dddddddd-%';
delete from recipe_dish_categories where recipe_id::text like 'dddddddd-%';
delete from cook_logs              where recipe_id::text like 'dddddddd-%';
delete from recipes                where id::text        like 'dddddddd-%';

-- 2. Ингредиенты чужих рецептов, ссылающиеся на тестовые продукты, удалять
--    нельзя молча — если такие есть, значит вы уже пользовались этими
--    продуктами по-настоящему. Прерываемся и сообщаем.
do $$
declare
  used int;
begin
  select count(*) into used
  from recipe_ingredients ri
  where ri.product_id::text like 'dddddddd-%';

  if used > 0 then
    raise exception 'Тестовые продукты используются в % ингредиентах настоящих рецептов. Замените их вручную перед очисткой.', used;
  end if;
end $$;

-- 3. Продукты: сначала снять ссылку на активный вариант, потом варианты,
--    потом сами продукты.
update products set active_variant_id = null where id::text like 'dddddddd-%';
delete from product_variants   where id::text like 'dddddddd-%';
delete from products           where id::text like 'dddddddd-%';
delete from product_categories where id::text like 'dddddddd-%';

commit;
