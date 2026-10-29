MODE: review
STATUS: NEEDS_CHANGES
Issue source: plan

## Summary
Phase L5 reviewed: 60 files under `src/`, 437+/433−, read in full as a diff (`git diff -U0 -- src`). The translation is faithful and consistent, the diff contains only comments, string literals, test names and Prettier whitespace, and lint, build and tests are green. One blocking item: a reference document describes a console message that this phase changed, and the plan does not cover updating it.

Independent verification: `pnpm lint` clean; `pnpm build` exit 0; `pnpm test` 16 files / 129 tests (baseline 129); `node plans/localization/l5/iter-1/astcheck.cjs` re-run: files 60, AST differences 0, changed string literals 132, changed strings without Cyrillic in HEAD 0. The scope command returns 3 files (`src/utils/search.ts`, `src/utils/__tests__/search.test.ts`, `src/utils/__tests__/recipes.test.ts`), as in the report.

## Issues

### Plan issues
#### Stale reference to a changed message
- [plan] `src/utils/env.ts:18` now throws `Environment variable ${key} is not set` (it was `Переменная окружения ${key} не задана`), but the root `DEPLOY.md:114` describes this as the symptom to search for: "в консоли `Error: Переменная окружения VITE_SUPABASE_URL не задана` — это `readEnvVar`". After L5 the text will not match what the owner sees in the console. L5's plan has no step "grep the repo for the old texts of the messages you change" and `DEPLOY.md` is a private Russian file by ADR 0033, so no later phase obviously owns it. Smallest amendment: add the sentence to the L5 (or L8) steps and update that one line in `DEPLOY.md` to the English message (the file stays Russian, only the quoted console text changes). A grep for the other changed messages (`Произошла ошибка`, `Корневой элемент`, `Не удалось получить сессию`, `Не удалось распарсить`) found no other references outside `plans/` and `docs/decisions/`. `supabase/demo/DEPLOY.md` has its own, unrelated `DEMO_DB_URL не задана` (shell text, not from `src/`).

## Notes (non-blocking)

Translation quality and the Comments convention
- Intent and the "why" are preserved in every hunk I read; nothing is softened, dropped or invented. Comment counts match one to one (no comments added or deleted). The FIXME/NOTE markers in `useForm` are kept. The terminology matches `en.json` and the other docs: nutrition, product variant, cook log, archived, "finished" (`en.json` `finishedLabel`), "No category". "КБЖУ" is "nutrition" in prose and "kcal and protein/fat/carbs" in the `INutrients` doc, which is correct.
- Faithful in the places where it is easy to slip: `_calculate.ts` rule description (optional ingredients, override recalculation, "no rounding"), `_resolve.ts` (dangling reference throws, because a silent zero is indistinguishable from a real one), `_snapshot.ts`, `recipes.service.ts` cache-busting comment, `_queryClient.ts` demo persister, `useRecipeDraft.hook.ts` finishDraft/unmount rationale.
- No pipeline residue was introduced; the pre-existing ADR reference in `src/theme/_breakpoints.ts` is unchanged. First lines state the purpose, like the originals.
- Wording nits, take or leave: `src/api/services/cookLogs.service.ts:45` "recording the cooking" is awkward (e.g. "recording a cook"); `src/types/recipes.types.ts:107` "as it lies in localStorage" reads better as "as it is stored in localStorage"; `src/domain/backup/_schema.ts:9-16` the reflow after translation left uneven line breaks (one line about 100 characters next to short ones) — cosmetic only.
- `src/domain/nutrition/_types.ts:9-50`: the section separators keep the same dash count after the shorter English titles, so they are about 2 characters shorter than before and differ in width from each other by the same amount as in HEAD. Cosmetic.

Test data (ADR 0033)
- Translated fixtures in `calculate.test.ts`, `backup.test.ts` and `schemas/__tests__/recipes.test.ts` are correct to translate: none checks Russian text, none is compared with the database, and all assertions on names (`productName`, `variantName`, `incompleteProducts`) were updated to the same new values. The `{оборванный` → `{truncated` change keeps the `notJson` test meaning. The assertions on error text (`calculate.test.ts` two `resolveIngredients` messages and the `servingsBase` message; `env.test.ts` two messages) match the new source strings byte for byte, and the tests pass.
- Strings compared with the database are untouched: `TARGET_NOT_EMPTY_MESSAGE` in `backup.service.ts` was not changed (only its doc comment), and the DB error codes are not in the diff.
- `src/utils/__tests__/recipes.test.ts:7-8` keeps the query `"плов"`, justified in the report by "belongs to the search-query normalizer". That is thin: `normalizeRecipesSearch` only passes `q` through (trim check, number to string) and has no Russian-specific behaviour, so unlike `search.test.ts` this test does not check Russian text, and by the developer's own rule for the other fixtures it could be `"pilaf"`. Keeping it is harmless and defensible (the field is a search query), but either translate it or word the justification honestly in the report; the other two files (`search.ts` comment examples, `search.test.ts` data) are correct hits.

Other
- No logic change: AST check confirmed by re-run, and the three Prettier-collapsed `throw new Error(..., { cause })` calls in `categories`, `products` and `recipes` services (`categories.service.ts:16-17, 39-40`, `products.service.ts:14-15`, `recipes.service.ts:19-20`) are whitespace only.
- `src/components/**`, `src/pages/**` still throw Russian messages (`_useVariantForm.ts:49`, `_useProductForm.ts:61`, `_useLoginForm.ts:40`, `_useCookLogForm.ts:62`, `_IngredientsBlock.tsx:46`); these belong to L6, not a finding here.
- Page-specific exports heuristic: nothing applicable (no exports changed).
