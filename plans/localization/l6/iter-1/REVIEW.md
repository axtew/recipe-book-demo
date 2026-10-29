MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Phase L6 (116 files in `src/components` and `src/pages`, 408 changed lines, working tree) is a faithful, behaviour-neutral translation of comments, JSDoc, five `Error` messages, test names and test data. I found no blocking issue. The three comment defects the developer flagged are pre-existing and fall outside "translate, add none, delete none", so they are Notes with a recommended follow-up.

## Checks performed

- Diff shape: `git diff -U0 -- src` = 408 insertions / 408 deletions over 116 files. Every removed line contains Cyrillic, no added line does. No file-wide line-ending change.
- No logic change: `plans/localization/l5/iter-1/astcheck.cjs` on the L6 set = files 116, AST differences 0, changed string literals 46, changed strings without Cyrillic at HEAD 0. The script ignores JSX text, so I compared `JsxText` nodes HEAD vs working tree for every changed `.tsx` with a separate script: 0 differences. JSX text was not touched.
- Residual Cyrillic: `rg "[А-Яа-яЁё]" src/components src/pages` = 3 hits, all in `src/pages/RecipesPage/_helpers.test.ts` (143, 194, 201). They are exactly the data of the test "search texts are normalized" (ё -> е, lower case), so Russian is required there (shared rule, L5 step 3).
- Test data translated: category names in `RecipesPage/_helpers.test.ts` (44-46), "Borscht / Chop / Boil" in `RecipeEditorPage/_helpers.test.ts` (11-15), "not a link" in `VideoBlock/_helpers.test.ts` (15). None is asserted as text: the group tests assert ids (`groups.map(({ id }) => id)`), grouping sorts by `sortOrder` (no `localeCompare` over names), the draft comparison sorts object keys, and `"not a link"` is still an unparsable URL. Nothing is compared with the database.
- Old-text grep: five messages changed. The developer's fragments (не прошёл/прошли/прошла валидацию, Не удалось войти, не разрешён: нет продукта) cover all five ("Вариант не прошёл валидацию", "Продукт или вариант не прошли валидацию", "Запись журнала не прошла валидацию", "Не удалось войти", "Ингредиент ... не разрешён: нет продукта или варианта"). I re-ran the grep over the whole repository including gitignored files (`rg --no-ignore`, excluding `plans/**`, `node_modules`, `.git`, `dist`): 0 matches. No console message was changed. No test or document quoted the old texts.
- Re-run: `pnpm lint` exit 0; `pnpm build` OK; `pnpm test` 16 files / 129 tests passed (equal to baseline).
- Terminology against `public/dictionaries/en.json` and the L5 text: “Reset”, “Done”, “Recalculate”, “Log a cook”, “Finished”, “Other date”, “Can be frozen”, “Freezable only”, “Back”, kcal / P (/ F / C), directory, cook log, cook, nutrition (КБЖУ), pinned/active variant, dataset, bottom sheet — all consistent. Typography matches L5 (curly “…” for UI names, straight `'` in possessives, as in committed L5 files).
- Faithfulness: I read all 408 pairs. Intent and the "why" are kept; nothing dropped, softened or invented. Test names use "returns true/false ..." for the boolean `areDraftsEqual` and "keeps/skips ..." for the others, which keeps the original meaning.

## Notes (non-blocking)

### Comments the developer flagged — judgement

All three predate L6 (they were in the Russian text at HEAD). L6's contract is "translate, do not add, do not delete" (L5 step 1), so fixing them here would silently widen the phase; translating them literally was correct. They are real violations of `docs/agents/conventions/code-style.md` (Comments section) and now sit in the English text, so they should get a cheap follow-up (one line each) rather than be forgotten.

1. `src/pages/RecipePage/_RecipePage.tsx:33` — "in the screen order from the spec" (was «из ТЗ»), and `src/pages/RecipeEditorPage/_internal/RecipeForm/_RecipeForm.tsx:22` — "in the screen order from the plan" (was «из плана»). A reference to a task document; code-style.md says a comment must not retell the task or the plan, and the document may be renamed or removed. Fix: drop the "from the spec/plan" clause (the order list stays). Note.
2. `src/pages/ProductPage/_internal/UsedInRecipes/_UsedInRecipes.tsx:14` — "the recipe card route does not exist yet, it appears together with the screen itself". The route exists (`src/routes/_paths.ts:6`, `recipeCard`) and other lists already link to it, so the stated reason is false now; the factual part ("names have no links") is still true of the code (line 28). This is a stale comment as defined by code-style.md ("states what the code does"). Not an L6 defect; decide separately whether the names should become links (product question, `BACKLOG.md`) or the comment should just say the names are plain text. Note.

Recommended routing: one small cleanup item for the owner (a plan amendment after L7, or a direct edit) covering these three comments; it is not an `Issue source` finding for L6.

### Cosmetics

- 23 added comment/test-name lines exceed `printWidth: 100` (e.g. `ProductFormSheet/_useProductForm.ts:9`, `SheetForm/_styles.ts:5`, `TabBar/_constants.ts:1`, `RecipeEditorPage/_internal/RecipeForm/_RecipeForm.tsx:33`, `RecipeEditorPage/_types.ts:12`). Prettier does not reflow comments or strings, lint has no max-len, so nothing fails; the Russian originals were at the same limit and English is longer. Optional tidy-up only.
- A few block comments have ragged wrapping after the line-by-line translation (e.g. `components/BackLink/_BackLink.tsx:15-16`, `RecipeEditorPage/_useRecipeNutrition.ts:22-24`, `RecipeEditorPage/_internal/NutritionBar/_NutritionBar.tsx:15-17`). Content is correct.
- `components/ProductPicker/_ProductPicker.tsx:26` and `_helpers.ts:1` — “Create “{query}”” renders as nested curly quotes with a doubled closing mark; en.json has `Create “{query}”`. Readable, but the outer quotes could be dropped.
- Wording nits, no meaning lost: `BackLink/_BackLink.tsx:15` "gets its address, search and filters back from where the user came" (reads roughly; "comes back with the address, search and filters it was left with"); `IngredientOptionsSheet` "Styled as a bottom sheet" (original «Оформлено» = presented as).
- DEV-REPORT lists `apply.cjs`, `quotes.cjs`, `p1.txt`–`p6.txt` under "Files created", but they are no longer in `plans/localization/l6/iter-1/` (already removed). No impact; the report line is just out of date.

### Page-specific exports without external consumers

Not applicable: the diff changes no exports.
