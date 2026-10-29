MODE: review
STATUS: NEEDS_CHANGES
Issue source: both

## Summary

Phase L8 reviewed against the contract and the six amendments naming it: the seven `.ru.md` pairs, `BACKLOG-ru.md`, `docs/architecture.ru.md`, the English rewrites, the exclude list and the `CLAUDE.md` removal. The translation work is faithful and the checks hold (details below). Two findings: the public `README.md` / `README.ru.md` were left with statements that L8 itself made stale (a plan gap: the README pair is in no phase's file list), and one small accuracy nit in `docs/user-guide.md`.

## What was verified (no issues)

- The `.ru.md` files really are the previous text: for all seven docs, a diff of `git show HEAD:X.md` against `X.ru.md` shows only the cross-link first line (plus, deliberately, the Language bullet in `user-guide.ru.md` and the Language item in `manual-checks.ru.md`). `BACKLOG-ru.md` differs from HEAD only by the cross-link line, the "Demo data per UI language" row and section, and the "Second UI language" move to done.
- Heading counts are equal per pair (grep of `^#`): user-guide 9/9, manual-checks 11/11, task 17/17, architecture 20/20, demo DEPLOY 15/15, demo README 5/5, CREDITS 1/1, BACKLOG 35/35.
- Cyrillic over the English files: only the cross-link lines, the exact `en.json` option label "Русский" (`user-guide.md:76`), and Russian recipe and product names plus the author name in `supabase/demo/README.md` and `CREDITS.md`, with English glosses (data). Nothing else.
- `docs/task.md`: first-person voice kept ("my wife"), line 5 states that the Russian text (`task.ru.md`) is the source of truth, all ADR bullets and all sections are present, the algorithm and data model are identical to the Russian.
- `docs/architecture.ru.md` is a faithful translation of the current English `docs/architecture.md` (every section, table row, scenario step and ADR link present; diagrams localized, identifiers unchanged). `architecture.md` changed by the cross-link line only.
- `user-guide.md` labels match `public/dictionaries/en.json` exactly (Recipes/Products/Log/Settings, "← Back", Uncategorized, "Recalculate", "Log a cook", "Create “…”", "Restore draft"/"Start over", "Make active", "Archive product", "Finished"/"Other date", "Download backup", "Choose file", "Up"/"Down", "Language"/"English"/"Русский", "Sign out"). The Language bullet matches ADR 0034 and `detectLanguage` (a `ru` prefix gives Russian, a stored choice wins); the `manual-checks` Language item is consistent. The `manual-checks.md` quotes ("Couldn’t load the data" then "Retry", "Restore draft"/"Start over", "Clear rating", "Finished"/"Other date") match `en.json`.
- Demo `DEPLOY.md` and `.ru.md`: the quoted message texts ("this is not the demo project", "demo user not found") match `supabase/demo/setup.sql:29,132`; kept English in both files as the L7 amendment requires. `pnpm vitest run supabase/demo` passes (the test reads `CREDITS.md`).
- Links: every relative link in all 16 files resolves (script run); public English files link only to English files; nothing outside `plans/**` links to `BACKLOG-ru.md` (only `scripts/publish-exclude.txt` and ADR 0035 name it, as plain text). No `#` anchor anywhere points into a changed file from outside it (grep over `*.md` outside `plans/*/**`), so the translated headings break nothing. Anchors inside `BACKLOG.md` and `BACKLOG-ru.md` (including `#buttons--instead-of-dragging-on-the-phone`) resolve.
- BACKLOG: the section names quoted by ADRs are verbatim ("Rejected", "Nutrition from a label photo", "Planning assistant", "Recipe import from a screenshot or a link", "Families and multi-tenancy", "Publishing to the stores", "Household inventory"; checked against `rg -n "BACKLOG" docs/decisions`). "Demo data per UI language" carries the rationale, the two-projects design, the three costs (backend switch plus re-sign-in; reset, schedule, keep-alive and migration rollout double; free tier allows two projects) and the trigger, exactly as the 2026-10-29 amendment lists; the Russian copy mirrors it. "Second UI language" is struck in the summary and has a done section citing ADR 0034 and ADR 0032.
- `scripts/publish-exclude.txt`: `BACKLOG-ru.md` is added as one literal path with a comment. `CLAUDE.md` is staged for deletion; the `plans/README.md` row is changed as the amendment prescribes and the section-mapping table is untouched; `rg CLAUDE` outside plan histories finds only `plans/README.md` history rows, ADR 0031 (past tense, superseded) and private `STATUS.md`. No non-markdown file references it.
- No stray edits: `STATUS.md`, root `DEPLOY.md`, `src/`, `public/` are untouched; the changed set equals the developer's list (plus the orchestrator's `EXECUTION.md`, skipped).
- I did not re-run the publish dry run; the literal-path exclusion and the absence of public links to `BACKLOG-ru.md` are verified statically, which is what the script's link check depends on.

## Issues

### Code issues

#### Documentation accuracy

