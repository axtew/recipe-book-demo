[Русский](task.ru.md) · **English**

# The original brief

Below is the original brief, word for word. The Russian text ([`task.ru.md`](task.ru.md)) is the source of truth; this English file is a faithful translation of it. This is a historical reference: some of its decisions were later cancelled or refined, and the [ADRs](decisions/README.md) are the ones in force. What exactly changed:

- Users: not one (my wife) but two; there is no desktop in v1 — [ADR 0001](decisions/0001-personal-app-for-two.md).
- "The stack, hosting and deployment are not set" — decided: [ADR 0003](decisions/0003-spa-pwa-on-vite.md)–[0013](decisions/0013-cloudflare-hosting.md).
- Units: grams only, no milliliters; `ProductVariant.is_active` is removed (the active variant is `Product.active_variant_id`); the nutrition of a variant is nullable; `is_approximate` and `source` are added; only the dish categories are pre-filled, not 50–80 products — [ADR 0016](decisions/0016-variants-and-active-variant.md).
- There are no deletes, only `archived_at` — [ADR 0014](decisions/0014-archiving-instead-of-deletes.md).
- A recipe has several dish categories instead of one (`dish_category_id` is removed) — [ADR 0019](decisions/0019-dish-categories-many-to-many.md).
- Steps are a separate table, there is one photo, the weight of the dish needs no new fields, the JSON export exists from the first version — [ADR 0020](decisions/0020-recipe-content-and-backup.md).
- `CookLog` stores a nutrition snapshot, the dates are `YYYY-MM-DD` strings — [ADR 0018](decisions/0018-cook-log-snapshot-and-dates.md).
- The wording of the brief is in the feminine gender (in Russian); the interface text is not tied to gender — [`conventions/i18n.md`](agents/conventions/i18n.md).

---

# Task: the "Recipe Book" app — version 1

## Context

A personal app for one user (my wife). The interface language is Russian. The main usage scenario is the phone, so mobile-first.

The final goal of the project (NOT in this version, but the data structure is laid out for it): planning the menu two weeks ahead for batch cooking — cook a lot in one day, freeze, eat for two weeks — and automatic generation of a shopping list with total weights.

Version 1 is the foundation: a product reference, recipes, search and a cooking log. The goal of v1 is to make it possible to actually fill the recipe base and start accumulating statistics. Planning and the shopping list come in v2.

**The stack, hosting and deployment are not set — discuss this with me separately before starting work.** Below are only the functional requirements.

---

## Data model

### The product reference — two levels

The key architectural decision. A product (`Product`) is a generalized entity: "Butter", "Chicken fillet", "Cucumbers". Inside a product there are concrete purchase variants (`ProductVariant`): "Prostokvashino 82.5%", "Ekomilk 72.5%". The nutrition (kcal, protein, fat, carbs) is stored at the variant level, not the product level.

A product has an **active variant** — the one that is in the fridge right now. Bought butter of another brand → added a new variant, marked it active → the calories in all recipes recalculated automatically, the recipes themselves do not need to be touched.

The structure is the same for all products, but if a product has a single variant (cucumbers, salt), the interface does not show the nesting — the card looks like a regular simple product. No two branches of logic, the difference is only in the display.

```
ProductCategory
  id, name, sort_order

Product
  id, name, category_id, active_variant_id, note

ProductVariant
  id, product_id, name (may be empty for a single variant),
  kcal_100, protein_100, fat_100, carbs_100,
  is_active, note, created_at

DishCategory
  id, name, sort_order
  (breakfasts, lunches, dinners, soups, baking, desserts — the list is editable)

Recipe
  id, name, dish_category_id,
  servings_base            — how many servings the recipe is written for
  yield_grams              — weight of the cooked dish, nullable
  cook_time_min, photo, notes,
  video_urls[]             — several links
  freezable                — whether it can be frozen
  freezer_days, fridge_days — storage periods
  kcal_100_override, protein_100_override, fat_100_override, carbs_100_override — nullable, manual edit
  created_at, updated_at

RecipeIngredient
  id, recipe_id, product_id,
  pinned_variant_id        — nullable, pin a specific brand for this recipe
  amount_grams, is_optional, note, sort_order

CookLog
  id, recipe_id, cooked_at,
  multiplier               — how many times she cooked relative to the base recipe
  actual_yield_grams       — how much actually came out, nullable
  containers               — how many containers it made, nullable
  finished_at              — when it ran out, nullable
  rating, note
```

### Units of measurement

Only grams and milliliters. No spoons, cups or pieces — we enter pure weight. Do not complicate things with conversions.

---

## Nutrition calculation

It is calculated automatically, but with the possibility of a manual override (the `*_override` fields).

The algorithm:

