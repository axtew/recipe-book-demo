# Plan: English as the main language, Russian second

slug: `localization`
Artifacts: `plans/localization/{plan.md, EXECUTION.md}`, `plans/localization/baseline/`, and `plans/localization/<phase>/iter-<N>/{DEV-REPORT.md, REVIEW.md}` per executed iteration (phases `l1` … `l8`), same layout as `plans/publication/`. Baseline is captured by the developer before the first phase.

**Status (2026-10-25): phase contracts written, ready to run from L1.** Split out of `plans/publication/plan.md` at the owner's request; runs after publication phase P5 (done, `e0f1f35`).

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

## Approach

Direction settled with the owner in the two question rounds of 2026-10-25 (decisions above); no further brainstorm round. Technical choices made while writing the contracts:

- **Phase order changed from the outline:** ADRs first (L1) — they outrank every other document (`AGENTS.md` → «Перед работой»), so ADR 0033 «English everywhere» binds the UI and comment phases even while `AGENTS.md` still says Russian. The bilingual UI (L2–L3) goes before the agent-instruction rewrite (L4), so the instructions describe the real two-dictionary state instead of a future one. Code comments (L5–L7) and reference docs (L8) follow.
- **Number/date formatting reads the language from a module-level value**, set by the provider together with the dictionary — the same pattern as `_dictionary.ts` (`setDictionary` / `getDictionary`) for non-React code. The alternative (a `language` argument on every formatter) touches every caller for no gain: every formatter caller already re-renders on a language switch because it reads `l` from the context.
- **The dictionary language and the formats switch in one render:** the provider sets the module value and `<html lang>` only when the new dictionary has arrived, never on click — no frame mixes English labels with Russian numbers.
- **Translation phases are sized by volume, not by the operation count** — see «Assumptions to confirm».

## Assumptions to confirm

Both confirmed by the owner on 2026-10-25.

- **Operation budget of translation phases.** L1 and L4–L8 edit 15–117 files each, far over the 15-point ceiling by the canonical count. The edits are mechanical (no exported symbol changes, no logic), so the cut is by volume instead: ≤ ~10k words of prose or ≤ ~500 changed lines of comments per phase. Strict budgets would give ~25 phases. Confirm, or name a smaller cap.
- **Demo `short_name`.** iOS truncates home-screen labels at ~12 characters. Assumed: prod `name`/`short_name` «Recipe Book»; demo `name` «Recipe Book (demo)», `short_name` «Recipes demo». Correct if another label is wanted.

## Requirement coverage

- UI language by browser, Russian → Russian, else English → L2 (detection, per-language dictionary).
- Switcher in settings, remembered in `localStorage` → L2 (storage, `useLanguage`), L3 (settings block).
- Numbers and dates per language, Monday first → L3.
- «Recipe Book» everywhere, English manifest → L3 (`index.html`, `vite.config.ts`); README already done in P5.
- New ADRs superseding 0031 and 0032; ADRs English → L1.
- Agent instructions English + `-ru.md` read-copies excluded from the public copy → L4.
- Commit messages and new `plans/` files in English → L1 (ADR 0033), L4 (`AGENTS.md`, `plans/README.md`).
- Code comments, developer-facing messages, test names → L5, L6, L7; files touched in L2–L3 are finished there.
- Migration comments with the strip-and-compare check → L7.
- Reference docs bilingual, `task.md` + `task.ru.md`, `BACKLOG.md` English → L8.
- Demo data stays Russian, English seed in `BACKLOG.md` → L8 (BACKLOG entry); seed files untouched everywhere.

## Reference implementations

| What | File | Why it's relevant |
|------|------|-------------------|
| Non-React access to i18n state | `src/context/I18nContext/_dictionary.ts` | Module-level value set by the provider; mirror for the display language |
| Dictionary loading | `src/context/I18nContext/_I18nContext.tsx` | Fetch from `public/dictionaries/`, Loader until the first dictionary |
| Dictionary typed by a string-literal union | `TCookTimeFilter` (`src/types/recipes.types.ts`) + `Record<TCookTimeFilter, string>` in `src/types/i18n.types.ts` + `COOK_TIME_FILTERS` (`src/constants/recipes.constants.ts`) | Shape for `TLanguage`, its dictionary branch and the option list |
| Single-choice list | `src/pages/RecipesPage/_internal/FiltersSheet/_FiltersSheet.tsx` (cook-time radios, `SOption`) | Pattern for the language radios |
| Settings block | `src/pages/SettingsPage/_internal/ExportBlock/_ExportBlock.tsx` + `Section` | Block shape inside the settings page |
| `localStorage` access | `src/hooks/useRecipeDraft.hook.ts` | Direct `localStorage` use, unreadable value ignored |
| Bilingual doc pair | `README.md` / `README.ru.md` | Cross-link in the first line of each file |
| English originals of the generic conventions | `git show bf2a443^:.github/instructions/30-conventions-generic.md` (and `40-conventions-project.md`, `00-project.md`) | The Russian `docs/agents/conventions/*` were translated from these in P1 — start from the original English wording, then apply what changed since |

