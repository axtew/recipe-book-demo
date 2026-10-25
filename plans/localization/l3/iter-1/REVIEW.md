MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Reviewed phase L3 (formats, language switcher, product name, retry amendment) as a working-tree diff plus the untracked files. `pnpm lint`, `pnpm build`, `pnpm build:demo` and `pnpm test` (16 files, 129 tests) pass on re-run, matching the report. Every checked point of the contract is met; only non-blocking notes remain.

## Verification re-run

- `pnpm lint` clean; `pnpm build`, `pnpm build:demo` pass; `pnpm test` 129 passed. The dist manifest after `build:demo` reads `Recipe Book (demo)` / `Recipes demo`, `lang: en`, the English description.
- Cyrillic search over all touched and created files: 0 hits. The `"ru"` literals left in `locale.ts`, `nutrients.ts` and `language.types.ts` are language codes, not text.
- The `includeAssets` line in `vite.config.ts` is untouched (only comments around it changed).

## Checklist against the task

- Formatters (`nutrients.ts`): one `Intl.NumberFormat` set per `TLanguage` from `INTL_LOCALES`, picked by `getDisplayLanguage()` on each call. `Record<TLanguage, IFormats>` is enum-typed like its siblings. `formatKcal` unchanged. Tests cover `1,234.5`, `×1.5`, `12.5`, `3.0` in English and `1 234,5`, `×1,5` in Russian; `afterEach` restores `"ru"`. Pass.
- `formatCookDate`: `dayjs(date).locale("en").format("D MMM YYYY")` gives `5 Oct 2026` and `30 Sep 2026` (no "Sept", tested). Parsing is local, so there is no timezone shift and no Date arithmetic. Russian branch unchanged. Pass.
- `LocalizedDatesProvider`: sits inside `I18nProvider` in `App.tsx`, takes `locale` from `useLanguage().language`, `firstDayOfWeek: 1`. `Notifications` stays outside the i18n provider (it reads `getDictionary()` at call time). `import "dayjs/locale/ru"` is still in `main.tsx`. Pass.
- `LanguageBlock`: `Section` + `B2` hint + one radio per `LANGUAGES` member, `name="language"`, `checked` is the loaded language, `onChange` is `setLanguage`, so the switch is immediate. One `l`, a narrow selector (`l.settings.language`), no renamed argument, no destructuring. The row has `min-height: 44px` and a 20px input, the same shape as the `FiltersSheet` `SOption`. Mounted after `CategoriesEditor`, before the account block. The `en` and `ru` dictionaries both have `settings.language` with the same keys. Pass.
- Retry amendment: the state is `{ language, attempt }`. `setLanguage` returns the previous object (no re-render, no refetch) when the same language is chosen and no failure is recorded, and bumps `attempt` otherwise, so the effect re-runs. Traced the cases:
  - A switch fails (the radio stays on the loaded language, so a second click fires `onChange`): the retry refetches.
  - A click while a request is pending: no-op.
  - A superseded request that fails: the `!isCancelled` guard keeps it from touching the ref.
  - Success: the ref is cleared, and the dictionary, display language and `<html lang>` are set in one step.
  - Loop: nothing sets state from the effect on failure, so there is no refetch loop.
  - `loading`: the Loader appears only while `loaded === null`, so a switch never unmounts the tree.
  - `useLanguage().language` is still the loaded language. Pass.
- `index.html`: `lang="en"`, `<title>Recipe Book</title>`. Manifest: prod `Recipe Book` / `Recipe Book`, demo `Recipe Book (demo)` / `Recipes demo`, English description, `lang: "en"`. Pass.
- Conventions: English comments (ADR 0033), exports each have an importer (`LanguageBlock`, `LocalizedDatesProvider`; `INTL_LOCALES`, `getDisplayLanguage`, `useLanguage` are now consumed), no new dependencies (`dayjs` is already a dependency), the `IFormats` type is a single declaration and not exported. Pass.

## Notes (non-blocking)

- Radio group semantics: `FiltersSheet` wraps its radio group in `fieldset` + `legend`, while `LanguageBlock` renders the radios loose under the `Section` heading, so assistive tech gets no group name. The plan did not ask for a fieldset; consider it if accessibility matters on this screen.
- Duplicated `SOption`: `LanguageBlock/_styles.ts` repeats the 14-line `SOption` from `RecipesPage/.../FiltersSheet/_styles.ts` verbatim. This follows the plan's file list, and the ladder in `structure.md` puts an entity with consumers in two pages at the global level. The next radio list is the moment to lift it into `src/components/`.
- `_I18nContext.tsx:69-73`: `setLanguage` reads `hasFailedRef.current` inside the `setRequest` updater. The result is deterministic (also under StrictMode double invocation) and lint accepts it. Reading the ref outside the updater would keep the updater pure. The ref is global rather than per-language, which is fine for two languages. After a failure, repeated clicks on the failed language during a pending retry cancel and restart the fetch, which is harmless.
- No unit test for the retry behaviour; the plan required only formatter tests and the developer checked it live (reject once, second click switches). Provider logic is not covered by any test in the project, so this is consistent.
- Pre-existing from L2, unchanged: a failed switch leaves the new language already written to `localStorage`, so a reload applies it.
- Russian calendar month and weekday names were not opened in the live check (the Russian button caption was); the path is the same `locale = language` wiring, so the risk is low.
