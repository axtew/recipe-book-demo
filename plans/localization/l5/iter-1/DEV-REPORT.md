Status: COMPLETED

# DEV-REPORT — phase L5, iteration 1

## Phase goal
Comments, JSDoc, developer-facing messages and test names in English in the non-UI layers of `src/`.

## What was implemented
- 60 files translated (all 60 files the scope command listed). 437 insertions / 433 deletions, nothing committed.
- Comments and JSDoc: translated line by line, same length and intent, none added or removed. Domain terms follow `en.json`: nutrition (kcal, protein, fat, carbs), product variant, cook log, archived, "finished" (for «доели»), "No category".
- `throw new Error(...)` and `console.*` messages in English: `src/api/services/*` (categories, products, recipes, cookLogs, backup), `src/domain/nutrition/_resolve.ts`, `_calculate.ts`, `src/utils/env.ts`, `src/hooks/useAuth.hook.ts`, `src/main.tsx`. The tests that assert these messages (`calculate.test.ts`, `env.test.ts`) were updated to match byte for byte.
- `backup_target_not_empty` and the other DB codes were untouched (no Cyrillic, never in the diff).
- Test names (`describe` / `it` / `it.each`) in English in all test files.
- Fixture data: in `calculate.test.ts`, `backup.test.ts`, and the `src/domain/schemas` recipes test, the Russian product, category and step names became English (Flour, Oil, Salt, Sugar, Wholegrain, Olive, Dairy, Breakfasts, Milk, Porridge, Boil, `{truncated`). Those tests don't check Russian text, and no assertion compares any of this data with the database. Only the nutrition tests assert any of these names, and they use the same new values.
- The `── Входные контракты ──` and `── Результаты ──` separators in `nutrition/_types.ts` became `Input contracts` / `Results`; the dash runs are 2 chars shorter.
- `pnpm exec prettier --write` ran on 3 files (`categories`, `products`, `recipes` services): with shorter English messages Prettier collapsed a few multi-line `throw new Error(..., { cause })` calls onto one line. This is whitespace only; the AST check confirms it.

## Files created
- `plans/localization/l5/iter-1/DEV-REPORT.md` — this report.
- `plans/localization/l5/iter-1/astcheck.cjs` — the AST comparison script (the paths are hard-coded; it ran from the scratchpad copy).

## Files modified (60, all under `src/`)
- `src/api`: `mutations/backup.mutations.ts`, `mutations/recipes.mutations.ts`, `services/backup.service.ts`, `categories.service.ts`, `cookLogs.service.ts`, `products.service.ts`, `recipes.service.ts`.
- `src/app/_queryClient.ts`, `src/constants/caching.constants.ts`, `src/constants/recipes.constants.ts`.
- `src/domain`: `backup/` (`_constants`, `_parse`, `_schema`, `_types`, `__tests__/backup.test.ts`), `nutrition/` (`_calculate`, `_resolve`, `_snapshot`, `_types`, `__tests__/calculate.test.ts`), `schemas/` (`_common`, `_cookLogs`, `_products`, `_recipes`, `__tests__/recipes.test.ts`), `stats/` (`_cookStats`, `__tests__/cookStats.test.ts`).
- `src/hooks`: `useAppData.hook.ts`, `useAuth.hook.ts`, `useLatest.hook.ts`, `useRecipeDraft.hook.ts`, `useForm/` (`_helpers`, `_types`, `_useForm.hook`).
- `src/routes`: `AppRouter.tsx`, `_paths.ts`, `_routes.tsx`, `layouts/AppLayout/` (`_AppLayout.tsx`, `_styles.ts`, `_internal/DemoBanner/_DemoBanner.tsx`).
- `src/theme`: `_GlobalStyle.ts`, `_breakpoints.ts`, `_mantineTheme.ts`, `_palette.ts`.
- `src/types`: `backup`, `categories`, `common`, `cookLogs`, `recipes` (`*.types.ts`).
- `src/utils`: `env.ts`, `image.ts`, `search.ts`, `helpers/{objectGetters,products,recipes}.ts`, `__tests__/{env,recipes,search}.test.ts`.
- `src/main.tsx`, `src/vite-env.d.ts`.

The working tree holds nothing outside `src/` except `plans/localization/l5/`; `git status` shows only these 60 modified files plus the new `plans/localization/l5/` folder. I used per-file `prettier`, not `pnpm format` or `pnpm prettier`.

## Verification
Stripped-diff check (method). `plans/localization/l5/iter-1/astcheck.cjs` runs over `git diff --name-only`. For each file it parses the HEAD version (`git show HEAD:<file>`) and the working-tree version with the TypeScript compiler API. It then compares the sequence of AST node kinds, identifier names and numeric literals. Comments are not nodes, and the contents of string and template literals are replaced by a placeholder, so the comparison ignores comments, string contents and formatting. It also lists the string literals whose text differs.

```
files checked: 60, AST differences: 0, changed string literals: 132
changed strings without Cyrillic in HEAD: 0
```

- No file has an AST difference; the diff is comments and string literals only.
- Each of the 132 changed string literals contained Cyrillic in HEAD, so no string that is not Russian was touched.
- Commands:
  - `pnpm lint`: passed (no output beyond the eslint header).
  - `pnpm build`: exit 0.
  - `pnpm test`: 16 files, 129 tests passed (baseline 129).
  - Prettier check on the 60 changed files: clean after the 3-file `--write`.

Scope command re-run. `rg -l "[А-Яа-яЁё]" src/api src/app src/constants src/context src/domain src/hooks src/routes src/theme src/types src/utils src/main.tsx src/vite-env.d.ts` now lists 3 files, down from 60. Every remaining hit is Russian text the code processes:
- `src/utils/search.ts` (4 lines) — the code `replaceAll("ё", "е")`; the comment examples «мед» / «мёд» / «курица рис», which show the Russian-text behaviour the function exists for.
- `src/utils/__tests__/search.test.ts` (9 lines) — Russian search data (`Мёд ГРЕЧКА`, `Плов`, `Курица, филе`, …) and the test names that name the letters `ё` / `е`. These tests check Russian text normalization and matching.
- `src/utils/__tests__/recipes.test.ts` (2 lines) — the search query `"плов"`; this test belongs to the search-query normalizer, so Russian query data stays.
- `src/types/database.types.ts` has no Cyrillic, so there is nothing to leave there.

Browser/runtime: not performed (no Visual Verification in this phase).

## Known issues / follow-ups
- None blocking. `src/context` also had no Cyrillic (L2/L3 finished it).
- No plan gaps found, and the plan's Known issues / Amendments entries do not mention L5.
