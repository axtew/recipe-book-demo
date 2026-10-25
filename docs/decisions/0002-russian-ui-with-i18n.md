# 0002. Russian-only UI, but the i18n infrastructure is set up

- Status: accepted; partly superseded by ADR 0034
- Date: 2026-08-30

## Context and problem

The UI language is Russian, the only one; a second language is not planned. At first it was decided that i18n was not needed. The question was reconsidered on 2026-08-30.

## Considered options

1. Texts directly in JSX, no i18n (the previous decision).
2. Set up the i18n infrastructure with a single dictionary.

## Decision

**We set up the i18n infrastructure** (this cancels the earlier "i18n is not needed"). The reason is not translation but the cost of rolling back: collecting texts out of finished JSX later is a manual walk through every screen, while putting them into a dictionary right away costs almost nothing. All wording is also edited in one file.

In practice: one dictionary `public/dictionaries/ru.json`, the `I18n` interface in `src/types/i18n.types.ts`, access through `useI18nSelector`. The rules are in [`conventions/i18n.md`](../agents/conventions/i18n.md); they apply to the single dictionary unchanged.

## Consequences

- There is no second language and none is planned; an English dictionary, if it is ever needed, is a separate task.
- User-visible text is not tied to gender, see [`conventions/i18n.md`](../agents/conventions/i18n.md).
- The language of the repository documentation and code is a separate decision, [ADR 0031](0031-russian-language-of-repository.md).
