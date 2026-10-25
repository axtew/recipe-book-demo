# 0019. Dish categories are many-to-many

- Status: accepted
- Date: 2026-08-18

## Context and problem

The original statement (the former fork R-5): `recipes.dish_category_id` — one mandatory category. The owner's remark is fair: pancakes are both breakfast and dessert. Changing it **now** is cheap (there are no recipes in the database), later it is a migration plus a change to the main screen.

## Considered options

1. **Keep one.** Change nothing.
2. **Many-to-many** — a table `recipe_dish_categories(recipe_id, dish_category_id)`. The cheapest schema (one link table, no new concepts), and on the main screen a recipe appears in every matching group. The downside is that a recipe is visible several times, and the "total recipes" counters become ambiguous.
3. **One main category + tags** — the category defines the grouping on the main screen (one place per recipe), tags take part in filters. Neater product-wise, but it is a new `tags` entity + a link, that is, more work.

## Decision

**Many-to-many**, the table `recipe_dish_categories(recipe_id, dish_category_id)` with a composite primary key. The column `recipes.dish_category_id` is removed.

## Consequences

- A recipe appears in every matching group on the main screen, and it may have **zero** categories: "at least one" cannot be expressed by a simple constraint, so the form checks it, and the list must show an "Uncategorized" group.
- `DELETE` on `recipe_dish_categories` is granted: the row lives inside its parent ([ADR 0014](0014-archiving-instead-of-deletes.md)).
