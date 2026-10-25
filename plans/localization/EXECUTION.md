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
