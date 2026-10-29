Status: COMPLETED

# L7 — English comments outside `src/`, iteration 1

## Phase goal
SQL, demo tooling and configs carry English comments; applied migrations change in comments only, proven mechanically.

## What was implemented
- Comments translated to English in 8 migrations (`reference_data`, `policies_dish_categories_cleanup`, `pinned_variant_integrity`, `revoke_anon_privileges`, `save_recipe`, `recipe_photos_select_policy`, `backup_export_import` incl. the 4 in-body lines, `reorder_categories`), `supabase/dev-data.sql`, `supabase/dev-data-cleanup.sql`, `supabase/demo/setup.sql`. Reference data rows (category names) and dev-data rows untouched. Line endings preserved (`reference_data.sql` is CRLF).
- `supabase/demo/{keepalive.ts,_build.ts,upload-photos.mjs,source/_types.ts}` and `eslint.config.js`: comments and thrown/printed messages translated. `seed.test.ts`: comments and the 12 test names translated; Russian expected data (`"Блины"`, `"Овсяное печенье"`, `"Аджика домашняя"`) kept because it checks the Russian seed (changes in L9).
- `_build.ts` writes a 2-line Russian header into `load-seed.sql`; translated and regenerated with `WRITE_DEMO_SEED=1 pnpm vitest run supabase/demo`.
- Quotes of changed messages / test name updated (the quoting file keeps its language): `supabase/demo/DEPLOY.md` (`Загружено 20 из 20.` -> `Uploaded 20 of 20.`; the keep-alive error quote -> `SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not set in wrangler.demo.jsonc`), `supabase/demo/README.md:25` (quoted test name -> `matches what the generator builds from the sources`). Both are L8 files; only the quoted text changed.

## Files created
- none in the repo (throwaway scripts live in the scratchpad, `.../scratchpad/l7/{sql_comments.py,strip_compare.py,ts_edits.py}`).

## Files modified
- `supabase/migrations/20260817123026_reference_data.sql`, `20260817172518_policies_dish_categories_cleanup.sql`, `20260817175656_pinned_variant_integrity.sql`, `20260829045430_revoke_anon_privileges.sql`, `20261003152020_save_recipe.sql`, `20261018040024_recipe_photos_select_policy.sql`, `20261021090000_backup_export_import.sql`, `20261021120000_reorder_categories.sql` — comments only
- `supabase/dev-data.sql`, `supabase/dev-data-cleanup.sql`, `supabase/demo/setup.sql` — comments only
- `supabase/demo/keepalive.ts`, `supabase/demo/_build.ts`, `supabase/demo/upload-photos.mjs`, `supabase/demo/source/_types.ts`, `supabase/demo/__tests__/seed.test.ts`, `eslint.config.js`
- `supabase/demo/load-seed.sql` — regenerated, header 2 lines only
- `supabase/demo/DEPLOY.md`, `supabase/demo/README.md` — quote fixes (2 + 1 lines)

## Verification

### 1. Strip-and-compare (HEAD vs working copy; `--...` to EOL and all whitespace removed)
Run over every migration (not only the 8 changed), `setup.sql`, `dev-data.sql`, `dev-data-cleanup.sql`. `unchanged` = file equal to HEAD modulo EOL. Output of the final run (after the last edit):
```
IDENTICAL unchanged sha=aad1ab25209e/aad1ab25209e  supabase/migrations/20260817045108_init.sql
IDENTICAL changed   sha=8873ef5b0881/8873ef5b0881  supabase/migrations/20260817123026_reference_data.sql
IDENTICAL changed   sha=63372c7ec0d7/63372c7ec0d7  supabase/migrations/20260817172518_policies_dish_categories_cleanup.sql
IDENTICAL changed   sha=a3e3dd37cd1f/a3e3dd37cd1f  supabase/migrations/20260817175656_pinned_variant_integrity.sql
IDENTICAL changed   sha=265eb66fb209/265eb66fb209  supabase/migrations/20260829045430_revoke_anon_privileges.sql
IDENTICAL unchanged sha=74b2248fa611/74b2248fa611  supabase/migrations/20260919051102_create_product_with_variant.sql
IDENTICAL changed   sha=da03f241d260/da03f241d260  supabase/migrations/20261003152020_save_recipe.sql
IDENTICAL changed   sha=1fd2f334de5e/1fd2f334de5e  supabase/migrations/20261018040024_recipe_photos_select_policy.sql
IDENTICAL changed   sha=5aaef34e9d93/5aaef34e9d93  supabase/migrations/20261021090000_backup_export_import.sql
IDENTICAL changed   sha=12d4563306d2/12d4563306d2  supabase/migrations/20261021120000_reorder_categories.sql
IDENTICAL changed   sha=0ae5df988e1f/0ae5df988e1f  supabase/demo/setup.sql
IDENTICAL changed   sha=f114180ba78d/f114180ba78d  supabase/dev-data.sql
IDENTICAL changed   sha=03d3779e008f/03d3779e008f  supabase/dev-data-cleanup.sql
files: 13 different: 0
```
A `--` inside a string literal: none in any file, HEAD or working copy (the script looks for an odd number of single quotes before each `--`).

