Status: COMPLETED

## Phase goal

Build the reusable product-selection node that the recipe editor (Phase 8) will sit on: a search-over-in-memory-dataset picker with inline product creation, plus a way to add a further variant to an existing product — no network round-trip for search, and creation must not leave the editor screen.

## What was implemented

- `ProductPicker` — Mantine `Combobox` filtering the already-loaded `useProducts()` dataset (no fetch on keystroke), `ё`/`е` search normalization, and a "Создать «{query}»" option shown when nothing matches. Selecting it opens `ProductFormSheet`; on success the picker adopts the new product as selected without waiting for the query-cache refetch (the sheet hands back `{ id, name }` directly).
- `ProductFormSheet` — bottom sheet creating a product with its first variant in one call to the owner's existing `useCreateProductWithVariantMutation` (unchanged). Fields: name, category (native `<select>`), four optional macros (Mantine `NumberInput`). Validated through the existing `productInputSchema` / `productVariantInputSchema` before the mutation call — first real consumers of both schemas in the codebase.
- `VariantFormSheet` — bottom sheet adding a further variant to an *existing* product. New single-table mutation `addProductVariant` (insert into `product_variants` only), following the `archiveProduct` pattern, as the phase explicitly allows.
- `src/components/BottomSheetDrawer` — a new shared `SBottomSheetDrawer` (`styled(Drawer)`, auto-height / `max-height: 90dvh` override). Extracted because the identical override was about to exist a third time (it already lived locally in Phase 6's `ArchiveConfirm`); see Known issues for why `ArchiveConfirm` itself was left untouched.

### UIKit wrappers

- `SBottomSheetDrawer` (`src/components/BottomSheetDrawer/_styles.ts`): `styled(Drawer)` — Mantine gives the bottom `Drawer` a fixed height from its size scale (`--drawer-size-md`); sheet content in this app varies in length, so height needs to be auto with a `max-height` cap. Not expressible through `Drawer` props, hence `&&` in a styled wrapper.

## Files created

- `src/components/ProductPicker/{_ProductPicker.tsx,_helpers.ts,_styles.ts,index.ts}`
- `src/components/ProductFormSheet/{_ProductFormSheet.tsx,_styles.ts,index.ts}`
- `src/components/VariantFormSheet/{_VariantFormSheet.tsx,_styles.ts,index.ts}`
- `src/components/BottomSheetDrawer/{_styles.ts,index.ts}`

## Files modified

- `src/api/services/products.service.ts` — added `addProductVariant` (single-table insert into `product_variants`); `createProductWithVariant` and the RPC untouched.
- `src/api/mutations/products.mutations.ts` — added `useAddProductVariantMutation`.
- `public/dictionaries/ru.json` + `src/types/i18n.types.ts` — added `products.picker`, `products.createSheet`, `products.addVariantSheet` branches.
- `plans/recipe-book-v1/EXECUTION.md` — Phase 7 entry appended.
- `plans/recipe-book-v1/baseline/README.md` — refreshed baseline record for this run.

## Figma extraction

N/A — `design.source: none` in the project profile; every surface here is `Free choice`.

- **Free choice judgment notes:** category select is a plain styled `<select>` (Mantine `Select` is not on the project's "heavy component" allow-list in `decisions.md §2`, and a short static list doesn't justify a new primitive). Macro fields use Mantine `NumberInput` (explicitly on that list). Text inputs and submit/cancel buttons follow the exact styled pattern already established in `LoginPage`/`ArchiveConfirm` (plain `<input>`, `SField`/`SInput`/`SSubmit`/`SCancel`).

## Verification results

Commands run (all as named in the project profile, no substitutions):

- `pnpm lint` — passed, exit 0, no errors/warnings.
- `pnpm build` (`vite build && tsc -b`) — passed, exit 0. Same pre-existing >500kB chunk warning as baseline (unrelated to this phase).
- `pnpm test` (vitest) — passed, 2 files / 32 tests green (phase adds no test files, matching its file list).
- `npx prettier --write` on every changed file — all reported "unchanged" (already formatted).
- Exports — every new export has an importer outside its module **except** two named exceptions of the same kind already established in this project (Phase 2's `supabase.ts`, Phase 3.5's `Typography`): `ProductPicker` and `VariantFormSheet` have no consumer yet — their consumer is `RecipeEditorPage`/`IngredientRow` in Phase 8, and building this reusable node *is* Phase 7's stated goal, not wiring it up elsewhere. `ProductFormSheet` does have a real in-phase consumer (`ProductPicker`) and needs no exception.

Phase's own "Проверка" checklist:

| Item | Result |
|---|---|
| Search is instant, no network calls | ✅ verified by code: `ProductPicker` filters `useProducts()`, an already-cached array; typing triggers no fetch |
| Creating a product from the picker returns it selected, without unmounting the parent screen | ✅ verified by code: `ProductFormSheet.onCreated` synchronously updates the picker's selection/search text without waiting for cache refetch; the picker stays mounted throughout (the sheet is an overlay, not a conditional render of the picker itself). Not exercised against a live backend — see below |
| The macro fields can be left empty and the product still gets created | ✅ verified by code: empty fields become `null` before `productVariantInputSchema.safeParse`, which accepts `null` for all four macros; the DB columns are nullable |
| The sheet opens correctly over another sheet and closes on swipe-down | ⚠️ partial — see Known issues: swipe-to-close is not implemented (Mantine's `Drawer` has no built-in swipe gesture in the installed version); closing works via overlay tap / close button / Escape. Stacking over another sheet is correct by construction (each `Drawer` is its own Mantine-managed portal/overlay) but not exercised live |

**Why no live/browser run:** `.env` points at the single real cloud Supabase project (no local instance) — exercising the create-product / add-variant flows for real would write test data into the family's actual database. The project profile also sets `visual_verification.enabled: false` ("phases write `Visual Verification: N/A`"). Runtime/browser verification was therefore not performed by the developer; this is consistent with, not a shortcut around, the profile.

**Phase stop condition:** satisfied except for the swipe-to-close sub-item, flagged explicitly rather than claimed.

**Visual Verification:** N/A (`visual_verification.enabled: false` in the project profile).

## Known issues / follow-ups

- **Swipe-down-to-close is not implemented and can't be with the current primitive alone.** `@mantine/core`/`@mantine/hooks` 9.5.x ship no swipe gesture for `Drawer` (confirmed by grepping both packages' source for "swipe" — no hits). Adding it would mean a new touch-gesture hook (`touchstart`/`touchmove`/`touchend`, a dismissal threshold) applied to `SBottomSheetDrawer` — and, for consistency, to Phase 6's `ArchiveConfirm` too, since it uses the same drawer pattern. That is new scope beyond this phase's file list and 7-operation/`ui`-only budget. Recommend a dedicated follow-up (project-wide, not per-sheet) rather than a one-off patch here.
- **`ArchiveConfirm` (Phase 6) was not migrated onto the new shared `SBottomSheetDrawer`.** It has the identical `styled(Drawer)` height override duplicated locally. Leaving it as-is is a deliberate scope decision — `ProductPage/_internal/ArchiveConfirm` is outside Phase 7's file list — but it is now the third copy of the same override had it not been extracted, and the shared component is one grep away from consuming.
- **`normalizeQuery` in `ProductPicker/_helpers.ts` duplicates the equivalent (unexported) function in `ProductsPage/_helpers.ts`.** The plan explicitly assigns the consolidated `src/utils/search.ts` to Phase 10 ("Список рецептов, поиск и фильтры"); creating it here would mean touching a later phase's named file early. Left duplicated on purpose, with an in-code comment pointing at Phase 10.
- Pre-existing, not touched by this phase (carried over from Phases 2/3.5/4/6): `@tanstack/query-persist-client-core` still a stray direct dependency; the >500kB build chunk warning.
- `STATUS.md` intentionally not updated — per project convention that's the owner's step after review, not the developer's.
