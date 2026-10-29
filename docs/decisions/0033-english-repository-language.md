# 0033. English is the repository language, Russian is the second language of reference docs

- Status: accepted; partly superseded by ADR 0035
- Date: 2026-10-25
- Supersedes: [ADR 0031](0031-russian-language-of-repository.md)

## Context and problem

[ADR 0031](0031-russian-language-of-repository.md) made the whole repository Russian. The repository is a portfolio for remote work abroad, and the demo and the public repository are read first of all by people who do not know Russian. The language of the repository has to be English; at the same time Russian stays useful as the second language of the app UI ([ADR 0034](0034-bilingual-ui-by-browser-language.md)) and as a second copy of the reference docs.

## Considered options

1. Keep Russian everywhere (ADR 0031) — unreadable for the target audience.
2. English only, no Russian copies — the owner loses the ability to read the instructions and documents in their own language, and the Russian originals would exist only in git history.
3. **English as the main language, with Russian copies where they are needed** — the chosen split, described below.

## Decision

**English is the main language of the repository.** In English:

- agent instructions that reach the public repository (`AGENTS.md`, `docs/agents/**`, `plans/README.md`);
- ADRs;
- code comments and JSDoc;
- developer-facing messages (`throw new Error(...)`, `console.*`);
- test names;
- commit messages, from now on (the old history stays as is);
- new files in `plans/` (plans, reports, reviews).

**Two languages, English main:** `README.md` + `README.ru.md` and the reference docs (`supabase/demo/DEPLOY.md`, `docs/user-guide.md`, `docs/manual-checks.md` and the like). The English file is `X.md`, the Russian one is `X.ru.md`; the first line of each file links to its pair.

**Russian read-copies of agent instructions** are `*-ru.md` files next to the English originals. They exist only in the working repository, are excluded from the public copy, and are updated together with the original in the same change. Tools never read them. ADRs get no Russian copies: they change rarely, and the Russian originals stay in git history.

**Stays Russian:**

- the history in `plans/`: existing files are not translated, and sections appended to them stay Russian;
- private files `STATUS.md` and the root `DEPLOY.md`;
- data: the dictionary `public/dictionaries/ru.json`, the demo seed, the category names in `reference_data`;
- test data where the test checks Russian text (search, sorting, Russian formatting, dictionary content); the test names around it are English. Strings the code compares with the database stay byte-identical to the database side.

**Migration comments** are translated once, as a recorded exception. Supabase tracks applied migrations by the version in the file name and never compares file contents, so editing comments neither re-applies a migration nor makes it look new. The rule "never edit an applied migration" itself is unchanged; a mechanical check closes the real risk behind it (a logic change slipping silently into an old file): strip the `--` comments and whitespace and compare with `HEAD` — the result must be identical.

**Unchanged:** technical names stay as they are (identifiers, file names, APIs, libraries), ADR file names stay in English, and the headings, statuses and keys from the pipeline templates that the skills read stay verbatim.

**This translation of the ADRs is a language-only rewrite.** Every ADR keeps its meaning, structure, options and consequences, and the dates are unchanged. The rule "an accepted ADR is not rewritten" stays in force for everything else.

## Consequences

- The repository can be read end to end by an English-speaking reader; the Russian text is limited to data, the private files, the history in `plans/` and the explicit Russian copies.
- Every change to an English instruction file has to be mirrored in its `-ru.md` copy; skipping that makes the copy stale. The copy is a read-aid only, so a stale copy costs the owner time, not correctness.
- The Russian text of ADR 0001–0032 before this rewrite is available in git history.
- Comments in applied migrations are English from now on; production keeps the Russian comments inside the stored body of one function (`backup_export_import`), which is invisible and harmless.
- The rules for the UI language are in [ADR 0034](0034-bilingual-ui-by-browser-language.md).
