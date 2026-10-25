# 0016. Product and its variants: grams, one active variant, nullable nutrition

- Status: accepted
- Date: 2026-08-02

## Context and problem

The product list has two levels: a product and its variants (brands). We need to decide where the active variant is stored, in which units everything is calculated and what to do with products that have no numbers filled in. The whole schema is in `plans/recipe-book-v1/plan.md`; differences from the original brief ([`docs/task.md`](../task.md)) — everything below takes priority over it.

## Considered options

Active variant:
1. **`Product.active_variant_id` — a single place.**
2. `ProductVariant.is_active` from the brief — removed: two sources of one truth drift apart.

Protecting the active variant: a trigger or a **composite FK**.

## Decision

- **Grams only.** The field is `amount_grams`, the label is "g". Millilitres and densities come later; we weigh on scales.
- **The active variant is stored in one place:** `Product.active_variant_id`.
- **The current recipe nutrition is recalculated automatically** from the active variants of the products. Changed the brand of butter → all recipes were recalculated. This is a declared feature of the brief.
- **Variant nutrition is nullable.** A product can be created quickly and its numbers filled in later — exactly the scenario inline creation is made for. "Incomplete nutrition" = no active variant, or null in any of the four fields.
- **The active variant is protected by a composite FK**, not by a trigger: `unique (id, product_id)` on the variants + `foreign key (active_variant_id, id)` from the product. The database itself will not allow assigning someone else's variant as active.
- **The pinned ingredient variant is protected by the same technique** (migration of 2026-08-18): `unique (product_id, id)` + `foreign key (product_id, pinned_variant_id)`. A butter variant cannot be pinned to cucumbers. Two similar unique constraints with a different column order are not duplication: a foreign key requires the column it looks up by to be the leading one.
- **`ProductVariant.is_approximate`** — a flag of averaged nutrition, needed for the starting 50–80 products.
- **`ProductVariant.source`** — `seed | manual | label | llm`. Introduced right away, although `llm` will appear only in v2: without this field you could not later tell the weighed from the model-invented.
- **Ingredients only structurally**, never as a single text line. Optional ingredients (`is_optional`) are not included in the nutrition calculation.
- **The override works at the "per 100 g" level, for each field separately.** Total and per serving are recalculated from the effective value.
- **Only dish categories are prefilled** ([ADR 0019](0019-dish-categories-many-to-many.md)). Products and product categories are filled in manually with what is actually bought: an averaged reference would have to be replaced with real purchases anyway, and until then it would hang around as junk and cause confusion — unclear whether the numbers are verified (decision of 2026-08-18).
- **`ProductCategory.sort_order` = the order of store departments** (from the brief) — a bridge to the future shopping list and to household purchases ([ADR 0030](0030-household-purchases-deferred.md)).

## Consequences

- The arithmetic is [ADR 0017](0017-nutrition-module-purity.md); the log history is not rewritten when the active variant changes — [ADR 0018](0018-cook-log-snapshot-and-dates.md).