1. For each ingredient take the nutrition from `pinned_variant_id` if it is set, otherwise from the active variant of the product.
2. Sum over all ingredients: `kcal_100 * amount_grams / 100`. This gives the nutrition of the whole dish.
3. The raw weight = the sum of `amount_grams` of all ingredients.
4. **Nutrition per 100 g**: if `yield_grams` is set — divide by it; if it is not set — divide by the raw weight. When `yield_grams` is missing, show in the interface an unobtrusive hint that the calculation is by raw weight and does not account for cooking loss.
5. **Nutrition per serving** = nutrition of the dish / `servings_base`.
6. Ingredients with `is_optional = true` are not included in the calculation.

**Important:** if some product in a recipe has no nutrition filled in, do not silently substitute zeros. Show in the recipe card an explicit warning listing the problem products and a link to edit them. Wrong numbers are worse than missing ones.

If the `*_override` fields are filled in, show them, but give a "recalculate" button next to them and mark that the value was entered manually.

---

## Screens and UX

### 1. Recipe list (the main screen)

- Grouping by dish categories with the ability to collapse a category.
- A card in the list: photo (or a placeholder), name, cooking time, kcal per 100 g, a snowflake icon if it can be frozen.
- Search at the top — works both by the recipe name **and by the ingredient**. The query "chicken" must find all dishes that contain chicken fillet. This is a separate frequent scenario: "what to cook from what I have".
- Filters: freezable only, by cooking time.

### 2. Recipe card

The order of blocks from top to bottom:

- Photo, name, category, cooking time.
- Nutrition: large per 100 g, next to it smaller — per serving and for the whole dish.
- The storage block: whether it can be frozen, the periods in the freezer and in the fridge. Show it only if `freezable`.
- Ingredients: product + grams. Next to each one — in small type the name of the variant used, if the product has more than one.
- Cooking steps — a numbered list.
- Video — as buttons, opened in an external app.
- Notes.
- The **"Cooked it"** button — opens a quick add to the log.

### 3. Adding and editing a recipe

This is the screen where the app lives or dies. My wife will be moving several dozen recipes here from screenshots, videos and websites — if the process is painful, the app simply will not be used.

Requirements:

- An ingredient row: a product search field with autocomplete + a grams field. Nothing extra.
- **If the product is not in the reference, create it right here without leaving the recipe screen.** A compact modal: name, category, nutrition per 100 g. Saved → the product is substituted into the row → you continue filling in the recipe. This is critical, going to a separate reference section in the middle of entering a recipe is unacceptable.
- Likewise, a new variant can be added to an existing product without leaving the recipe.
- A draft must not be lost on an accidental close — autosave.
- Cooking steps: add/remove/drag.
- Ingredients: drag to change the order.
- The nutrition is recalculated on the fly as the ingredients are entered — visible at once, not after saving.

### 4. Product reference

- A list by product categories.
- A product card: the variants as a list, the active one has a mark. Switching the active one in one tap.
- Each variant has its nutrition and the date it was added.
- In the product card: the list of recipes where it is used.
- Deleting a product that is used in recipes is blocked with an explanation.

### 5. Cooking log

- Adding an entry in two or three taps at most: date (today by default), multiplier (×1, ×2, ×3, ×4 as buttons + an arbitrary value), actual yield in grams and/or number of containers, a note.
- Later — a "finished" mark with a date.
- In the recipe card: how many times she cooked it, when she cooked it last, the average actual yield, how many days it lasted on average.

This data is the basis for planning in v2, so it has to be collected from the very beginning, even if for now it is just displayed.

---

## What we do NOT do in v1

An explicit list so that it does not sprawl:

- Planning the menu for two weeks.
- Generating a shopping list.
- Cooking mode with timers and screen-sleep protection.
- Importing recipes from a link or screenshots, recognition.
- Tracking the stock of products at home.
- Multi-user mode, sharing, roles.
- Built-in video playback (external links only).

## What to lay out for the future

- `sort_order` of the product categories = the order of the store departments, for grouping the future shopping list.
- Ingredients are stored structurally, never as one text string.
- The nutrition calculation and the scaling of amounts — as a separate isolated module, it will also be used in planning.
- Export of the whole database to JSON — needed from the first version, for backup.

---

## Starting data

Pre-fill the reference with 50–80 basic products with averaged nutrition (egg, milk, flour, sugar, salt, vegetable oil, rice, buckwheat, potatoes, onion, carrots, etc.), arranged by categories. Mark such variants as averaged, so that it is clear they should be replaced with real purchases.

Product categories: dairy, meat and poultry, fish, vegetables, fruit, grains and pasta, flour and baking, oils and sauces, spices, nuts and dried fruit, canned goods, drinks, other.

---

## Order of work

Before writing code: propose to me a database schema and a short description of the screens with the navigation, and wait for confirmation. We discuss the stack first too.

When implementing, go in layers: first the product reference with variants, then recipes with the nutrition calculation, then lists and search, and the cooking log at the end. After each layer — a working state that can be looked at.
