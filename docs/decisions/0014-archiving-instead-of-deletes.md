# 0014. No deletes, archiving only

- Status: accepted
- Date: 2026-08-02

## Context and problem

Recipes refer to products, the log refers to recipes and variants. Deleting a product in use breaks old recipes and history; the question "should deleting a product in use be blocked" has to be either decided or removed.

## Considered options

1. **Archiving (`archived_at`) instead of deleting.**
2. Deleting with a block on records in use.

## Decision

**There is no deleting at all, only archiving.** `archived_at` on `Recipe`, `Product`, `ProductVariant`. Archived records are hidden from lists and autocomplete, but stay in old recipes and in the log history. The question "should deleting a product in use be blocked" is thereby removed.

Clarification of 2026-08-18: the `DELETE` privilege is **not granted** to the `authenticated` role on `products`, `product_variants`, `recipes` and the category tables. The invariant "no deletes, only `archived_at`" becomes a physically impossible action rather than a convention. `DELETE` is granted where a row lives inside its parent and there is nothing to archive: `recipe_steps`, `recipe_ingredients`, `recipe_dish_categories`, `cook_logs`.

## Consequences

- Archived rows are loaded into the client like the others and are hidden by selectors and screens, not by the query: the dataset must be internally consistent, and the calculation module throws on a dangling reference ([`conventions/data.md`](../agents/conventions/data.md)).
- The access model is [ADR 0015](0015-grant-plus-rls.md).
