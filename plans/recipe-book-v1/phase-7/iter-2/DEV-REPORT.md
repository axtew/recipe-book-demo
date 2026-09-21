Status: COMPLETED

## Phase goal

Build the reusable product-selection node that the recipe editor (Phase 8) will sit on: a search-over-in-memory-dataset picker with inline product creation, plus a way to add a further variant to an existing product — no network round-trip for search, and creation must not leave the editor screen.

This run is a RE-RUN combining a plan amendment (Phase 7 "Проверка" swipe-down item removed, replaced by "opens over another sheet, closes by overlay tap / close button / Escape") with a FIX of the reviewer's iteration-1 code findings.

## What was implemented

Iteration 1 built `ProductPicker`, `ProductFormSheet`, `VariantFormSheet`, the shared `BottomSheetDrawer`, and the single-table `addProductVariant` mutation — see the iteration-1 report below for that description; unchanged in this run except as noted.

Iteration 2 fixes:

1. **Removed the pipeline-residue comment.** `ProductPicker/_helpers.ts`'s comment on `normalizeQuery` referenced "Фаза 10 плана" — deleted along with the function itself (see next point), so the whole false/plan-referencing comment is gone.
2. **Lifted `normalizeSearch`/`filterProducts` to a shared module instead of duplicating them.** Both `ProductsPage/_helpers.ts` (existing, already-exported `normalizeSearch`/`filterProducts`) and `ProductPicker` now need the same logic — a real second consumer, which by the placement ladder is exactly the signal to move it up. Created `src/utils/helpers/products.ts` (global level: two features/pages now share it), removed the duplicated functions from `ProductsPage/_helpers.ts` (kept `IProductGroup`/`groupProducts`, which stay page-local), updated `ProductsPage/_useProductsList.ts`'s import, and rewired `ProductPicker` to call `filterProducts`/`normalizeSearch` directly instead of re-implementing the same filter inline. This touches `src/pages/ProductsPage/_helpers.ts` and `src/pages/ProductsPage/_useProductsList.ts`, both outside Phase 7's original file list — named here explicitly per the reviewer's instruction; the change is a mechanical move with no behavior change, verified by the full test suite still passing (32/32).
3. **Extracted form logic into colocated hooks**, following the `LoginPage/_useLoginForm.ts` precedent: `ProductFormSheet/_useProductForm.ts` and `VariantFormSheet/_useVariantForm.ts` now own the `useState` fields, the open-triggered reset, and the zod validation + mutation call; the `.tsx` files are JSX plus wiring to the hook's return value. Each component crossed the `_types.ts` threshold once the hook's props/result interfaces existed alongside the component's own props (≥2 type declarations in the folder), so `_types.ts` was added to both `ProductFormSheet/` and `VariantFormSheet/` holding all three interfaces each (component props, hook props, hook result) — per the "all component-local types live there" rule once the file exists.

### Amended verification item

Per `## Дополнения → Фаза 7 — добавлено 2026-09-19`, the "Проверка" item now reads: "лист корректно открывается поверх другого листа и закрывается тапом по фону, кнопкой и `Escape`" (swipe-down removed, tracked instead in `BACKLOG.md`). No new code was required for this: Mantine `Drawer`'s defaults already provide `closeOnClickOutside`, `withCloseButton`, and `closeOnEscape`, and each `Drawer` instance is its own portal/overlay so Mantine handles z-index stacking between them without extra code. `BACKLOG.md` already carried the swipe-gesture follow-up item from iteration 1's review; left as-is.

### UIKit wrappers

- `SBottomSheetDrawer` (`src/components/BottomSheetDrawer/_styles.ts`): `styled(Drawer)` — Mantine gives the bottom `Drawer` a fixed height from its size scale (`--drawer-size-md`); sheet content in this app varies in length, so height needs to be auto with a `max-height` cap. Not expressible through `Drawer` props, hence `&&` in a styled wrapper. (Unchanged from iteration 1.)

## Files created

- `src/components/ProductPicker/{_ProductPicker.tsx,_helpers.ts,_styles.ts,index.ts}`
- `src/components/ProductFormSheet/{_ProductFormSheet.tsx,_types.ts,_useProductForm.ts,_styles.ts,index.ts}` (`_types.ts`, `_useProductForm.ts` new in iteration 2)
- `src/components/VariantFormSheet/{_VariantFormSheet.tsx,_types.ts,_useVariantForm.ts,_styles.ts,index.ts}` (`_types.ts`, `_useVariantForm.ts` new in iteration 2)
- `src/components/BottomSheetDrawer/{_styles.ts,index.ts}`
- `src/utils/helpers/products.ts` (new in iteration 2 — `normalizeSearch`/`filterProducts` lifted here)

## Files modified

