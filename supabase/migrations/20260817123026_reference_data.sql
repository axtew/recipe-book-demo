insert into product_categories (name, sort_order) values
  ('Молочное',             10),
  ('Мясо и птица',         20),
  ('Рыба',                 30),
  ('Овощи',                40),
  ('Фрукты',               50),
  ('Крупы и макароны',     60),
  ('Мука и выпечка',       70),
  ('Масла и соусы',        80),
  ('Специи',               90),
  ('Орехи и сухофрукты',  100),
  ('Консервы',            110),
  ('Напитки',             120),
  ('Прочее',              130);

insert into dish_categories (name, sort_order) values
  ('Завтраки', 10), ('Обеды', 20), ('Ужины', 30),
  ('Супы', 40), ('Выпечка', 50), ('Десерты', 60), ('Заготовки', 70);

insert into products (name, category_id)
select p.name, c.id
from (values
  ('Молоко 3.2%',      'Молочное'),
  ('Сметана 20%',      'Молочное'),
  ('Яйцо куриное',     'Молочное'),
  ('Куриное филе',     'Мясо и птица'),
  ('Рис белый',        'Крупы и макароны')
  -- ... the rest
) as p(name, category)
join product_categories c on c.name = p.category;

insert into product_variants
  (product_id, kcal_100, protein_100, fat_100, carbs_100, is_approximate, source)
select pr.id, v.kcal, v.protein, v.fat, v.carbs, true, 'seed'
from (values
  ('Молоко 3.2%',   60.0,  2.9,  3.2,  4.7),
  ('Сметана 20%',  204.0,  2.8, 20.0,  3.2),
  ('Яйцо куриное', 157.0, 12.7, 11.5,  0.7),
  ('Куриное филе', 113.0, 23.6,  1.9,  0.4),
  ('Рис белый',    344.0,  6.7,  0.7, 78.9)
  -- ... the rest
) as v(name, kcal, protein, fat, carbs)
join products pr on pr.name = v.name;

update products p
set active_variant_id = v.id
from product_variants v
where v.product_id = p.id
  and p.active_variant_id is null;
