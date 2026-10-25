Status: COMPLETED

# Phase L3 — Formats, settings switcher, product name (iter 1)

## Phase goal

Numbers, cook-log dates and the calendar follow the UI language; the settings page has an immediate, persistent language switcher; the product is called "Recipe Book". Plus the L3 amendment: choosing a language whose dictionary failed to load retries the fetch.

## What was implemented

- `nutrients.ts`: one `Intl.NumberFormat` set per language (`INTL_LOCALES`), picked by `getDisplayLanguage()` on every call. `formatKcal` unchanged.
- `dates.ts`: `formatCookDate` returns `DD.MM.YYYY` for `ru` as before; for `en` it returns `D MMM YYYY` via `dayjs(date).locale("en")` (no `Intl` month names, so no "Sept").
- `LocalizedDatesProvider` (`DatesProvider` with `locale = useLanguage().language`, `firstDayOfWeek: 1`). `App.tsx` now nests it **inside** `I18nProvider`; `Notifications` stays outside.
- `LanguageBlock` in settings (after `CategoriesEditor`, before the account block): `Section` + hint + one radio per `LANGUAGES` member, `name="language"`, checked = loaded language, immediate `setLanguage`. Option row has `min-height: 44px`.
- Retry (amendment): `I18nProvider` keeps the request as `{ language, attempt }`; `setLanguage` bumps `attempt` only when the same language is requested again after a failed load (tracked by a ref set in the fetch `catch` and cleared on success), which re-runs the fetch effect. A failed switch keeps the current dictionary and only logs to `console.error`. Since the radio is checked by the loaded language, clicking the failed language fires `onChange` again, so `LanguageBlock` needed no change.
- `index.html`: `lang="en"`, title "Recipe Book". `vite.config.ts`: manifest `name`/`short_name` "Recipe Book"; demo "Recipe Book (demo)" / "Recipes demo"; `description` "Product list, recipes with nutrition totals, cooking log"; `lang: "en"`; comments English.
- Tests: `nutrients.test.ts` (new, ru and en formats), `dates.test.ts` (names English, en cases incl. September); both restore `"ru"` after each test.

## Files created

- `src/app/_LocalizedDatesProvider.tsx`
- `src/pages/SettingsPage/_internal/LanguageBlock/index.ts`
- `src/pages/SettingsPage/_internal/LanguageBlock/_LanguageBlock.tsx`
- `src/pages/SettingsPage/_internal/LanguageBlock/_styles.ts`
- `src/utils/__tests__/nutrients.test.ts`

## Files modified

- `src/app/App.tsx` (provider order, English comments)
- `src/utils/helpers/nutrients.ts`, `src/utils/helpers/dates.ts`
- `src/utils/__tests__/dates.test.ts`
- `src/pages/SettingsPage/_SettingsPage.tsx` (mounts `LanguageBlock`, English comment)
- `src/context/I18nContext/_I18nContext.tsx` (retry per the amendment; allowed by it)
- `index.html`, `vite.config.ts`

Cyrillic search over all touched files: 0 hits. `src/app/_queryClient.ts` and `src/main.tsx` still have Russian comments; they were not touched and belong to L5.

## Verification

Commands: `pnpm lint` (passed, 0 warnings; one import-order error and one exhaustive-deps warning of mine fixed), `pnpm build` (passed), `pnpm build:demo` (passed), `pnpm test` (16 files, 129 tests passed; baseline 112), prettier check on touched paths clean. Exports: `LanguageBlock`, `LocalizedDatesProvider` each have an importer; `getDisplayLanguage`, `INTL_LOCALES`, `useLanguage`, `settings.language` keys provisioned by L2 are now consumed. Baseline had no pre-existing issues.

Live check (local Supabase; the stack was stopped, I started it with `npx supabase start`; dev server `pnpm dev`; Playwright browser locale `ru-RU`, steps were driven via `browser_evaluate`/clicks; the dev user was already present):

| check_id | result | observed |
| --- | --- | --- |
| `switch_to_ru` | pass | Settings -> "Русский": tab bar and heading Russian without reload, `<html lang="ru">`, `localStorage["recipe-book.language"]="ru"`. English direction also checked (nav "Recipes / Products / Log / Settings", `lang="en"`) |
| `switch_persists` | pass | with `localStorage` = `en` and browser `ru-RU`, reload of `/settings` shows English UI and `lang="en"` |
| `numbers_en` | pass | recipe page in English `5.7 / 7.7 / 2.1`; in Russian `5,7 / 7,7 / 2,1` |
| `dates_en` | pass | "Last time 25 Oct 2026" in English, "В последний раз 25.10.2026" in Russian (one cook log entry created through the UI) |
| `calendar_en` | pass | picker header "October 2026", weekday row Mo Tu We Th Fr Sa Su (Monday first); date button "25 October 2026" in English, "25 октября 2026" in Russian |
| `mutation_error_lang` | pass | `supabase_kong_recipe-book` stopped: English "Couldn’t save the changes", Russian "Не удалось сохранить изменения" (the Russian run also shows the sheet's own "Не удалось записать готовку"); container restarted afterwards |
| `title_and_manifest` | pass | tab title "Recipe Book"; `dist/manifest.webmanifest` after `pnpm build`: "Recipe Book"/"Recipe Book", `lang: en`; after `pnpm build:demo`: "Recipe Book (demo)"/"Recipes demo" (the dist folder now holds the prod build) |
| retry (amendment) | pass | `fetch` of `/dictionaries/ru.json` rejected once: UI stays English, 1 call; clicking "Русский" again: 2nd call, UI switches to Russian |

Not verified: the Russian calendar month/weekday names were not opened (the Russian `DatesProvider` locale uses the same `locale = language` path; date button text confirmed Russian).

Cleanup: the test cook log row deleted from local `cook_logs` (count 0, as before); kong container running again; dev server stopped; `.playwright-mcp` removed. The local Supabase stack is left running (it was down when I started). The idb-keyval "object store not found" console error in the dev browser profile is pre-existing and unrelated.

## Known issues / follow-ups

- `pnpm format` reformatted `src/components/Typography/Head/_Head.tsx` (line endings only); I reverted it with `git checkout`. The pre-existing CRLF/LF drift there is untouched.
- Plan drift, minor: step 3 text lives partly in the plan's L2-era statement "formats from L3 on"; nothing to do. The plan's `LanguageBlock` description said "SOption in FiltersSheet/_styles.ts" as a reference; I duplicated the 14-line styled label locally as the plan's file list requires (`_styles.ts`), rather than sharing it across page folders.
- Prod build vs. demo: demo `short_name` "Recipes demo" per the confirmed assumption.
