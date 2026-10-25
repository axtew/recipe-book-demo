MODE: review
STATUS: APPROVED
Issue source: none

# REVIEW - Phase L2, iteration 2

## Summary

Re-reviewed the four amendment points on top of the iteration-1 state. All four are resolved, nothing else regressed, and `pnpm lint`, `pnpm build` and `pnpm test` (15 files / 123 tests) were re-run here and are green. The working tree lists only phase files.

## Amendment points

1. **Types placement.** `ILoadedDictionary` is gone (no matches in `src`). `src/context/I18nContext/_I18nContext.tsx:31` types the state inline as `useState<{ data: I18n; language: TLanguage } | null>`. The file declares one interface (`IProps`, line 13), so the "2+ declarations" threshold is not met. There is no `_types.ts` in the folder. Resolved.
2. **Provider comment.** `_I18nContext.tsx:17-26` now says only that the display language and `<html lang>` are set in the same step as the dictionary. That is literally true (`storeDictionary`, `setDisplayLanguage`, `document.documentElement.lang`, `setLoaded` in one synchronous callback, lines 40-43). The claim about numbers and labels not mixing is gone. Resolved.
3. **Redundant guard.** The only early return is `if (loaded === null)` (line 66). `languageValue` is a non-null object memoised on `loadedLanguage = loaded?.language ?? requestedLanguage` (lines 60-64). Verified:
   - The memo and callback hooks run before the early return, so hook order is stable across loading and loaded renders.
   - While `loaded === null` the Loader is returned and `LanguageContext.Provider` is not rendered, so no consumer can observe the `requestedLanguage` fallback. Once `loaded` is set, `loadedLanguage` equals `loaded.language`.
   - After a switch, `requestedLanguage` changes immediately but `loaded` keeps the old value until the new dictionary arrives, so `useLanguage().language` still returns the loaded language, not the requested one. This is the intended semantics; `_useLanguage.ts` throws a message that matches ("outside I18nProvider or before the dictionary is loaded").
   - The `?? requestedLanguage` branch only serves typing and is unobservable. Fine.
   Resolved.
4. **`en.json` wording.**
   - `products.addVariantSheet.namePlaceholder` (line 85): `For example, “Greek yogurt”`. Neutral, idiomatic, no Russian brand, typographic quotes consistent with the rest of the file.
   - `settings.importBlock.success` (line 352): `Imported {products} products, {recipes} recipes and {cookLogs} log entries`. Idiomatic; `{products}`, `{recipes}`, `{cookLogs}` are verbatim and match the Russian value's placeholder set.
   Resolved.

## Regression checks

- `git status`: modified `ru.json`, `_I18nContext.tsx`, `_dictionary.ts`, `_useI18nSelector.ts`, `index.ts` (I18nContext), `i18n.types.ts`; new `en.json`, `i18n.constants.ts`, `__tests__/`, `_language.ts`, `_languageContext.ts`, `_useLanguage.ts`, `language.types.ts`, `locale.ts`, `plans/localization/l2/`. Plan.md and EXECUTION.md are staged orchestrator files. No unrelated file is modified, so the `git checkout` restore after the repo-wide `pnpm prettier` run was complete. `git diff --stat` shows 6 modified files, all phase files.
- `ru.json` diff is still only the added `settings.language` block (8 lines). Key parity and the placeholder set of `en.json` remain covered by the parity test, which passes.
- Exports: `useLanguage` has its barrel export and is provisioned for L3; `getDisplayLanguage` is likewise provisioned. No new importer-less exports appeared.

## Notes

- `plans/localization/l2/iter-2/DEV-REPORT.md` was not on disk when this review started (the iter-2 folder did not exist; it was created for this file). The developer's report text was received inline, so this does not affect the verdict, but the orchestrator may want to persist it.
- Carried over from iteration 1, still non-blocking: no retry after a failed fetch for the same language (L3 may want to handle it), and placeholder parity between dictionaries is not asserted by a test (only keys and non-empty strings).
