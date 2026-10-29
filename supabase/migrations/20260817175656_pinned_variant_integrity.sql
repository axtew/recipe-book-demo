-- Pinning a variant to an ingredient: guarantee that the pinned variant belongs
-- to the same product as the ingredient itself.
--
-- Before: pinned_variant_id referenced product_variants(id) with a plain foreign
-- key. Such a key checks only "that variant exists", so an ingredient "Cucumbers"
-- could be pinned to a butter variant — and the butter's nutrition would end up
-- in the recipe. Exactly the hole that is closed on products
-- .active_variant_id by a composite key.
--
-- Same technique: reference a (product, variant) pair to a (product, variant)
-- pair in the variants table. A match is found only if the variant belongs to
-- this product.

-- A foreign key can only reference a set of columns declared unique. The existing
-- uq_variant_product is (id, product_id), but we need the reverse order:
-- product_id must lead.
alter table product_variants
  add constraint uq_variant_product_reversed unique (product_id, id);

alter table recipe_ingredients
  drop constraint recipe_ingredients_pinned_variant_id_fkey;

alter table recipe_ingredients
  add constraint fk_pinned_variant
  foreign key (product_id, pinned_variant_id)
  references product_variants(product_id, id)
  on delete restrict;

-- Deferrable is not needed here, unlike active_variant_id: there is no circular
-- reference — by the time an ingredient is added, both the product and its
-- variant already exist.
--
-- pinned_variant_id stays nullable, and that works: per the SQL standard, if at
-- least one column of a composite foreign key is null, the constraint is
-- considered satisfied and is not checked. So an ingredient without a pinned
-- variant (the usual case — the product's active variant is taken) passes
-- freely.
