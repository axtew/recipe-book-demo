# 0035. No Russian copies of agent instructions

- Status: accepted
- Date: 2026-10-29
- Partly supersedes: [ADR 0033](0033-english-repository-language.md) (the paragraph "Russian read-copies of agent instructions" and the matching consequence)

## Context and problem

[ADR 0033](0033-english-repository-language.md) planned a Russian read-copy (`*-ru.md`) next to every English agent instruction, kept only in the working repository, excluded from the public copy and updated together with the original. The idea behind it was to let the owner read the instructions in Russian.

The decision rested on a misunderstanding. Agent instructions are written first of all for agents, and the owner does not need to read them day to day. A copy next to each file doubles the editing work and goes stale as soon as one side is changed without the other. It also needs an exclusion rule in the publish script, which accepts literal paths only, not patterns (`scripts/publish-public.ps1`).

## Considered options

1. Keep a `-ru.md` copy of every instruction (ADR 0033) — double maintenance, stale copies, one exclusion line per copy.
2. **No Russian copies of agent instructions** — the English files are the only ones.
3. Keep copies for a few chosen files — an arbitrary line, the same upkeep for each.

## Decision

**Option 2.** Agent instructions (`AGENTS.md`, `docs/agents/**`, `plans/README.md`) exist in English only and get no Russian read-copies.

- The Russian originals stay available in git history.
- Reference docs stay bilingual as ADR 0033 says (`X.md` + `X.ru.md`).
- `BACKLOG-ru.md` will be the one Russian read-copy, as the owner's reading aid. It is added in phase L8 and will be excluded from the public copy by its literal path in `scripts/publish-exclude.txt`.
- The rest of ADR 0033 stays in force: English as the repository language, the list of what stays Russian, the migration comments exception, the language-only rewrite of the ADRs.

## Consequences

- Changing an instruction file means changing one file; there is nothing to mirror.
- The owner reads the instructions in English, or in the Russian originals from git history for the state before the translation.
- `scripts/publish-exclude.txt` needs no pattern support: in phase L8 only `BACKLOG-ru.md` will be added, as a literal path.
- ADR 0033 is not edited apart from its status line; its paragraph about read-copies and the consequence about mirroring changes are replaced by this ADR.
