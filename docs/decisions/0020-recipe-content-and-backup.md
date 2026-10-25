# 0020. Recipe content: steps, one photo, dish weight; export to JSON

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need to decide how recipe steps and photos are stored, how to account for the weight of raw ingredients and of the finished dish, and how to make a backup. The weight question was discussed on 2026-08-17: whether separate fields are needed for the raw weight and for the finished dish weight.

## Considered options

Weight:
1. **No extra fields** — the three needed values already exist (see below).
2. A separate raw weight field — rejected: it is a derived value, storing it would duplicate data; if you edit an ingredient's grams, the saved sum silently diverges from reality.

Steps: jsonb in the recipe versus a separate table.

Photo bucket: public versus signed URL.

## Decision

- **Cooking steps are a separate table** `RecipeStep(id, recipe_id, sort_order, text)`, not jsonb. Reason: `sort_order` for reordering, a reserve for timers in v2.
- **One recipe photo**, the cover. Client-side compression to ~1200px WebP before uploading to Supabase Storage.
- **The `recipe-photos` bucket is public.** A stable URL is cached by the service worker and the photo is visible offline; a signed URL expires and breaks offline. There is no risk — it is a photo of food at an address with a random UUID.
- **Dish weight is three values, no extra fields are needed:**
  - raw weight — the sum of `amount_grams` of the non-optional ingredients, a **derived value**, calculated in the calculation module;
  - `recipes.yield_grams` — the expected weight of the finished dish according to the recipe, nullable; the divisor for nutrition per 100 g, if known;
  - `cook_logs.actual_yield_grams` — the actual output of a particular cook; in v2 the real average coefficient is taken from it.
- **Export of the whole database to JSON — from the first version, for backup.** The import is validated through zod ([ADR 0007](0007-zod-and-own-form-hook.md)).

## Consequences

- Weight does not always decrease: grains and pasta gain it (rice ×2.5–3, pasta ×2.2), meat loses both water and rendered fat. The model "lost weight = water" is wrong, and it is good that nothing was built on it. The coefficient `yield / raw weight` comes for free from the values already stored.
- Deferred backup improvements (automatic export backup, backup together with photos, import into a non-empty database) are in [`BACKLOG.md`](../../BACKLOG.md).
