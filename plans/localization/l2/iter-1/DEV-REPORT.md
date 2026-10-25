Status: COMPLETED

# DEV-REPORT — Phase L2, iteration 1

## Phase goal

Load `en.json` or `ru.json` by browser language or stored choice, switch language at runtime without a reload, expose the language to the app and to non-React formatters.

## What was implemented

- `TLanguage`, `LANGUAGES`, `LANGUAGE_STORAGE_KEY`, `INTL_LOCALES` as in the plan's contract.
- `locale.ts`: module-level display language, default `"ru"`.
- `_language.ts`: pure `detectLanguage` (stored member of `LANGUAGES` wins, then primary `navigator.language` starting with `ru`, else `en`); `readStoredLanguage` / `storeLanguage` wrap `localStorage` in try/catch (unavailable storage is treated as "no choice" / skipped write, like `useRecipeDraft`). Detection never writes.
- `I18nProvider`: requested-language state, per-language fetch with a cancellation guard. On arrival, in order: `storeDictionary`, `setDisplayLanguage`, `document.documentElement.lang`, then React state (dictionary + loaded language). Loader only before the first dictionary; a failed fetch keeps the current dictionary and logs an English `console.error`. `LanguageContext` value is `{ language: <loaded language>, setLanguage }`; `setLanguage` stores the choice and requests the dictionary. `useLanguage()` throws outside the provider.
- `en.json` with all keys of `ru.json` (glossary applied); `settings.language` added to both dictionaries and to `I18n`.
- Tests: key parity of every dictionary in `public/dictionaries/`, `detectLanguage` cases.
- Comments and error messages in all touched files translated to English (`_dictionary.ts`, `_useI18nSelector.ts`, `_I18nContext.tsx`, `i18n.types.ts` doc comments).

## Files created

- `public/dictionaries/en.json`
- `src/types/language.types.ts`
- `src/constants/i18n.constants.ts`
- `src/utils/helpers/locale.ts`
- `src/context/I18nContext/_language.ts`
- `src/context/I18nContext/_languageContext.ts` (also exports `ILanguageContext`, used by `_useLanguage.ts`)
- `src/context/I18nContext/_useLanguage.ts`
- `src/context/I18nContext/__tests__/dictionaries.test.ts`
- `src/context/I18nContext/__tests__/language.test.ts`

## Files modified

- `public/dictionaries/ru.json` — `settings.language` (between `categories` and `account`)
- `src/types/i18n.types.ts` — `settings.language`, `TLanguage` import, doc comments in English
- `src/context/I18nContext/_I18nContext.tsx` — structural rewrite described above
- `src/context/I18nContext/index.ts` — exports `useLanguage`
- `src/context/I18nContext/_dictionary.ts`, `_useI18nSelector.ts` — comments and error message in English

## Verification results

- `pnpm lint`: passed, 0 issues (baseline: 0). One import-order error in the new test was fixed by `pnpm format`.
- `pnpm build`: passed (baseline: exit 0).
- `pnpm test`: passed, 123 tests (baseline 112 + 11 new).
- Cyrillic search over touched code files (`src/context`, `src/types/language.types.ts`, `src/types/i18n.types.ts`, `src/constants/i18n.constants.ts`, `src/utils/helpers/locale.ts`) = 0. Data: `ru.json` and the endonym `Русский` in `en.json` (`settings.language.options.ru`).
- Exports: `getDisplayLanguage`, `INTL_LOCALES`, `useLanguage`, `settings.language` are provisioned for L3 (plan table); `setDisplayLanguage`, `LANGUAGES`, `LANGUAGE_STORAGE_KEY`, `TLanguage`, `detectLanguage`, `readStoredLanguage`, `storeLanguage` have importers in the provider/tests. `ILanguageContext` is imported by `_useLanguage.ts`.
- Live check on the local stack (Docker and Supabase were started by me, dev server on :5173; Chromium driven by a throwaway Playwright script in the scratchpad with a real browser `locale`):
  - `app_boots_en` (`en-US`): login text "Sign in / Email / Password / Sign in", `<html lang="en">` — pass.
  - `app_boots_ru` (`ru-RU`): "Вход / Email / Пароль / Войти", `lang="ru"` — pass.
  - `other_locale_en` (`de-DE`): English, `lang="en"` — pass.
  - `stored_choice_wins` (`localStorage["recipe-book.language"]="ru"`, `en-US`, reload): Russian, `lang="ru"` — pass.
  - `all_screens_en`: after signing in as the dev user, visited recipes, recipe, new recipe, recipe editor, products, product, log, settings, plus the "Log a cook" sheet and the filters sheet. All UI text English; the only Cyrillic is data (recipe, product, category names, step texts, the dev-data note). No `undefined`, `null`, `NaN` or raw keys. Console errors/warnings during the signed-in English session: none — pass.
  - Not exercised: a runtime switch (no UI consumer of `setLanguage` until L3), so the no-Loader-on-switch and stale-response guard are verified by reading only.
- Observed only: dates and numbers are still Russian-formatted in the English UI as the plan states (e.g. "25 октября 2026" in the cook sheet date picker, `5,7` in nutrition) — L3 owns this.
- Observed only: the shared Playwright MCP browser profile logged a pre-existing `refresh_token` 400 and an `idb-keyval` "object store not found" error on the login page, unrelated to this change; the clean-profile script sessions had no console errors.
- Visual Verification: N/A.
- Environment restored: dev server stopped, Supabase stack stopped (no `--no-backup`), Docker Desktop closed (it was not running at the start), `.playwright-mcp` removed. The local database was not written to.

## Known issues / follow-ups

- Plan deviation, test mechanism: the plan says the parity test "runs in Node (`fs`)". `tsconfig.app.json` has `types: ["vite/client"]` only, so `process` / `node:fs` fail `pnpm build` (TS2591) and adding `@types/node` or changing tsconfig is out of scope. The test enumerates `public/dictionaries/*.json` with `import.meta.glob` (eager, no hardcoded list) instead. Behaviour is as specified (recursive key set vs `ru.json`, every leaf a non-empty string); a sanity test asserts at least two dictionaries are found.
- `pnpm format` rewrote line endings of `src/components/Typography/Head/_Head.tsx` (empty content diff); reverted with `git checkout`, so it is not in the change set.
- English apostrophes in `en.json` are typographic (`’`) to match the “…” quotes.
- Planner-drift: none beyond the Node `fs` note above.
