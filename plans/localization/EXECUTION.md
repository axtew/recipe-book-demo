# Execution log — localization

Plan: `plans/localization/plan.md`. Commit policy: owner — agents never commit; each phase is reviewed and committed by the owner (or by the session on the owner's go-ahead).

## Task setup

- **Date:** 2026-10-25
- **Task base:** `e0f1f35`
- **Diff base:** working-tree (index holds the plan files)
- **Public repo:** `axtew/recipe-book-demo` created by the owner (private) and pushed from `e0f1f35`. L4 adds `glob:*-ru.md` to the exclusion list → the next sync after L4 needs `-Force` once.

## L1, iteration 1

- **Date:** 2026-10-25
- **Status:** completed (not committed — awaiting review)
- **Files:** created `docs/decisions/0033-english-repository-language.md`, `docs/decisions/0034-bilingual-ui-by-browser-language.md`, `plans/localization/baseline/*`, `plans/localization/l1/iter-1/DEV-REPORT.md`; modified ADR 0001–0032 and `docs/decisions/README.md` (translated, statuses)
- **Checks:** Cyrillic search over `docs/decisions` = 0; 143 relative links, 0 broken; `pnpm lint` green; baseline lint/build/test green (112 tests)
- **Notes:** 0031 file status set to superseded (plan named the index only); `Supersedes:` line in 0033/0034; quoted section names of not-yet-translated docs listed for L4/L8

## L1, review and owner decisions

- **Review:** APPROVED (`plans/localization/l1/iter-1/REVIEW.md`).
- **Owner:** ADR 0033 gets one line on Russian test data and DB-compared strings (done by the session); quoted section names → amendment for L4/L8 in the plan; ADR 0001 voice and ADR 0034 option count left as is.

## L2, iteration 1

- **Date:** 2026-10-25
- **Status:** completed (not committed — awaiting review)
- **Summary:** `en.json`, `settings.language` in both dictionaries, `TLanguage`, language constants, `locale.ts`, detection/storage, `LanguageContext` + `useLanguage`, per-language loading in the provider; key-parity and detection tests.
- **Checks:** lint, build green; test 123 (was 112); live matrix on the local stack passed (en-US, ru-RU, de-DE, stored choice, all screens in English). Runtime switch not checked — no UI until L3.
- **Deviation:** key-parity test uses `import.meta.glob` instead of `fs` (no Node types in `tsconfig.app.json`).

## L2, review iteration 1

- **Review:** NEEDS_CHANGES, `Issue source: plan` — two interfaces in `_I18nContext.tsx`. Owner chose: amend the plan (inline state type, plus small wording and comment fixes) and re-run; retry-after-failed-fetch moved to L3. Amendments recorded in the plan.

## L2, iteration 2 (amendment)

- **Status:** completed — inline provider state type, comment reworded, redundant guard removed, two `en.json` strings reworded. lint, build, test (123) green.
- **Incident:** a repo-wide `pnpm prettier` rewrote 91 unrelated files; restored by the developer, working tree verified by the orchestrator (only the phase files changed).

- **Review iteration 2:** APPROVED (`plans/localization/l2/iter-2/REVIEW.md`).

## L3, iteration 1

- **Date:** 2026-10-25
- **Status:** completed (not committed — awaiting review)
- **Summary:** formats per UI language (`en-GB` / `ru-RU`, `5 Oct 2026` via dayjs), `LocalizedDatesProvider` inside `I18nProvider`, `LanguageBlock` in settings, «Recipe Book» in `index.html` and the manifest (demo «Recipe Book (demo)» / «Recipes demo»), retry of a failed dictionary fetch (`{ language, attempt }` request state).
- **Checks:** lint, build, build:demo, test (129) green; live matrix on the local stack passed (switch, persistence, numbers, dates, calendar, mutation error language, manifest, retry). Russian calendar month names not opened.
- **Review iteration 1:** APPROVED with notes (`plans/localization/l3/iter-1/REVIEW.md`).

## L3, iteration 2

- **Status:** completed — language radios grouped in a `fieldset` with `aria-label` (owner asked to fix the a11y note). lint, build, test (129) green.
- **Review:** APPROVED (`plans/localization/l3/iter-2/REVIEW.md`).

## L3, rollout (2026-10-25)

- Committed `89c65af`; `git push origin master` (`1e48a1b..89c65af`, 14 commits incl. P1–P5, L1–L3).
- `scripts/publish-public.ps1 -Remote https://github.com/axtew/recipe-book-demo.git`: all checks passed, 84 commits, fast-forward `3ff98cf..f92e6d4`.
- `pnpm deploy:demo`: version `3e71bb57-76f1-4618-beda-7a7fd6b8d3c8`; served page `<html lang="en">`, title «Recipe Book», `en.json` 200, manifest «Recipe Book (demo)» / «Recipes demo».

## L4, iteration 1

- **Date:** 2026-10-29
- **Status:** STOPPED_ON_PLAN_GAP before any edit — `scripts/publish-exclude.txt` accepts literal paths only, `glob:*-ru.md` would break the publish script (`plans/localization/l4/iter-1/DEV-REPORT.md`).
- **Owner decision:** no Russian read-copies for agent instructions at all; `BACKLOG-ru.md` stays (literal path, L8); `docs/agents/architecture.md` split into a public `docs/architecture.md` and a private `plans/recipe-book-v1/architecture-tutorial.md`. Amendments «Phase L4 — added 2026-10-29» and «Phase L8 — added 2026-10-29» recorded in the plan.

## L4, iteration 2 (amendment 2026-10-29)

- **Date:** 2026-10-29
- **Status:** completed (not committed — awaiting review)
- **Summary:** 14 agent-instruction files in English, no `-ru.md` copies; `docs/agents/architecture.md` → `plans/recipe-book-v1/architecture-tutorial.md` (verbatim, excluded by literal path) + new English `docs/architecture.md`; ADR 0035 (partly supersedes ADR 0033); links moved in `AGENTS.md`, ADRs 0003/0005/0012/0017, `plans/README.md`, `STATUS.md`.
- **Checks:** Cyrillic over the English set = 0; `agents/architecture` references = 0; publish dry run on a temp clone green (86 commits); `pnpm lint` green.
- **Review iteration 2:** NEEDS_CHANGES, `Issue source: code` — false `created_at` claim in `docs/architecture.md` (`plans/localization/l4/iter-2/REVIEW.md`).

## L4, iteration 3 (fix)

- **Status:** completed — `created_at` claim fixed; plus four review notes: ADR 0035 tense, guillemets wording in `i18n.md`, diagram alignment, stale `.env.demo` wording in `data.md`. Cyrillic = 0, lint green.
- **Review iteration 3:** APPROVED (`plans/localization/l4/iter-3/REVIEW.md`). Notes for the owner: guillemets around quoted section names remain in the English agent docs; file anchors in `i18n.md`.
- **Owner edit before commit:** dropped «Both are visible in DevTools → Application» from `docs/architecture.md` (already in the private tutorial); guillemets in agent docs stay.
- **Committed:** `489e839`.

## L5, iteration 1

- **Date:** 2026-10-29
- **Status:** completed (not committed — awaiting review)
- **Summary:** 60 files in the non-UI layers of `src/`: comments, JSDoc, `Error` / `console` messages and test names in English; fixture data in nutrition, backup and schema tests translated where the test does not check Russian text. Remaining Cyrillic: `src/utils/search.ts`, `search.test.ts`, `recipes.test.ts` (Russian search data).
- **Checks:** AST comparison (`plans/localization/l5/iter-1/astcheck.cjs`) — 60 files, 0 differences outside comments and strings; lint, build, test (129) green.
- **Review iteration 1:** NEEDS_CHANGES, `Issue source: plan` — `DEPLOY.md:114` quotes the old Russian `env.ts` message. Owner chose: amend the plan («Phase L5, L6 — added 2026-10-29») and re-run.

## L5, iteration 2 (amendment)

- **Status:** completed — `DEPLOY.md:114` quotes the new `env.ts` message; old-text grep over the repo outside `src/` for every changed message (only that hit); two comment wordings; `"плов"` → `"pilaf"` in `recipes.test.ts`. AST check 61 files / 0 differences; lint, build, test (129) green.
- **Review iteration 2:** APPROVED (`plans/localization/l5/iter-2/REVIEW.md`).
- **Committed:** `2f29ea5`; pushed to origin (`89c65af..2f29ea5`, with L4 `489e839`). Public copy not synced yet (needs `-Force` once — exclude list changed in L4).

## L6, iteration 1

- **Date:** 2026-10-29
- **Status:** completed (not committed — awaiting review)
- **Summary:** 116 files in `src/components` and `src/pages`: comments, `Error` messages and test names in English; test data translated where the test does not check Russian text. Remaining Cyrillic: `src/pages/RecipesPage/_helpers.test.ts` (Russian normalization). Old-text grep for changed messages — no quotes outside `src/`.
- **Checks:** AST check 116 files / 0 differences (46 string literals); lint, build, test (129) green. Developer's patch tooling removed from the artifact folder by the orchestrator.
- **Review iteration 1:** APPROVED (`plans/localization/l6/iter-1/REVIEW.md`). Notes: pre-existing comments referencing the spec/plan (`_RecipePage.tsx:33`, `_RecipeForm.tsx:22`) and a stale reason in `_UsedInRecipes.tsx:14`; 23 comment lines over 100 chars.

## L6, iteration 2 (fix)



- **Status:** completed — spec/plan references dropped from two comments, `_UsedInRecipes.tsx` comment made true (names are plain text), long and ragged comment wraps fixed, doubled quote in `ProductPicker` comments. AST check 0 differences; lint, build, test (129) green.
- **Review iteration 2:** APPROVED (`plans/localization/l6/iter-2/REVIEW.md`).
- **Committed:** `592e084` (not pushed).

## L7, iteration 1

- **Date:** 2026-10-29
- **Status:** completed (not committed — awaiting review)
- **Summary:** English comments in 8 migrations, `dev-data.sql`, `dev-data-cleanup.sql`, `setup.sql`, demo tooling (`keepalive.ts`, `_build.ts`, `upload-photos.mjs`, `source/_types.ts`, `seed.test.ts` names) and `eslint.config.js`; `load-seed.sql` header regenerated (data byte-identical). Quotes of changed messages updated in `supabase/demo/DEPLOY.md` and `README.md`. Three Russian `raise` messages left in `setup.sql` / `dev-data-cleanup.sql` — open question for the owner.
- **Checks:** strip-and-compare identical for 13 `.sql`; `pnpm db:reset` + dev data restored; lint, build, test (129) green.
- **Review iteration 1:** NEEDS_CHANGES, `Issue source: plan` — three Russian `raise` messages vs strip-and-compare (`plans/localization/l7/iter-1/REVIEW.md`). Owner chose: amend the plan («Phase L7 — added 2026-10-29») and re-run.

## L7, iteration 2 (amendment)

- **Status:** completed — three `raise` messages in English (`setup.sql` ×2, `dev-data-cleanup.sql`); strip-and-compare: migrations and `dev-data.sql` identical, `setup.sql` / `dev-data-cleanup.sql` differ only in those literals; `supabase/demo/DEPLOY.md` 61, 204, 205, 209 quote the English messages (prose Russian until L8). lint, build, test (129) green. Header comments in `supabase/demo/source/{products,recipes,cookLogs}.ts` left for L9.
- **Review iteration 2:** APPROVED (`plans/localization/l7/iter-2/REVIEW.md`). Note: the L9 contract should name the file-header comments in `supabase/demo/source/*.ts` explicitly.