- [code] `docs/user-guide.md:21` and `:23` — "Breakfasts" and "Soups" are presented as what the screen shows. Category names are user data (Russian in the seed and in the demo); only "Uncategorized" (`recipeList.uncategorized`) is a dictionary label. An English-UI reader will see «Завтраки», not "Breakfasts". Reword so the examples are clearly examples of category names (e.g. "dish categories such as breakfasts or soups; the names are the owner's data and are edited in Settings") instead of quoted on-screen text. The Russian original did not have this problem, so this is a translation-introduced inaccuracy. Low severity.

### Plan issues

#### Missing file: README.md and README.ru.md (orchestrator observation 5, classification: plan)

- [plan] The public README pair is in no phase's file list (`rg README plans/localization/plan.md` hits only the "two languages" statement, the cross-link precedent and `plans/README.md` items), yet it carries statements about the docs and the UI that L3, L4 and L8 made false. The developer correctly left it alone (outside the contract); the omission is the plan's. Current state, verified in the working tree:
  - `README.md:27` — user-guide marked "(in Russian)": false after L8 (caused by L8).
  - `README.md:83` — demo `DEPLOY.md` marked "(in Russian)": false after L8 (caused by L8).
  - `README.md:58` — `docs/agents/local-environment.md` marked "(in Russian)": false since L4.
  - `README.md:5` and `README.ru.md:5` — "the working documentation ... in Russian for now; an English interface is planned": the interface has been bilingual since L3 and the reference docs are English with `.ru.md` pairs after L8; only the `plans/` logs (and private files) stay Russian.
  - `README.md:91` and `README.ru.md:91` — "The interface and the demo content are in Russian only for now": the UI half is false since L3; the demo-content half is true until L9.
  - `README.md:15` — demo content "in Russian" is true until L9.
  - `README.ru.md` has no "(in Russian)" markers (the equivalents of :27, :58, :83 are absent), so only :5 and :91 need a Russian-side edit; `README.md:34` and `README.ru.md:34` ("working logs are in Russian") stay correct.
  - Fix (smallest amendment): add a `Phase L8 — added <date>` amendment that puts `README.md` and `README.ru.md` into the L8 file list for the Russian-only statements: drop the three "(in Russian)" markers (:27, :58, :83; optionally mention that the user guide and the demo `DEPLOY` have `.ru.md` pairs), rewrite :5 to "bilingual interface; the `plans/` working logs are in Russian", and in :91 keep only the demo-content clause ("The demo data is in Russian for now") in both languages. Leave :15 and the demo-content clause of :91 for L9, whose contract should list `README.md` / `README.ru.md` as files to flip when the demo data becomes English. If the owner prefers a single README pass, the whole set can move to L9 instead, but then the repository (and the public copy) carries three false "(in Russian)" markers between L8 and L9; since two of them are created by L8, the L8 route is cleaner.

#### Contract inconsistency resolved by the developer (BACKLOG link)

- [plan] The developer's reading is correct: step 6 ("nothing public links to `BACKLOG-ru.md`") and the publish link check ("markdown link to an excluded file") win over the stop condition's "every pair cross-linked". `BACKLOG.md` has no link to `BACKLOG-ru.md`; `BACKLOG-ru.md` links to `BACKLOG.md` (it is not published, so that link is safe). Nothing to fix in the code. The plan should say so, so the next reader does not trip on it: amend the L8 stop condition to "every pair cross-linked, except `BACKLOG.md`, which does not link to the excluded `BACKLOG-ru.md`". ADR 0035 already describes `BACKLOG-ru.md` as the owner's reading aid, so no ADR change is needed.

## Notes

- `docs/decisions/0034-bilingual-ui-by-browser-language.md:25` says "an English seed is a separate later task (`BACKLOG.md`)". After the 2026-10-29 amendments BACKLOG holds "Demo data per UI language" and L9 does the English seed. Not an L8 defect (ADRs are outside L8's list); worth a one-line touch when L9 closes.
- `docs/user-guide.ru.md:5` says «Книга рецептов» while ADR 0034 fixes the product name as "Recipe Book" in both languages. The file is intentionally the previous text moved as is, so this is not a defect of the phase; consider fixing in a later pass.
- `supabase/demo/README.md:7` and `CREDITS.md:9` carry an English-only sentence ("the demo data is in Russian for now") with no counterpart in the `.ru.md` files. It is accurate and useful for English readers; L9 must remove or rewrite it when the data becomes English. The pair is no longer line-for-line there, which is fine.
- `docs/task.md:5` opens with "word for word" and in the next sentence calls itself a faithful translation; harmless, "Below is the original brief" would read cleaner.
- `docs/manual-checks.md` mentions the private root `DEPLOY.md` sections as plain text (the Russian original did too); there is no link, so the publish check is unaffected.
- Done well: the glosses on Russian recipe names keep the demo README and CREDITS tables readable (prettier applied to these two files only), and the exact-label discipline in the user guide is consistent.
