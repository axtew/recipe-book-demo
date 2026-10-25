# 0032. English UI language later, as a separate task

- Status: superseded by ADR 0034
- Date: 2026-10-21

## Context and problem

[ADR 0002](0002-russian-ui-with-i18n.md) fixed that the UI language is Russian, the only one, and that a second language is not planned. Now the app gets a public demo copy and a portfolio repository: an English UI would be useful to a reader who does not know Russian.

## Considered options

1. Keep it as in ADR 0002: there will be no second language.
2. Add an English dictionary right now, as part of the publication.
3. For now keep Russian only, add the English dictionary later as a separate task.

## Decision

**Option 3.** For now the UI stays Russian only. The English dictionary will be added later, as a separate task; there is no deadline.

It replaces in ADR 0002 only the phrase "a second language is not planned" (the "Context and problem" section) and the first item of the "Consequences" section ("There is no second language and none is planned"). The rest of ADR 0002 stays in force: the i18n infrastructure, the single dictionary `public/dictionaries/ru.json`, the rules from [`conventions/i18n.md`](../agents/conventions/i18n.md).

## Consequences

- The infrastructure from ADR 0002 makes English a matter of working with the dictionary: add `en.json` and a language switcher, leave the screen code alone.
- While there is no English version, new texts are still added only to `ru.json`.
- In [`BACKLOG.md`](../../BACKLOG.md) the row about the second language stays in the "Rejected" section with the status "deferred".