### 2. Generator output
`seed.json` and `photos.json` are byte-identical (`cmp`). `load-seed.sql`: `diff` before/after shows only lines 1-2 (the generated header comment), data untouched:
```
1,2c1,2
< -- Загрузка эталона в демо-проект. ...
< -- Порядок применения — `supabase/demo/DEPLOY.md`; пересборка — `README.md` рядом.
---
> -- Loading the seed into the demo project. The file is built by the generator from `seed.json` and is not edited by hand.
> -- Order of application — `supabase/demo/DEPLOY.md`; rebuild — `README.md` alongside.
```
`setup.sql`: comment-only (strip check above), not re-applied anywhere.

### 3. Cyrillic search `rg -n "[А-Яа-яЁё]" supabase scripts eslint.config.js vite.config.ts` — remaining hits by file
- `scripts/`, `vite.config.ts`, `eslint.config.js`: 0
- migrations other than `reference_data`: 0
- `supabase/migrations/20260817123026_reference_data.sql` (25): data rows (category / product names)
- `supabase/dev-data.sql` (28): data rows
- `supabase/dev-data-cleanup.sql` (1, line 35): `raise exception` message string — code, not a comment (Known issue 1)
- `supabase/demo/setup.sql` (2, lines 29, 132): `raise exception` / `raise warning` message strings (Known issue 1)
- `supabase/demo/_build.ts` (1, line 21): `DISH_CATEGORIES` data, must match the `reference_data` migration
- `supabase/demo/__tests__/seed.test.ts` (2, lines 167, 233): expected Russian seed data, changes in L9
- `supabase/demo/source/{products,recipes,cookLogs}.ts`, `seed.json`, `load-seed.sql` (data part), `photos/CREDITS.md`: demo data, L9
- `supabase/demo/README.md`, `supabase/demo/DEPLOY.md`: L8 docs
- `supabase/snippets/Untitled query 413.sql` (1): gitignored local Studio snippet, not in the repo

### 4. `pnpm db:reset`
Local stack only (`npx supabase status` -> API 127.0.0.1:54321; Docker Desktop had to be started first). All 10 migrations applied, `Finished supabase db reset on branch master.` Dev data restored per `docs/agents/local-environment.md`: `product_categories` was empty -> `dev-data.sql` loaded (COMMIT), dev user `dev@recipe-book.local` signed up. Check afterwards: 13 products, 17 variants, 1 recipe, 7 dish categories, 1 dev user. Note: the one-line comment fix in `save_recipe.sql` ("Array shapes:") was made after the reset; strip-compare above was re-run after it.

### 5. Commands
- `npx prettier --write` on `_build.ts`, `keepalive.ts`, `upload-photos.mjs` (per file; `--check` clean on all 6 changed TS/JS files)
- `pnpm lint` — passed, no output
- `pnpm build` — passed (PWA files generated)
- `pnpm test` — 16 files, 129 tests passed
- Exports: none added. Runtime/browser: not performed by the developer (no Visual Verification in the phase).

## Known issues / follow-ups
1. **SQL message strings stay Russian (two plan rules conflict).** `setup.sql:29`, `setup.sql:132` and `dev-data-cleanup.sql:35` hold Russian `raise` messages inside string literals. Translating them would break the strip-and-compare check (it keeps string literals), and `setup.sql` is already applied to the demo project, so they were left. `DEPLOY.md:61,204,205,209` quote these messages and remain correct. The owner decides whether to accept the exception or relax the check.
2. The `-- ... остальные` placeholder comments in `reference_data.sql` became `-- ... the rest`.
3. The `README.md` / `DEPLOY.md` quote fixes touch L8 files by one line each; L8 should keep the English test name / messages when it rewrites them.
4. In `backup_export_import.sql` the example of starter categories named in Russian became "the starter dish categories" so comments contain no Cyrillic.