## Architectural fit

All changes follow existing project patterns. The display language as a module-level value in `src/utils/helpers/locale.ts` mirrors `_dictionary.ts`; it lives in `utils` (not in the context folder) because the formatters in `src/utils/helpers/` read it, and `utils` must not import from `context`. The context imports `utils`, which is the existing direction.

## Implementation phases

Rules shared by every phase:

- **«Cyrillic» search** = `rg -n "[А-Яа-яЁё]" <paths>`. A phase's scope that is defined by this search is re-run by the developer before starting; the count goes into DEV-REPORT.
- **What stays Russian (data, never translated):** `public/dictionaries/ru.json`; `supabase/demo/source/*.ts` record values, `supabase/demo/seed.json`, `supabase/demo/load-seed.sql`, `supabase/demo/photos.json`; insert values in `supabase/migrations/20260817123026_reference_data.sql` and `supabase/dev-data.sql`; test inputs and expectations that check Russian text (search, sorting, Russian formatting, dictionary content); `src/utils/search.ts` literals that normalise Russian (`ё`). Everything else with Cyrillic in a phase's scope ends in English. Each remaining hit is listed in DEV-REPORT as data.
- **Every file a phase touches ends with no Cyrillic outside data** — later comment phases then skip it.
- **Translation quality:** keep meaning, structure, headings hierarchy, tables, code blocks and links; no summarising, no new content unless the phase says so. Identifiers, paths, commands stay verbatim. Prose follows the project's style for documents: short sentences, concrete, no filler.
- **Stays Russian, untouched by this plan:** `STATUS.md`, root `DEPLOY.md`, `.env*` comments, everything under `plans/` except `plans/README.md` (all excluded from the public copy or historical).
- **Pipeline vocabulary** (headings, statuses and keys the skills read — `Operation budget`, `STATUS: APPROVED`, YAML keys) is already English and stays verbatim.

### Phase L1 — ADRs in English, ADR 0033 and 0034

**Goal**

All of `docs/decisions/` is English; two new ADRs record the language decisions and supersede 0031 and 0032.

**Budget**

- Operation budget: 35 files by the canonical count (32 translated ADRs + index + 2 new) — volume-sized (~9k words), see «Assumptions to confirm»
- Concern budget: docs
- Stop condition: Cyrillic search over `docs/decisions/` = 0; both new ADRs present and linked from the index

**Files to create**

- `docs/decisions/0033-english-repository-language.md`
- `docs/decisions/0034-bilingual-ui-by-browser-language.md`

**Files to modify**

- `docs/decisions/0001-…` … `0032-…` (all 32) — translated
- `docs/decisions/README.md` — translated; rows for 0033 and 0034; status column updated

**Implementation details**

1. Translate ADRs 0001–0032 in place, file names unchanged (links elsewhere depend on them). MADR section headings in English: `Context and problem`, `Considered options`, `Decision`, `Consequences`. Status vocabulary: `accepted`, `deferred`, `superseded by ADR NNNN`, `partly superseded by ADR NNNN`.
2. The index rule «an accepted ADR is not rewritten» is kept; ADR 0033 records that this translation is a language-only rewrite — meaning unchanged.
3. **ADR 0033 — English as the repository language** (accepted, 2026-10-25, supersedes 0031). Content from the «Decisions» section above: English for agent instructions, ADRs, code comments, developer-facing messages, test names, commit messages, new `plans/` files; README and reference docs bilingual (`X.md` English + `X.ru.md`); `*-ru.md` read-copies of agent instructions only in the working repo, excluded from the public copy, updated together with the original; `plans/` history and appended sections of old files stay Russian; private files (`STATUS.md`, root `DEPLOY.md`) stay Russian; migration comments — one-time translation with the strip-and-compare check, the «never edit an applied migration» rule itself unchanged; technical names, ADR file names and pipeline vocabulary as before. Considered options: keep Russian (0031); English only, no Russian copies; the chosen split. Reason: portfolio for work abroad.
4. **ADR 0034 — Bilingual UI, language by browser** (accepted, 2026-10-25, supersedes 0032 and the «only Russian» part of 0002). Content: `en.json` + `ru.json`, the `I18n` interface is the shape of both; Russian browser (`navigator.language` starts with `ru`) → Russian, otherwise English; explicit choice in settings stored in `localStorage` and only then (an unset choice keeps following the browser); formats per language (decision 7); product name «Recipe Book» in both languages; demo data stays Russian. Considered options: always English by default; browser language; the decision.
5. Index: 0002 → `accepted; partly superseded by ADR 0034`; 0031 → `superseded by ADR 0033`; 0032 → `superseded by ADR 0034`. The 0002 and 0032 files themselves get the same status line, nothing else.

