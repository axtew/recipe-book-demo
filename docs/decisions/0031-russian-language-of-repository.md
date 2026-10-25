# 0031. The repository language is Russian

- Status: superseded by ADR 0033
- Date: 2026-10-21

## Context and problem

The app UI is Russian ([ADR 0002](0002-russian-ui-with-i18n.md)), the documentation and the prose in `plans/` are Russian, the code comments are Russian. The exception was the instructions for agents: the code conventions were in English (the author's general conventions, which he carries between projects), while `CLAUDE.md` and the decision log were in Russian. A mix of languages, including within one file, makes the project harder to read. The repository is being prepared for publication as a portfolio.

## Considered options

1. Keep the conventions in English, everything else in Russian.
2. **Everything in Russian**, as in `greenapi-messenger`.

## Decision

**Everything in Russian:** README, documentation, ADRs, instructions for agents (`AGENTS.md`, `docs/agents/`), code comments, prose in `plans/`. Only technical names (identifiers, file names, APIs, libraries), ADR file names, and the headings, statuses and keys from the pipeline templates that the skills read stay in English.

## Consequences

- The conventions of this repository differ in language from the author's original conventions in other projects (`Carbon-spa` and others); synchronisation with them is kept by hand ([ADR 0025](0025-code-structure-and-conventions.md)).
- The artifacts of `plans/recipe-book-v1/` stay as they were — they are records of how things were.
