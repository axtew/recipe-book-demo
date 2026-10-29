Status: COMPLETED

# Phase L8, iteration 1 — developer report

## Phase goal

Reference docs exist as an English main file plus a Russian `.ru.md`; `BACKLOG.md` is English with a Russian read-copy (`BACKLOG-ru.md`, excluded from the public copy); `CLAUDE.md` is deleted.

## What was implemented

- For each of the 7 reference docs: the `.ru.md` was created from the current Russian text verbatim (plus the cross-link first line `[English](X.md) · **Русский**`), then the original was rewritten in place in English with the first line `[Русский](X.ru.md) · **English**`.
- `docs/architecture.ru.md` is a Russian translation of the current English `docs/architecture.md` (not the old tutorial).
- `docs/user-guide.md`: UI labels are taken from `public/dictionaries/en.json` (tabs Recipes / Products / Log / Settings, "Log a cook", "Finished", "Other date", "Make active", "Archive product", "Download backup", "Choose file", "Up" / "Down", "Sign out", "Restore draft" / "Start over", "Create “…”", "Recalculate"). A **Language** bullet was added to the Settings section in both `user-guide.md` and `user-guide.ru.md` (the switcher, browser-language default, formats follow the language). `manual-checks.md` / `.ru.md` got one matching "Language" check item under Settings.
- `docs/task.md`: faithful first-person translation; one line says the Russian original (`task.ru.md`) is the source of truth. "Готовила" button rendered as "Cooked it".
- `supabase/demo/DEPLOY.md` / `.ru.md`: English quotes of the setup.sql messages ("this is not the demo project", "demo user not found") stay English in both files; the demo banner / "Sign in" quoted from `en.json`.
- `supabase/demo/README.md` and `photos/CREDITS.md`: recipe and product names, and the author name «Надежда Мустафаева», stay Russian (data) with an English gloss in parentheses; tables reformatted with `pnpm exec prettier --write` on these two files only.
- `BACKLOG.md` in English, section names taken verbatim from the ADR quotes ("Rejected", "Nutrition from a label photo", "Planning assistant", "Recipe import from a screenshot or a link", "Families and multi-tenancy", "Publishing to the stores", "Household inventory"). The "Second UI language" row was removed from "Rejected" and shown as done (struck summary row + a short section, ADR 0034). New deferred idea "Demo data per UI language" (per amendment 2026-10-29: two demo projects, prefill by detected language, listed costs, trigger) instead of "English demo seed". `BACKLOG-ru.md` mirrors all of it (same 35 headings).
- `scripts/publish-exclude.txt`: added the literal path `BACKLOG-ru.md` with a comment.
- `CLAUDE.md` deleted (`git rm`, staged only; nothing committed). `plans/README.md` row `CLAUDE.md` → "`CLAUDE.md` is removed, the tools read `AGENTS.md` directly"; the section-mapping table is untouched.

## Files created

`docs/user-guide.ru.md`, `docs/manual-checks.ru.md`, `docs/task.ru.md`, `docs/architecture.ru.md`, `supabase/demo/DEPLOY.ru.md`, `supabase/demo/README.ru.md`, `supabase/demo/photos/CREDITS.ru.md`, `BACKLOG-ru.md`, `plans/localization/l8/iter-1/DEV-REPORT.md`.

## Files modified

`docs/user-guide.md`, `docs/manual-checks.md`, `docs/task.md`, `docs/architecture.md` (cross-link line only), `supabase/demo/DEPLOY.md`, `supabase/demo/README.md`, `supabase/demo/photos/CREDITS.md`, `BACKLOG.md`, `scripts/publish-exclude.txt`, `plans/README.md`. Deleted: `CLAUDE.md`.

## Verification

- `rg -n "[А-Яа-яЁё]"` over the 7 English docs + `docs/architecture.md`: hits are only (a) the cross-link first line, (b) Russian recipe / product names and the author name in `supabase/demo/README.md` and `CREDITS.md` (data, with English gloss), (c) the "Русский" language option label in `user-guide.md` (exact `en.json` label). No other Cyrillic.
- Pairs: heading counts equal (user-guide 9/9, manual-checks 11/11, task 17/17, DEPLOY 15/15, demo README 5/5, CREDITS 1/1, architecture 20/20, BACKLOG 35/35); every relative link in all 16 files resolves; every in-file anchor in `BACKLOG.md` / `BACKLOG-ru.md` resolves to a heading.
- Publish dry run: `scripts/publish-public.ps1` was run against a temporary clone of the repository holding the L8 working-tree changes committed there (the script publishes committed state only), `-WorkDir` in the scratchpad, no `-Remote`, nothing pushed. Result: "All checks passed."; `.ru.md` files present in the public tree (`docs/*.ru.md`, `supabase/demo/*.ru.md`, `README.ru.md`), `BACKLOG-ru.md` and `CLAUDE.md` absent. Temporary clones deleted afterwards.
- `rg "CLAUDE\.md"` outside `plans/{localization,recipe-book-v1,publication}` history: remaining hits are `plans/README.md` history table rows (the "Old name → new" mapping and its section table), `docs/decisions/0031` (a past-tense statement in a superseded ADR) and private `STATUS.md` (not touched). No reference implies the file exists.
- `pnpm lint`: passed. Build/tests not run (docs-only phase; the phase names only lint). Prettier `--check` pre-existing warnings on `BACKLOG.md`, `docs/architecture.md`, `plans/README.md` exist at HEAD too and were left.
- Runtime/browser: not applicable (Visual Verification: N/A).

## Known issues / follow-ups

1. **Plan inconsistency, resolved in favour of the explicit rule.** The stop condition says "every pair cross-linked", but step 6 says nothing public links to `BACKLOG-ru.md`, and the publish script fails the link check ("markdown link to an excluded file: BACKLOG.md -> BACKLOG-ru.md"). So `BACKLOG.md` has **no** link line to `BACKLOG-ru.md`; `BACKLOG-ru.md` links to `BACKLOG.md`. The plan could say this explicitly.
2. The next public push needs `-Force` once (exclude list changed, per the amendment). Not run.
3. `README.md` (public) still says the working documentation is in Russian for now — outside L8's file list; left as is.
4. `docs/manual-checks.md` mentions the private `DEPLOY.md` sections ("The regular rollout cycle", "Checklist before the first release") as a plain-text mention, as the Russian original did; the root `DEPLOY.md` is excluded from the public copy.
5. `CLAUDE.md` deletion is staged (`git rm`) in the working tree; nothing is committed.