**Verification**

- `rg -n "[А-Яа-яЁё]" docs/decisions` = 0 matches.
- Every relative link in `docs/decisions/*.md` resolves to an existing file (script or manual list in DEV-REPORT).
- `pnpm lint` passes (`pnpm build` / `pnpm test` unaffected — no code).

**Visual Verification**: N/A

### Phase L2 — English dictionary and language selection

**Goal**

The app loads `en.json` or `ru.json` by the browser language or the stored choice, can switch language at runtime without a reload, and exposes the current language to the app and to non-React formatters. Visible result: an English browser sees the whole UI in English; dates and numbers still Russian-formatted until L3.

**Budget**

- Operation budget: 15
- Concern budget: i18n, state
- Stop condition: build, lint, tests green; key-parity test passes; live check matrix below passes

**Files to create**

| Path | Purpose | Reference |
|------|---------|-----------|
| `public/dictionaries/en.json` | Every key of `ru.json`, English values | `ru.json` |
| `src/types/language.types.ts` | `TLanguage` | `TCookTimeFilter` |
| `src/constants/i18n.constants.ts` | `LANGUAGES`, `LANGUAGE_STORAGE_KEY`, `INTL_LOCALES` | `COOK_TIME_FILTERS` |
| `src/utils/helpers/locale.ts` | `setDisplayLanguage` / `getDisplayLanguage` | `_dictionary.ts` |
| `src/context/I18nContext/_language.ts` | `detectLanguage`, `readStoredLanguage`, `storeLanguage` | `useRecipeDraft.hook.ts` (storage) |
| `src/context/I18nContext/_languageContext.ts` | `LanguageContext` | `_context.ts` |
| `src/context/I18nContext/_useLanguage.ts` | `useLanguage()` | `_useI18nSelector.ts` |
| `src/context/I18nContext/__tests__/dictionaries.test.ts` | Key parity of every dictionary in `public/dictionaries/` | — |
| `src/context/I18nContext/__tests__/language.test.ts` | `detectLanguage` cases | `src/utils/__tests__/*.test.ts` |

**Files to modify**

| Path | What changes |
|------|-------------|
| `public/dictionaries/ru.json` | Add `settings.language` (below) |
| `src/types/i18n.types.ts` | Add `settings.language`; import `TLanguage` |
| `src/context/I18nContext/_I18nContext.tsx` | Language state, per-language loading, `LanguageContext` provider (structural) |
| `src/context/I18nContext/index.ts` | Export `useLanguage` |

**Types and interfaces**

```typescript
// src/types/language.types.ts
export type TLanguage = "en" | "ru";

// src/constants/i18n.constants.ts
export const LANGUAGES: TLanguage[] = ["en", "ru"];          // switcher order
export const LANGUAGE_STORAGE_KEY = "recipe-book.language";
export const INTL_LOCALES: Record<TLanguage, string> = { en: "en-GB", ru: "ru-RU" };

// src/context/I18nContext/_useLanguage.ts
interface ILanguageContext {
  language: TLanguage;                         // language of the dictionary currently shown
  setLanguage: (language: TLanguage) => void;  // stores the choice, loads the dictionary
}

// i18n.types.ts, inside settings
language: { title: string; hint: string; options: Record<TLanguage, string> };
```

**i18n strings** — add to every dictionary in `public/dictionaries/`:

| Key | `en.json` | `ru.json` |
|-----|-----------|-----------|
| `settings.language.title` | Language | Язык |
| `settings.language.hint` | By default, the browser language is used | По умолчанию — язык браузера |
| `settings.language.options.en` | English | English |
| `settings.language.options.ru` | Русский | Русский |

Option names are endonyms and identical in both files.

**Implementation details**

