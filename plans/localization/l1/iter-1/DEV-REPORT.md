Status: COMPLETED

# DEV-REPORT — Phase L1, iteration 1

## Phase goal

All of `docs/decisions/` is English; two new ADRs record the language decisions and supersede 0031 and 0032.

## What was implemented

- Baseline captured in `plans/localization/baseline/` (lint, build, test: all exit 0, 112 tests passed; no pre-existing errors).
- ADRs 0001–0032 translated in place, file names unchanged. MADR headings: `Context and problem`, `Considered options`, `Decision`, `Consequences`. Status line is `- Status: accepted | deferred | superseded by ADR NNNN | ... partly superseded by ADR NNNN`. Dates, options, numbers and links unchanged. Quotes «…» became "…".
- `README.md` translated; rows for 0033 and 0034 added; status column updated (0002 `accepted; partly superseded by ADR 0034`, 0031 `superseded by ADR 0033`, 0032 `superseded by ADR 0034`). The "accepted ADR is not rewritten" rule is kept, with one added sentence naming the language-only rewrite exception (ADR 0033).
- ADR 0033 (English repository language, supersedes 0031) and ADR 0034 (bilingual UI by browser language, supersedes 0032 and the "Russian only" part of 0002) written from the plan's «Decisions» and L1 steps 3–4.
- Status lines of the 0002 and 0032 files updated; the 0002 and 0032 bodies are otherwise just translated.

## Files created

- `docs/decisions/0033-english-repository-language.md`
- `docs/decisions/0034-bilingual-ui-by-browser-language.md`
- `plans/localization/baseline/{lint.log, build.log, test.log, README.md}`
- `plans/localization/l1/iter-1/DEV-REPORT.md`

## Files modified

- `docs/decisions/0001-…` … `0032-…` (all 32) — translated.
- `docs/decisions/README.md` — translated, rows 0033/0034, statuses.

Nothing outside `docs/decisions/` (and the `plans/localization/` artifacts) was touched. The git index is unchanged (only the three pre-staged plan files). Nothing is committed.

## Verification

- `rg -n "[А-Яа-яЁё]" docs/decisions` = 0 matches (rg exit 1). Before the final edit there was 1 hit: the `ё` → `е` normalisation line in ADR 0012. It was reworded to name the letters by Unicode code point (`U+0451` → `U+0435`) so the stop condition (0) holds; the meaning is unchanged.
- Link check (throwaway script in the scratchpad, not committed): 143 relative links across `docs/decisions/*.md` (anchors stripped), 0 broken. Includes links to `../../BACKLOG.md`, `../../README.md`, `../../AGENTS.md`, `../../plans/README.md`, `../task.md`, `../agents/**`.
- `pnpm lint` — passed (exit 0, no output beyond the command). `pnpm build` and `pnpm test` not re-run: no code touched (baseline green).
- Index check: `docs/decisions/README.md` has 34 rows (0001–0034), each file exists.
- Runtime/browser: N/A (docs only).

## Known issues / follow-ups

- **ADR 0031 file status.** The plan says "The 0002 and 0032 files themselves get the same status line" and lists 0031 only for the index. I also set `Status: superseded by ADR 0033` in the 0031 file, otherwise the file and the index disagree. Revert that one line if the owner wants 0031 untouched.
- **ADR 0033 and 0034 header.** I added a `- Supersedes: ...` line under Date (the plan states the supersession but not where it is recorded). Remove if unwanted.
- **Section-title references to documents translated later.** ADR 0017 points to `conventions/data.md` → "Purity of the domain module" (the Russian heading was «Чистота доменного модуля»), ADR 0025 quotes the heading «Размещение — одна лестница для всего вынесенного» as "Placement — one ladder for everything extracted", and refers to the "Old name → new" table of `plans/README.md`. These are my renderings; L4 should make the real English headings match (or adjust the quotes).
- **BACKLOG section names** quoted in ADRs 0004/0027/0028/0029/0030/0032 ("Rejected", "Nutrition from a label photo", "Planning assistant", "Recipe import from a screenshot or a link", "Families and multi-tenancy", "Publishing to the stores", "Household inventory") are renderings of the Russian names; L8 translates `BACKLOG.md` and should match them. In ADR 0032 «Отклонённое» became "Rejected" (L8 plans "Rejected / deferred").
- **ADR 0012**: the Cyrillic-letter sentence is reworded (see Verification); the only deviation from a literal translation.
- **Git line endings:** git warns that LF will become CRLF on the next touch for the rewritten files (autocrlf behaviour on this machine); the files were written with LF. Not changed.
- **ADR 0033 content beyond the plan's text** is limited to wording the plan's «Decisions» list as prose and a few consequences that follow directly (stale `-ru.md` copy, English migration comments, Russian original in git history); no new decisions were added.
- Planner note: the plan's L1 budget says "32 translated ADRs"; the folder holds 32 ADR files (0001–0032) plus the index, consistent.
