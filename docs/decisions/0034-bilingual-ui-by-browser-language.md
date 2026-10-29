# 0034. Bilingual UI, the language follows the browser

- Status: accepted
- Date: 2026-10-25
- Supersedes: [ADR 0032](0032-english-ui-language-later.md); partly supersedes [ADR 0002](0002-russian-ui-with-i18n.md) (the "Russian only" part)

## Context and problem

[ADR 0002](0002-russian-ui-with-i18n.md) fixed a Russian-only UI, and [ADR 0032](0032-english-ui-language-later.md) postponed English to a separate task. The demo and the public repository are a portfolio for remote work abroad, so the English UI is now needed; the owners of the app still use it in Russian.

## Considered options

1. English by default for everyone — the Russian-speaking users would have to switch manually.
2. **The language follows the browser**, with a manual choice in settings — Russian browsers see Russian, everyone else sees English.

## Decision

**Option 2.** The UI is bilingual:

- Two dictionaries, `public/dictionaries/en.json` and `public/dictionaries/ru.json`; the `I18n` interface is the shape of both.
- **Language detection:** if the primary `navigator.language` starts with `ru`, the UI is Russian; otherwise it is English.
- **An explicit choice** is made in the settings page, stored in `localStorage`, and only then. While the choice is unset, the UI keeps following the browser language; detection never writes to storage.
- **Formats follow the language:** the English UI shows numbers as `1,234.5` and dates day-first with a short month name (`25 Oct 2026`), the week starts on Monday; the Russian UI keeps `1 234,5` and `DD.MM.YYYY`.
- **The product name is "Recipe Book" in both languages** (`<title>`, PWA name, README).
- **Demo data stays Russian** for now; an English seed is a separate later task (`BACKLOG.md`).
  **Update 2026-10-29:** the demo data is English (localization L9); per-language demo data is deferred — `BACKLOG.md`, «Demo data per UI language».

The rules from [`conventions/i18n.md`](../agents/conventions/i18n.md) apply to every dictionary: every key exists in every dictionary.

This ADR replaces in ADR 0002 the statements that the single dictionary is `ru.json` and that no second language exists, and replaces ADR 0032 entirely. The rest of ADR 0002 stays in force: the i18n infrastructure and its reasons.

## Consequences

- Adding a user-visible text means adding it to both dictionaries; a key-parity test checks that the key sets are equal.
- Number and date formatting depends on the current UI language, and the language and the formats switch together.
- Text in Russian stays neutral with respect to gender ([`conventions/i18n.md`](../agents/conventions/i18n.md)); English text addresses the user neutrally too.
- The language of the repository documentation and code is a separate decision, [ADR 0033](0033-english-repository-language.md).
