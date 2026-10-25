# Plan: English as the main language, Russian second

slug: localization

**Status (2026-10-25): decisions recorded, phases outlined.** The full phase contracts (files, budgets, verification) are written by `frontend-plan` when the task starts — right after publication phase P5 (`plans/publication/plan.md`). Split out of the publication plan at the owner's request so the two tasks do not mix.

## Why

The demo and the public repository are a portfolio for remote work abroad. English becomes the main language of the UI, the agent instructions and the code; Russian stays as the second UI language and as a second copy of the reference docs.

## Decisions (owner, 2026-10-25)

Earlier round — recorded in `plans/publication/plan.md`, «Решено владельцем 2026-10-25»:

- **UI language by browser:** Russian browser → Russian, anything else → English. Switcher in settings, choice remembered in `localStorage`. A new ADR supersedes ADR 0032.
- **Demo data stays Russian** for now; an English seed is a separate later task (`BACKLOG.md`).
- **English only:** agent instructions that reach the public repo (`AGENTS.md`, `docs/agents/**`, `plans/README.md`), ADRs, code comments. A new ADR supersedes ADR 0031.
- **Two languages, English main:** `README.md` + `README.ru.md` and the reference docs (`supabase/demo/DEPLOY.md`, `docs/user-guide.md`, `docs/manual-checks.md`, …).
- **Russian read-copies `*-ru.md`** of agent instructions live only in the working repo and are excluded from the public copy.
- **`plans/` history is not translated;** the README says the working logs are in Russian.

This round (answers to the clarification questions):

1. **ADRs get no `-ru.md` copies.** They rarely change; the Russian originals stay in git history.
2. **`BACKLOG.md` — English only**, like the agent files.
3. **`docs/task.md` — reference doc:** English `task.md` + the Russian original as `task.ru.md`.
4. **Comments in applied migrations are translated** (confirmed by the owner 2026-10-25) — a one-time, recorded exception, see «Migration comments» below.
5. **Tests:** test names in English; Russian test data stays where the test checks Russian text (search, sorting, dictionary).
6. **Product name is «Recipe Book» everywhere**, in both UI languages: `<title>`, PWA `name` / `short_name`, README. Demo build: «Recipe Book (demo)». The PWA manifest is one per build and is English (`description`, `lang`).
7. **Dates in the English UI:** day-first with a short month name, `25 Oct 2026` (`D MMM YYYY`), week starts on Monday. Russian UI keeps `DD.MM.YYYY`. Numbers follow the UI language (`1,234.5` / `1 234,5`).
8. **Switcher only in settings.** The login screen already follows the browser language.
9. **Developer-facing messages** (`throw new Error(...)`, `console.*`) are translated together with the comments. Exception: strings compared against the database (the backup «target not empty» message) stay byte-identical to the DB side.
10. **Commit messages in English from now on.** Old history stays as is.
11. **New files in `plans/` are written in English** (plans, reports, reviews); existing Russian files are not translated, sections appended to them stay Russian.

## Migration comments

**Q4 — comments in applied migrations (~130 lines in 8 files), decided: translate.** Supabase tracks applied migrations by the version in the file name (`supabase_migrations.schema_migrations`) and never compares file contents, so editing comments neither re-applies a migration nor makes it look new. Two side effects:
- 4 comment lines sit inside a function body (`backup_export_import`); the body is stored in the database, so prod keeps the Russian comments while fresh databases (local, demo after a full rebuild) get the English ones. Invisible, harmless.
- The real reason for the rule «never edit an applied migration» is that a logic change slipped into an old file silently never reaches prod. A mechanical check closes it: strip `--` comments and whitespace, compare with `HEAD` — must be identical.

Decision: translate them as a one-time, recorded exception with that check in the phase's `Verification`; the rule itself stays unchanged. Data rows in `reference_data` (category names) are data and stay Russian.

## Phases (outline, ascending blast radius)

| Phase | What | Concerns |
|---|---|---|
| L1 | Agent instructions to English: `AGENTS.md`, `docs/agents/**` (incl. `pipeline-profile.md` → `comments_language: en`), `plans/README.md`, `BACKLOG.md`. New ADR superseding ADR 0031. Russian read-copies `*-ru.md`; `glob:*-ru.md` added to `scripts/publish-exclude.txt` | docs, config |
| L2 | ADR 0001–0032 and `docs/decisions/README.md` to English | docs |
| L3 | Bilingual UI: `en.json`, language detection and storage, dictionary loading per language, settings switcher, number/date formats and dayjs/Mantine locale per language, `<html lang>`, product name «Recipe Book», key-parity test `en.json` ↔ `ru.json`. New ADR superseding ADR 0032 | i18n, ui |
| L4 | Comments, developer-facing messages and test names to English — first half of `src/` (split by directory when the contract is written) | code comments |
| L5 | Same — second half of `src/`, plus `scripts/`, `supabase/demo/*.ts`/`*.mjs`, migrations (comments only, with the strip-and-compare check) | code comments |
| L6 | Reference docs bilingual (`X.md` English + `X.ru.md` Russian): `docs/user-guide.md`, `docs/manual-checks.md`, `docs/task.md`, `supabase/demo/DEPLOY.md`, `supabase/demo/README.md` | docs |

Documentation goes first so that «comments in English» is already the written rule when agents touch code in L3–L5. L3 may move earlier if the owner wants the English UI visible in the demo sooner — it does not depend on L1/L2.

## Interplay with publication P5

- P5 writes `README.md` in English + `README.ru.md` itself; L6 does not touch the README.
- `*-ru.md` copies appear only in L1, so the exclusion pattern comes with them. A change to the exclusion list changes the filtered hashes — harmless before the first public push, one `--force` after it. Recommended: the first public push after localization, so the first impression is English.
