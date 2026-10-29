MODE: review
STATUS: APPROVED
Issue source: none

## Summary
Iteration 2 of phase L5 reviewed against the amendment "Phase L5, L6 — added 2026-10-29". All amendment items are done, nothing else changed since iteration 1, and the iteration-1 plan finding is closed. Everything approved in iteration 1 carries forward.

Independent verification: `pnpm lint` clean; `pnpm build` green; `pnpm test` 16 files / 129 tests passed; `node plans/localization/l5/iter-1/astcheck.cjs` gives files 61, AST differences 0, changed string literals 135, changed strings without Cyrillic in HEAD 0; the scope grep for Cyrillic in `src/` outside `pages/` and `components/` returns only `src/utils/search.ts` and `src/utils/__tests__/search.test.ts`, which are correct hits (search normalizer examples and data).

## Amendment items
- Old-text grep completeness: I listed every removed line in `git diff -U0 -- src` that holds an `Error(...)`, `console.*` or a test assertion on message text, and checked each against the developer's fragment list. All "Произошла ошибка при ..." messages (backup, categories, cookLogs, products, recipes services) are covered by one fragment. "Выгрузка бэкапа вернула", "Не удалось распарсить snapshot", "servingsBase должен быть", "Не удалось получить сессию Supabase", "Корневой элемент #root" and "Переменная окружения" are listed. Two messages are not in the report's fragment list: "Ингредиент ... ссылается на продукт/вариант ... которого нет в переданном наборе" (`_resolve.ts`). I grepped them myself over the repo outside `plans/**`, `node_modules`, `dist`, `.git`: 0 hits. A combined grep of all fragments finds only unrelated text (`BACKLOG.md:153` prose about the ingredient reference, `public/dictionaries/ru.json:118` UI validation text), so no stale quote remains. The report's list is slightly incomplete, but the result is complete.
- `DEPLOY.md`: the diff is a single line (114), only the quoted console text changed. The new quote `Error: Environment variable VITE_SUPABASE_URL is not set` matches `src/utils/env.ts:18` (`Environment variable ${key} is not set`) character for character; the surrounding Russian prose is unchanged.
- Wording fixes: `cookLogs.service.ts` now "An error occurred while recording a cook."; `recipes.types.ts` now "as it is stored in localStorage". Both fine.
- `src/utils/__tests__/recipes.test.ts`: `"плов"` -> `"pilaf"` in both the input and the expectation; no other assertion depended on it; test passes.
- Nothing else changed: `git status` shows the same unstaged set (`DEPLOY.md` plus `src/**`), 60 files under `src/` (439+/435-; the +2/-2 versus iteration 1 is the `recipes.test.ts` edit and the two wording lines, with astcheck re-run at 0 AST differences).

## Notes (non-blocking)
- The `supabase/demo/DEPLOY.md:231,239` `DEMO_DB_URL не задана` is shell-script text, not from `src/`; leaving it is correct.
- The cosmetic nits from iteration 1 (`_schema.ts:9-16` uneven reflow, `_types.ts` separator widths) are unchanged and still cosmetic only.
- `src/components/**` and `src/pages/**` still throw Russian messages; they belong to L6, and the new step in the amendment covers quotes of those messages there.