1. `detectLanguage(stored: string | null, browserLanguage: string): TLanguage` — pure: a stored value that is a member of `LANGUAGES` wins; else `browserLanguage.toLowerCase().startsWith("ru")` → `"ru"`; else `"en"`. Only the primary `navigator.language` counts, not the `navigator.languages` list. `readStoredLanguage()` returns the raw `localStorage` value; `storeLanguage(language)` writes it. Detection never writes — an unset choice keeps following the browser.
2. Provider: initial language = `detectLanguage(readStoredLanguage(), navigator.language)`. Effect on `language` change fetches `/dictionaries/${language}.json`. On arrival, in this order: `storeDictionary(data)`, `setDisplayLanguage(language)`, `document.documentElement.lang = language`, then React state (dictionary + loaded language). Full-screen Loader only before the first dictionary; on a later switch the previous dictionary stays on screen until the new one arrives. A failed fetch keeps the current dictionary and logs to `console.error` (English message), as today. Cancellation guard as in the current effect (a fast double switch must not apply a stale response).
3. `LanguageContext` value: `{ language: <loaded language>, setLanguage }`; `setLanguage` calls `storeLanguage` and sets the requested language. `useLanguage()` throws outside the provider, like `useI18nSelector`.
4. `locale.ts`: module value, default `"ru"` (keeps the current output for code and tests that run without the provider); provisioned for L3.
5. `en.json` — translate all 275+ strings. Glossary (keep consistent):

   | Russian | English |
   |---|---|
   | продукт / справочник продуктов | product / product list |
   | вариант (продукта), активный | variant, active |
   | КБЖУ | nutrition; per-value labels below |
   | ккал, Б / Ж / У | kcal, P / F / C |
   | граммы, г | grams, g |
   | рецепт, ингредиент, шаг | recipe, ingredient, step |
   | порция, выход (вес готового блюда) | serving, yield (cooked weight) |
   | журнал (готовки), готовка, записать готовку | log (cooking log), cook, log a cook |
   | доели | finished |
   | архивировать, в архиве | archive, archived |
   | хранение, морозилка, холодильник | storage, freezer, fridge |
   | категория блюд | dish category |
   | черновик | draft |
   | бэкап, экспорт, импорт | backup, export, import |

   Keep every `{placeholder}` verbatim, keep «label: count» strings as labels without a number (`variantsLabel` → `variants`). Sentence case for buttons and titles. English text addresses the user neutrally (no gendered forms exist; keep the impersonal tone of `ru.json`). Russian quotes «…» → “…”.
6. Key-parity test: enumerate `public/dictionaries/*.json` (no hardcoded list), compare the recursive key set of each against `ru.json`, and assert every leaf is a non-empty string. Runs in Node (`fs`).
7. All comments and messages in the files this phase touches end in English (shared rule).

**Provisioned for later phases**

| Symbol | Consumer phase | How it is used |
| --- | --- | --- |
| `getDisplayLanguage` (`src/utils/helpers/locale.ts`) | L3 | `nutrients.ts` and `dates.ts` pick the format by it |
| `INTL_LOCALES` (`src/constants/i18n.constants.ts`) | L3 | `Intl.NumberFormat` locale per language |
| `useLanguage` (`src/context/I18nContext`) | L3 | dates locale provider and the settings switcher |
| `settings.language` keys | L3 | settings switcher labels |

**Verification**

`pnpm lint`, `pnpm build`, `pnpm test` green. Live check on the local stack (`docs/agents/local-environment.md`, dev user), browser locale set through Playwright context or `navigator.language` override:

| check_id | dependency_group | expected_evidence |
| --- | --- | --- |
| `app_boots_en` | boot | browser `en-US`, no stored choice → login screen text from `en.json`, `<html lang="en">` |
| `app_boots_ru` | boot | browser `ru-RU` → login screen text from `ru.json`, `<html lang="ru">` |
| `other_locale_en` | boot | browser `de-DE` → English |
| `stored_choice_wins` | storage | `localStorage["recipe-book.language"] = "ru"`, browser `en-US` → Russian after reload |
| `all_screens_en` | coverage | in English: recipes, recipe, editor, products, product, log, settings — no Russian UI text except data (recipe/product/category names), no `undefined` / raw keys; console clean |

Shared blockers: `app_boots_en`. Independent checks: all others.