- `src/api/services/products.service.ts` — added `addProductVariant` (single-table insert into `product_variants`); `createProductWithVariant` and the RPC untouched.
- `src/api/mutations/products.mutations.ts` — added `useAddProductVariantMutation`.
- `public/dictionaries/ru.json` + `src/types/i18n.types.ts` — added `products.picker`, `products.createSheet`, `products.addVariantSheet` branches.
- `plans/recipe-book-v1/EXECUTION.md` — Phase 7 entry updated for iteration 2 (amended verification row, fixes, file list, decisions log).
- `plans/recipe-book-v1/baseline/README.md` — baseline record (from iteration 1, reused).
- `src/pages/ProductsPage/_helpers.ts` (iteration 2, outside original file list) — `normalizeSearch`/`filterProducts` removed, moved to `src/utils/helpers/products.ts`; `IProductGroup`/`groupProducts` stay.
- `src/pages/ProductsPage/_useProductsList.ts` (iteration 2, outside original file list) — import of `filterProducts` now from `@/utils/helpers/products`.

## Figma extraction

N/A — `design.source: none` in the project profile; every surface here is `Free choice`.

- **Free choice judgment notes (unchanged from iteration 1):** category select is a plain styled `<select>` (Mantine `Select` is not on the project's "heavy component" allow-list in `decisions.md §2`, and a short static list doesn't justify a new primitive). Macro fields use Mantine `NumberInput` (explicitly on that list). Text inputs and submit/cancel buttons follow the exact styled pattern already established in `LoginPage`/`ArchiveConfirm`.

## Verification results

Commands run (all as named in the project profile, no substitutions):

- `pnpm lint` — passed, exit 0, no errors/warnings (2 import-order errors surfaced mid-fix from the new `_ProductFormSheet.tsx`/`_VariantFormSheet.tsx` import lists, fixed with `eslint --fix`, both files re-verified clean).
- `pnpm build` (`vite build && tsc -b`) — passed, exit 0. Same pre-existing >500kB chunk warning as baseline (unrelated to this phase).
- `pnpm test` (vitest) — passed, 2 files / 32 tests green (unchanged from iteration 1; phase adds no test files).
- `npx prettier --write` on every changed/created file — clean after the eslint import-sort fix; no other formatting diffs.
- Exports — every new export has an importer outside its module **except** the two named exceptions already established in iteration 1 (same kind as Phase 2's `supabase.ts`, Phase 3.5's `Typography`): `ProductPicker` and `VariantFormSheet` have no consumer yet (their consumer is Phase 8's `RecipeEditorPage`/`IngredientRow`; building this reusable node *is* Phase 7's goal). All iteration-2 exports (`_types.ts` interfaces, `useProductForm`, `useVariantForm`, `normalizeSearch`/`filterProducts`) have real importers verified by grep, listed above.

Phase's own "Проверка" checklist (amended per plan):

| Item | Result |
|---|---|
| Search is instant, no network calls | ✅ verified by code: `ProductPicker` filters `useProducts()`, an already-cached array; typing triggers no fetch |
| Creating a product from the picker returns it selected, without unmounting the parent screen | ✅ verified by code: `ProductFormSheet.onCreated` synchronously updates the picker's selection/search text without waiting for cache refetch; the picker stays mounted throughout. Not exercised against a live backend — see below |
| The macro fields can be left empty and the product still gets created | ✅ verified by code: empty fields become `null` before `productVariantInputSchema.safeParse`, which accepts `null` for all four macros; the DB columns are nullable |
| The sheet opens correctly over another sheet and closes by overlay tap, close button and Escape (amended 2026-09-19) | ✅ verified by code/construction: each `Drawer` is its own Mantine-managed portal/overlay (stacking is automatic, nothing custom needed); `closeOnClickOutside`, `withCloseButton`, `closeOnEscape` are Mantine `Drawer` defaults, none overridden. Not exercised live in a browser — see below |

**Why no live/browser run:** `.env` points at the single real cloud Supabase project (no local instance) — exercising the create-product / add-variant flows for real would write test data into the family's actual database. The project profile also sets `visual_verification.enabled: false`. Runtime/browser verification was therefore not performed by the developer, consistent with iteration 1.

**Phase stop condition:** satisfied — the amended checklist is fully green, all three iteration-1 code findings from the review are fixed.

**Visual Verification:** N/A (`visual_verification.enabled: false` in the project profile).

## Known issues / follow-ups

- **Swipe-down-to-close remains out of scope**, now formally moved to `BACKLOG.md` ("Закрытие листов свайпом вниз") by the plan amendment rather than flagged as a phase defect. No action needed in this phase.
- **`ArchiveConfirm` (Phase 6) still not migrated onto the shared `SBottomSheetDrawer`.** Outside Phase 7's file list in both iterations; unchanged decision from iteration 1.
- Pre-existing, not touched by this phase (carried over from Phases 2/3.5/4/6): `@tanstack/query-persist-client-core` still a stray direct dependency; the >500kB build chunk warning.
- `STATUS.md` intentionally not updated — per project convention that's the owner's step after review, not the developer's.
