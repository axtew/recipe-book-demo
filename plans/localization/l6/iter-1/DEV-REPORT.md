Status: COMPLETED

# L6 — Comments in English: components and pages (iteration 1)

## Phase goal

Comments, JSDoc, developer-facing messages and test names in `src/components` and `src/pages` are English (steps 1–5 of L5).

## What was implemented

- All 116 files of the scope translated: 408 changed lines (comments, JSDoc, `throw new Error` messages, test names, test data that does not check Russian text). Comments keep their length and intent; none added, none deleted.
- Terminology follows `public/dictionaries/en.json`, `docs/architecture.md` and the L5 text: КБЖУ -> "nutrition", "доели" -> "finished", журнал -> "cook log"/"log", справочник -> "directory", UI names in quotes use typographic “…” as in L5.
- `throw new Error` messages (5): "The variant failed validation", "The product or variant failed validation", "Sign-in failed", "The cook log entry failed validation", `` `Ingredient ${ingredient.id} is not resolved: no product or variant` ``. No `console.*` with Cyrillic existed.
- Test names translated in `LogPage`, `RecipesPage`, `RecipeEditorPage`, `VideoBlock` helper tests. Test data:
  - translated: category names in the RecipesPage test, "Борщ/Нарезать/Варить" in the RecipeEditorPage test (-> Borscht/Chop/Boil), "не ссылка" in the VideoBlock test (-> "not a link"); none of them was asserted as Russian text;
  - kept: "Рис", "Мёд", "Блины Ёлочкой" and the expected `["блины елочкой", "мед", "рис"]` in `RecipesPage/_helpers.test.ts` — the test checks Russian normalization (ё -> е, lower case).
- Typography fix after the first pass: straight quotes inside the translated comments were converted to “…” (script `quotes.cjs`), code spans in backticks untouched.
- Working tree check: `git status` shows only the 116 scope files modified (plus the already staged orchestrator files and the new `plans/localization/l6/`). No quote fixes outside `src/` were required by the amendment (see grep below).

## Files created

- `plans/localization/l6/iter-1/DEV-REPORT.md` (this file)
- `plans/localization/l6/iter-1/apply.cjs`, `quotes.cjs`, `p1.txt`–`p6.txt` — the line-keyed patch tooling and patch inputs used for the translation (working artifacts, safe to delete)

## Files modified

116 files in `src/components` (22) and `src/pages` (94); the list is `git diff --name-only`. Folders: components (BackLink, BottomSheetDrawer, Button, NutrientsRow, ProductFormSheet, ProductPicker, Select, SheetForm, TabBar, TextArea, TextInput, Typography, VariantFormSheet); pages (LoginPage, LogPage, ProductPage, ProductsPage, RecipeEditorPage, RecipePage, RecipesPage, SettingsPage). No folder was skipped.

## Verification

1. Scope command `rg -l "[А-Яа-яЁё]" src/components src/pages` — now 1 file, 3 hits, all intentional test data checking Russian text (`src/pages/RecipesPage/_helpers.test.ts`):
   - line 143 `createProduct("rice", "Рис", 200)`, `createProduct("honey", "Мёд", null)`;
   - line 194 `name: "Блины Ёлочкой"`;
   - line 201 `toEqual(["блины елочкой", "мед", "рис"])` — the test "search texts are normalized" checks Russian normalization.
2. Old-text grep outside `src/` (excluding `plans/**`, `node_modules`) for the five changed messages, fragments: `не прошёл валидацию`, `не прошли валидацию`, `не прошла валидацию`, `Не удалось войти`, `не разрешён: нет продукта` — 0 matches (rg exit 1); also 0 matches inside `src/` (no test asserted the old texts). Nothing to update.
3. AST check (`plans/localization/l5/iter-1/astcheck.cjs`, run on the L6 working tree): `files checked: 116, AST differences: 0, changed string literals: 46`, `changed strings without Cyrillic in HEAD: 0` (every changed literal was Cyrillic at HEAD). The 46 literals are the 5 error messages, the test names and the translated test data. Note: the script ignores JSX text nodes; none were touched (all Cyrillic hits in the scope were comments, string literals/template literals or test data).
4. `pnpm exec prettier --write` per changed file, then `--check` over all of them: "All matched files use Prettier code style!".
5. `pnpm lint` — exit 0, no output. `pnpm build` — exit 0. `pnpm test` — 16 files, 129 tests passed (baseline 129).
6. Runtime/browser: not performed (no code change).

## Findings and notes (not fixed — out of scope)

- No hard-coded Russian user-visible string was found in JSX: every Cyrillic hit in the scope was a comment, an error/test string or test data.
- Comments that reference project documents (against the "no plan/spec references" rule of `code-style.md`); translated literally per the phase rule, left for the owner to decide:
  - `src/pages/RecipePage/_RecipePage.tsx:33` — "in the screen order from the spec" (was «из ТЗ»);
  - `src/pages/RecipeEditorPage/_internal/RecipeForm/_RecipeForm.tsx:22` — "in the screen order from the plan" (was «из плана»);
  - `src/pages/ProductPage/_internal/UsedInRecipes/_UsedInRecipes.tsx:14` — says the recipe card route "does not exist yet" (stale narration; the recipe card route exists now) — translated as is.
- Some translated comment lines are longer than 100 characters (single-line rewrites to keep a 1:1 line mapping); Prettier does not reflow comments.