**Visual Verification**: N/A (profile: visual verification disabled; the live checks above are the developer's)

### Phase L3 — Formats, settings switcher, product name

**Goal**

Numbers, cook-log dates and the calendar follow the UI language; the settings page has a language switcher that applies immediately and survives a reload; the product is called «Recipe Book».

**Budget**

- Operation budget: 13
- Concern budget: ui, config
- Stop condition: build, lint, tests green; live check matrix passes

**Files to create**

| Path | Purpose | Reference |
|------|---------|-----------|
| `src/app/_LocalizedDatesProvider.tsx` | `DatesProvider` with `locale` from `useLanguage().language`, `firstDayOfWeek: 1` | current `DatesProvider` in `App.tsx` |
| `src/pages/SettingsPage/_internal/LanguageBlock/index.ts` | Barrel | `ExportBlock/index.ts` |
| `src/pages/SettingsPage/_internal/LanguageBlock/_LanguageBlock.tsx` | `Section` + hint + one radio per `LANGUAGES` member | `ExportBlock`, cook-time radios in `FiltersSheet` |
| `src/pages/SettingsPage/_internal/LanguageBlock/_styles.ts` | Option row (≥44px tap target) | `SOption` in `FiltersSheet/_styles.ts` |
| `src/utils/__tests__/nutrients.test.ts` | Formats per language | `dates.test.ts` |

**Files to modify**

| Path | What changes |
|------|-------------|
| `src/app/App.tsx` | `DatesProvider` replaced by `LocalizedDatesProvider` **inside** `I18nProvider` (it needs `useLanguage`) |
| `src/utils/helpers/nutrients.ts` | One formatter set per language via `INTL_LOCALES`, chosen by `getDisplayLanguage()` |
| `src/utils/helpers/dates.ts` | `formatCookDate`: `ru` → `DD.MM.YYYY` as now; `en` → `D MMM YYYY` via `dayjs` (already a dependency; built-in `en` locale) |
| `src/utils/__tests__/dates.test.ts` | Add English cases; test names English |
| `src/pages/SettingsPage/_SettingsPage.tsx` | Mount `LanguageBlock` after `CategoriesEditor`, before the account block |
| `index.html` | `lang="en"`, `<title>Recipe Book</title>` |
| `vite.config.ts` | Manifest: `name`, `short_name`, `description`, `lang: "en"` (values below); comments English |

**Implementation details**

1. Formats: `en` uses `en-GB` (`1,234.5`, `×1.5`); `ru` unchanged (`1 234,5`, `×1,5`). `formatKcal` unchanged. Tests set the language with `setDisplayLanguage` and restore `"ru"` after each test.
2. `formatCookDate("2026-10-05")` → `"5 Oct 2026"` in English. Do not use `Intl.DateTimeFormat("en-GB", { month: "short" })` — newer ICU prints «Sept». Parsing `YYYY-MM-DD` with `dayjs` stays in local time and returns the same calendar day; no `Date` arithmetic beyond that (`AGENTS.md` invariant on `cooked_at` / `finished_at`).
3. Calendar month/day names follow `DatesProvider.locale`; `DatePickerInput valueFormat="D MMMM YYYY"` in `CookLogSheet` then reads «25 October 2026» in English — accepted, no change there.
4. `LanguageBlock`: radios named `language`, checked = `useLanguage().language`, change → `setLanguage`. Labels from `l.settings.language.options`. No extra save button; the switch is immediate.
5. Manifest values: prod `name` and `short_name` «Recipe Book»; demo `name` «Recipe Book (demo)», `short_name` «Recipes demo»; `description` «Product list, recipes with nutrition totals, cooking log». Already installed home-screen icons keep their old label on iOS until reinstalled — expected.
6. Shared rule: touched files end in English.

**Verification**

`pnpm lint`, `pnpm build`, `pnpm build:demo`, `pnpm test` green. Live check on the local stack:

| check_id | dependency_group | expected_evidence |
| --- | --- | --- |
| `switch_to_ru` | switch | English UI → settings → «Русский» → the whole screen and tab bar Russian without reload; `<html lang="ru">` |
| `switch_persists` | switch | after reload the chosen language stays; `localStorage["recipe-book.language"]` set |
| `numbers_en` | formats | recipe card in English shows a decimal point (`12.5`); in Russian a comma (`12,5`) |
| `dates_en` | formats | log entry date `5 Oct 2026` style in English, `05.10.2026` in Russian |
| `calendar_en` | formats | cook-log date picker: English month names, Monday first column; Russian after switching |
| `mutation_error_lang` | switch | a failed save notification (stop the local API or go offline) uses the current language |
| `title_and_manifest` | branding | tab title «Recipe Book»; `dist/manifest.webmanifest` name «Recipe Book», demo build «Recipe Book (demo)» |

Shared blockers: `switch_to_ru`. Independent checks: all others.

**Visual Verification**: N/A

### Phase L4 — Agent instructions in English, Russian read-copies

**Goal**

Everything an agent reads to work in the repo is English and describes the state after L1–L3; the owner keeps a Russian read-copy next to each file; the copies never reach the public repo.

**Budget**

- Operation budget: ~33 files by the canonical count — volume-sized (~9k words), see «Assumptions to confirm»
- Concern budget: docs, config
- Stop condition: Cyrillic search over the English set = 0; every English file has its `-ru.md`; publish dry run excludes all `-ru.md`

**Scope (English set)**: `AGENTS.md`, `plans/README.md`, `docs/agents/architecture.md`, `docs/agents/local-environment.md`, `docs/agents/pipeline-profile.md`, `docs/agents/conventions/{code-style,components,data,i18n,routing,stack,structure,styling,testing,typing}.md` — 15 files. `CLAUDE.md` (`@AGENTS.md`) stays.

**Files to create**

- `<file>-ru.md` next to each of the 15 (`AGENTS-ru.md`, `docs/agents/conventions/i18n-ru.md`, …) — the current Russian text with the same content edits as the English version.

**Files to modify**

- The 15 files — translated, with the content edits below.
- `scripts/publish-exclude.txt` — add `glob:*-ru.md`.

**Implementation details**

1. Start each convention file from the English original it was translated from (`git show bf2a443^:.github/instructions/30-conventions-generic.md`, `40-conventions-project.md`, `00-project.md`) where the text still matches; translate the rest. Do not re-import anything P1 deliberately dropped.
2. Content edits (both languages):
   - `AGENTS.md`: title «Recipe Book — instructions for agents»; intro — UI in English and Russian by browser language ([ADR 0034]); language rule → ADR 0033 (English for instructions, ADRs, comments, developer-facing messages, test names, commit messages, new `plans/` files; reference docs bilingual; `plans/` history Russian); new rule «an English instruction file changes → its `-ru.md` copy changes in the same change; the copy is never read by tools»; gender-neutral rule now says it is about Russian text; mentions of `STATUS.md` / `DEPLOY.md` stay link-less «working repository only» (P5).
   - `docs/agents/conventions/i18n.md`: «Project specifics» — two dictionaries `en.json` and `ru.json`, language detection and storage, `useLanguage`, display formats via `src/utils/helpers/locale.ts`, the key-parity test; the gender-neutral rule for Russian stays, plus a short English style note (neutral, sentence case, glossary from L2).
   - `docs/agents/pipeline-profile.md`: `comments_language: en`; i18n comment → two dictionaries; the YAML comments in English.
   - `docs/agents/conventions/code-style.md` (comments section, if it names the language) and any other mention of «comments in Russian» → English.
   - `plans/README.md`: new plans, reports and reviews in English; existing logs stay Russian; the stale `publication` status line → done, plus a `localization` row.
3. `-ru.md` copies link to the English originals (they are read-aids, not a second doc set) and start with one line saying so.
4. Confirm `git filter-repo` matches `glob:*-ru.md` in subdirectories: run `scripts/publish-public.ps1` without `-Remote` on a temp source with this phase's changes committed (as in P5), then `git ls-files | rg -- "-ru\.md$"` in the result = 0. The script's link check must stay green (no markdown link from a public file to a `-ru.md`).

**Verification**

- `rg -n "[А-Яа-яЁё]" AGENTS.md plans/README.md docs/agents --glob "!*-ru.md"` = 0 matches.
- 15 `-ru.md` files exist; each has the same heading structure as its original (heading count equal — script output in DEV-REPORT).
- Publish dry run as in step 4: no `-ru.md` in the filtered tree, all checks pass.
- `pnpm lint` passes.

**Visual Verification**: N/A

### Phase L5 — Comments in English: non-UI layers of `src/`

**Goal**

Comments, JSDoc, developer-facing messages and test names are English in the non-UI layers.

**Budget**

- Operation budget: ~65 files by the canonical count — volume-sized (~480 lines at planning time), see «Assumptions to confirm»
- Concern budget: code comments
- Stop condition: Cyrillic search over the scope = data-only hits; lint, build, tests green

**Scope (search result, 2026-10-25):** `src/api`, `src/app`, `src/constants`, `src/context`, `src/domain`, `src/hooks`, `src/routes`, `src/theme`, `src/types`, `src/utils`, `src/main.tsx`, `src/vite-env.d.ts` — ~68 files / ~480 Cyrillic lines before L2–L3; files finished in L2–L3 drop out. Command: `rg -l "[А-Яа-яЁё]" src/api src/app src/constants src/context src/domain src/hooks src/routes src/theme src/types src/utils src/main.tsx src/vite-env.d.ts`.

**Implementation details**

1. Comments and JSDoc: translate, keep length and intent (they explain *why*; keep that). Do not add comments, do not delete them.
2. `throw new Error(...)` / `console.*` messages: English. Strings compared with the database (`backup_target_not_empty`, `unknown_category_kind`) are already codes — untouched.
3. Test names (`describe` / `it`) English; Russian test data stays where the test checks Russian text (shared rule).
4. `src/types/database.types.ts` is generated — if it has Cyrillic (from SQL comments), leave it; it changes only via `pnpm db:types`.
5. No code change other than strings in messages and test names: the diff of every file without comments and string literals is empty.

**Verification**

- Re-run the scope command; every remaining hit is data, listed in DEV-REPORT.
- `pnpm lint`, `pnpm build`, `pnpm test` green.

**Visual Verification**: N/A

### Phase L6 — Comments in English: components and pages

**Goal**

Same as L5 for the UI layers.

**Budget**

- Operation budget: ~117 files by the canonical count — volume-sized (~410 lines), see «Assumptions to confirm»
- Concern budget: code comments
- Stop condition: as L5

**Scope (search result, 2026-10-25):** `src/components` (~22 files / ~85 lines), `src/pages` (~95 files / ~327 lines; RecipeEditorPage 120, RecipesPage 67, RecipePage 51, LogPage 29, SettingsPage 26, ProductPage 15, ProductsPage 11, LoginPage 8). Command: `rg -l "[А-Яа-яЁё]" src/components src/pages`.

**Implementation details**: steps 1–5 of L5. If the developer's context runs short, stop after a whole page folder and report `STOPPED_ON_PLAN_GAP` with the remaining folders — the phase is then split by amendment, not silently truncated.

**Verification**: as L5.

**Visual Verification**: N/A

### Phase L7 — Comments in English outside `src/`, migrations

**Goal**

SQL, demo tooling and configs carry English comments; applied migrations change in comments only, proven mechanically.

**Budget**

- Operation budget: ~22 files — volume-sized (~300 comment lines)
- Concern budget: code comments
- Stop condition: Cyrillic search = data-only hits; strip-and-compare check = identical for every migration and `setup.sql`; lint, build, tests green

**Scope:** `supabase/migrations/*.sql` (8 files with Russian comments), `supabase/dev-data.sql` and `supabase/dev-data-cleanup.sql` (comments only), `supabase/demo/{setup.sql,keepalive.ts,_build.ts,upload-photos.mjs,source/_types.ts,__tests__/seed.test.ts}`, `eslint.config.js`. Data files stay (shared rule).

**Implementation details**

1. Strip-and-compare check, run for every `.sql` file in scope: for `HEAD` and the working copy, remove `--` comments to end of line and all whitespace, compare — must be identical. Write it as a throwaway script (scratchpad, not committed); paste its per-file output into DEV-REPORT. A `--` inside a string literal would break the check — none exist at planning time; if one appears, report.
2. `supabase/demo/_build.ts`: if it writes Russian comments into the generated `load-seed.sql`, translate them and regenerate with the existing generator command (`supabase/demo/README.md`); the generated data must not change — `seed.json` and the data part of `load-seed.sql` byte-identical (diff in DEV-REPORT).
3. `setup.sql` is already applied to the demo project; comment-only changes need no re-apply.
4. After the change: `pnpm db:reset` locally succeeds (migrations still apply), then restore the dev data as `docs/agents/local-environment.md` says.

**Verification**

- Strip-and-compare output: identical for all.
- `rg -n "[А-Яа-яЁё]" supabase scripts eslint.config.js vite.config.ts` — only data hits, listed.
- `pnpm db:reset` succeeds; `pnpm lint`, `pnpm build`, `pnpm test` green.

**Visual Verification**: N/A

### Phase L8 — Reference docs bilingual, BACKLOG in English

**Goal**

Reference docs exist as an English main file plus a Russian `.ru.md`; `BACKLOG.md` is English with a Russian read-copy.

**Budget**

- Operation budget: ~14 files — volume-sized (~10k words)
- Concern budget: docs
- Stop condition: Cyrillic search over the English files = data-only; every pair cross-linked; publish dry run green

**Files**

| English (main, modified in place) | Russian (created) |
|---|---|
| `docs/user-guide.md` | `docs/user-guide.ru.md` |
| `docs/manual-checks.md` | `docs/manual-checks.ru.md` |
| `docs/task.md` | `docs/task.ru.md` |
| `supabase/demo/DEPLOY.md` | `supabase/demo/DEPLOY.ru.md` |
| `supabase/demo/README.md` | `supabase/demo/README.ru.md` |
| `supabase/demo/photos/CREDITS.md` | `supabase/demo/photos/CREDITS.ru.md` |
| `BACKLOG.md` | `BACKLOG-ru.md` (read-copy, excluded from the public copy) |

**Implementation details**

1. Russian files: the current text moved as is (`git mv` is not needed — create the `.ru.md` from the current content, then translate the original in place). First line of each file links to its pair, as in `README.md` / `README.ru.md`.
2. `docs/task.md` is the owner's wife's original brief in the first person: translate faithfully, keep the voice; the Russian original is the source of truth and says so in one line.
3. `docs/user-guide.md` describes the UI: use the English labels from `en.json` exactly as they appear on screen; the Russian copy keeps the Russian labels. Mention the language switcher in settings (both languages).
4. `BACKLOG.md`: the «Second UI language» row moves from «Rejected / deferred» to done (ADR 0034); add an idea «English demo seed» (decision: demo data stays Russian for now; trigger — the portfolio shown to English readers with Russian recipes). `BACKLOG-ru.md` mirrors it.
5. Recipe and product names inside `CREDITS.md` stay Russian (data) — add an English gloss in parentheses only if the table stays readable.
6. Links from public English files go to English files; nothing public links to `BACKLOG-ru.md`.

**Verification**

- `rg -n "[А-Яа-яЁё]" docs/user-guide.md docs/manual-checks.md docs/task.md supabase/demo/DEPLOY.md supabase/demo/README.md supabase/demo/photos/CREDITS.md BACKLOG.md` — only data (recipe names, quoted UI strings in Russian only where the guide explains the Russian UI), listed.
- Each pair: first-line cross-links resolve; heading counts equal.
- Publish dry run (as L4 step 4): `.ru.md` files present in the public tree, `BACKLOG-ru.md` absent, link check green.
- `pnpm lint` passes.

**Visual Verification**: N/A

## Conventions to follow

- `AGENTS.md` → «Жёсткие инварианты»: dates stay `YYYY-MM-DD` strings; no new dependencies (`dayjs` is already in `package.json`).
- i18n rules (`docs/agents/conventions/i18n.md`): one `l` per component, narrow selector, keys `^[A-Za-z0-9_]+$`, every key in every dictionary.
- `src/types/i18n.types.ts` exports only `I18n`; `TLanguage` lives in `src/types/language.types.ts`.
- Owner-only: `.env*`, prod, dashboards, commits. The publish dry runs never push.

## Potential gotchas

- `public/dictionaries/*.json` is already in the PWA precache (`vite.config.ts`, `includeAssets`) — `en.json` is picked up without config changes; do not touch that line.
- `I18nProvider` currently sits inside `DatesProvider`; the dates provider needs `useLanguage`, so the order flips in L3. `Notifications` stays outside — its texts come from `getDictionary()` at call time.
- The provider must not show the full-screen Loader on a language switch: that would unmount the router subtree and drop an open form.
- `formatCookDate` and the number formatters are called during render: they must read the language set together with the new dictionary, otherwise one frame shows mixed formats (Approach).
- `en-GB` short month via `Intl` is «Sept» on current ICU — use `dayjs` (L3 step 2).
- Generated files (`database.types.ts`, `load-seed.sql`, `seed.json`) are never hand-edited.
- `filter-repo` glob semantics: `*` in `glob:` crosses `/`; still verify (L4 step 4) rather than assume.

## Deferred follow-ups

- English demo seed — `BACKLOG.md` (L8 step 4).
- Translating historical `plans/` logs — not planned (decision).

## Amendments

## Known issues

### Phase L4, L8 — added 2026-10-25
**Trigger:** L1 review — the translated ADRs quote section names of documents that are still Russian; the translations must use the same names.
**Fix:** when translating, take these names verbatim from the ADRs (or adjust the ADR quote in the same phase if the target wording is clearly better):
- L4: `docs/agents/conventions/data.md` — "Purity of the domain module" (ADR 0017); `docs/agents/conventions/structure.md` — "Placement — one ladder for everything extracted" (ADR 0025); `plans/README.md` — the "Old name → new" table (ADR 0025).
- L8: `BACKLOG.md` section names quoted by ADRs — "Rejected" (ADR 0032; use this name, not "Rejected / deferred" as L8 step 4 says), "Nutrition from a label photo", "Planning assistant", "Recipe import from a screenshot or a link", "Families and multi-tenancy", "Publishing to the stores", "Household inventory". Find every quote with `rg -n "BACKLOG" docs/decisions`.

### Phase L2 — added 2026-10-25
**Trigger:** L2 iter-1 review (`plans/localization/l2/iter-1/REVIEW.md`), `Issue source: plan` — `_I18nContext.tsx` declares two interfaces (`IProps`, `ILoadedDictionary`) with no `_types.ts`; the plan did not allocate one.
**Fix:** drop `ILoadedDictionary` and type the provider state inline, so the file keeps one declaration (`IProps`); no `_types.ts`. In the same iteration: the provider comment about formats switching with the dictionary states that formatters read the display language from L3 on (no claim that is not yet true); remove the redundant `languageValue === null` guard; in `en.json` replace the Russian brand example in `products.addVariantSheet.namePlaceholder` with a neutral English example and reword `settings.importBlock.success` into idiomatic English (placeholders verbatim).

### Phase L3 — added 2026-10-25
**Trigger:** L2 iter-1 review note — after a failed dictionary fetch, choosing the same language again does nothing until reload.
**Fix:** in `LanguageBlock` / the provider, choosing a language whose dictionary failed to load retries the fetch; a failed switch shows nothing new on screen (the current dictionary stays) and logs to the console, as in L2.
