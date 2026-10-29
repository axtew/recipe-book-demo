Status: COMPLETED

# Phase L7, iteration 2 (plan amendment 2026-10-29)

## Phase goal
Translate the three remaining Russian developer-facing `raise` messages, re-verify the SQL files by strip-and-compare, and update the DEPLOY.md references.

## What was implemented
- `supabase/demo/setup.sql`: `raise exception` -> `'setup.sql: no user % in this project - this is not the demo project (or step 1 of DEPLOY.md was skipped). Nothing was changed.'`; `raise warning` -> `'demo.reset: demo user not found (deleted?), account not restored. Create it again and re-run setup.sql'`. `%` placeholder, level and prefixes kept.
- `supabase/dev-data-cleanup.sql:35`: `'Test products are used in % ingredients of real recipes. Replace them manually before cleanup.'` (`used` argument unchanged).
- `supabase/demo/DEPLOY.md` (prose stays Russian, L8): lines 61, 204, 205 now quote «this is not the demo project»; line 209 now says «demo user not found» in guillemets. Line endings preserved.

## Files created
- `plans/localization/l7/iter-2/DEV-REPORT.md`

## Files modified (cumulative with iteration 1 stays in the working tree; this run touched)
- `supabase/demo/setup.sql`, `supabase/dev-data-cleanup.sql`, `supabase/demo/DEPLOY.md`

## Strip-and-compare (HEAD vs working copy; `--` comments and whitespace removed)
Script: `C:\Users\stevv\AppData\Local\Temp\claude\C--Users-stevv-Desktop-recipe-book\22da6010-b9c5-491e-884c-1c4f77e14019\scratchpad\cmp.py`
```
IDENTICAL supabase/demo/load-seed.sql
DIFF supabase/demo/setup.sql literals 2 rest-equal True
  - 'setup.sql: <ru> ...'  + 'setup.sql: no user % in this project - this is not the demo project (or step 1 of DEPLOY.md was skipped). Nothing was changed.'
  - 'demo.reset: <ru> ...' + 'demo.reset: demo user not found (deleted?), account not restored. Create it again and re-run setup.sql'
DIFF supabase/dev-data-cleanup.sql literals 1 rest-equal True
  - '<ru>' + 'Test products are used in % ingredients of real recipes. Replace them manually before cleanup.'
IDENTICAL supabase/dev-data.sql
IDENTICAL supabase/migrations/20260817123026_reference_data.sql
IDENTICAL supabase/migrations/20260817172518_policies_dish_categories_cleanup.sql
IDENTICAL supabase/migrations/20260817175656_pinned_variant_integrity.sql
IDENTICAL supabase/migrations/20260829045430_revoke_anon_privileges.sql
IDENTICAL supabase/migrations/20261003152020_save_recipe.sql
IDENTICAL supabase/migrations/20261018040024_recipe_photos_select_policy.sql
IDENTICAL supabase/migrations/20261021090000_backup_export_import.sql
IDENTICAL supabase/migrations/20261021120000_reorder_categories.sql
```
(Russian literals shown as `<ru>` here; the console mangled the encoding. After masking the differing literals, the rest of both files is equal.) Note: the working tree has 12 modified `.sql` files (the diff-name listing), not 13; none is missing from the list above.

## Grep for other quotes of the old texts (outside `plans/**`)
Searched `демо-проект|демо-пользователь не найден|setup\.sql:|demo\.reset` and `Тестовые продукты используются|Замените их вручную`. Quotes of the old messages: only `supabase/demo/DEPLOY.md` 61, 204, 205, 209 (updated). `dev-data-cleanup` text: no other quotes. Other hits were prose about the demo project (`.env.demo`, `wrangler.demo.jsonc` comments, README.md, DEPLOY.md) and code references to `demo.reset()`, not message quotes. `.env.demo` and `wrangler.demo.jsonc` have Russian comments; they are outside the L7 scope list and I left them.

## Remaining Cyrillic in `supabase scripts eslint.config.js vite.config.ts`
Only data and L8/L9 material:
- data: `dev-data.sql` (28), `migrations/20260817123026_reference_data.sql` (25, category names), `demo/load-seed.sql` (675), `demo/seed.json` (675), `demo/_build.ts:21` (category names), `demo/__tests__/seed.test.ts:167,233` (expected seed names)
- demo content, L9: `demo/source/{products,recipes,cookLogs}.ts` (data plus 3 header comment blocks in Russian in each of the three files: cookLogs.ts:3-4, products.ts:3-5, recipes.ts:3-5), `demo/photos/CREDITS.md`
- prose, L8: `demo/DEPLOY.md`, `demo/README.md`
Follow-up: the header comments in `demo/source/{products,recipes,cookLogs}.ts` are comments, not data; iteration 1 deferred the files to L9. The orchestrator may want to decide whether to translate them now.

## Verification
- `pnpm lint`: passed (exit 0)
- `pnpm build`: passed (exit 0)
- `pnpm test`: 16 files, 129 tests passed
- No remote command run; migrations unchanged, no `db:reset`. Prettier not run (only strings and Markdown prose changed).
- Runtime/browser: not performed.
