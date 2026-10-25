MODE: review
STATUS: NEEDS_CHANGES
Issue source: plan

# REVIEW — Phase L2, iteration 1

## Summary

Reviewed the working tree against the L2 contract: provider, language detection and storage, `useLanguage`, `locale.ts`, `en.json`, both tests. `pnpm lint`, `pnpm build` and `pnpm test` (123 passed) were re-run and are green. The implementation is faithful to the plan and the English dictionary is strong. One small structural finding (types placement in the provider file); everything else is a non-blocking note.

## Issues

### Plan issues

#### Types placement (component-local types threshold)

- [plan] `src/context/I18nContext/_I18nContext.tsx:12-19` declares two interfaces (`IProps`, `ILoadedDictionary`) and there is no colocated `_types.ts`. `docs/agents/conventions/structure.md` ("Выход из файла (шаг 1 → 2)") moves types out at 2 or more declarations. The plan marked this file only as "structural" and designated no `_types.ts`, hence `plan`. Smallest fix: either amend the plan to add `src/context/I18nContext/_types.ts` holding both interfaces (props included, all-or-nothing), or drop `ILoadedDictionary` and type the state inline (`useState<{ data: I18n; language: TLanguage } | null>`), which leaves one declaration in the file and needs no amendment.

## Checks that passed

- **Provider logic** (`_I18nContext.tsx`)
  - Initial language is `detectLanguage(readStoredLanguage(), navigator.language)` in a lazy `useState` initialiser; detection does not write.
  - Effect depends on `requestedLanguage` and fetches `/dictionaries/${requestedLanguage}.json`.
  - Order on arrival is as specified: `storeDictionary` -> `setDisplayLanguage` -> `document.documentElement.lang` -> `setLoaded`. It is all synchronous in one callback, so React batches the state update and no render sees a half-switched state.
  - The Loader is rendered only while `loaded === null`. On a switch the previous dictionary stays mounted (the tree is not unmounted).
  - The stale-response guard works: the cleanup sets `isCancelled`, so a fast A -> B -> A switch applies only the last response.
  - StrictMode double-effect: the first fetch is cancelled, the second applies. Correct.
  - A failed fetch (including a non-JSON body) lands in `.catch`, logs an English `console.error`, and leaves the current dictionary, display language and `<html lang>` untouched.
  - `LanguageContext` carries `loaded.language` (the shown language), not the requested one. `setLanguage` calls `storeLanguage` then sets the requested language.
- **`detectLanguage`**: a stored value wins only if it is a `LANGUAGES` member (narrowed through `LANGUAGES.find`, no cast); then primary `navigator.language`, lower-cased, `startsWith("ru")`; otherwise `en`. Storage access is wrapped in try/catch, mirroring `useRecipeDraft`. Tests cover case-insensitivity, empty string, an unknown stored value and stored-vs-browser precedence.
- **Types and layout**: `TLanguage` is in `src/types/language.types.ts`; `i18n.types.ts` still exports only `I18n` and uses `Record<TLanguage, string>` for the options. Constants match the plan contract, including `Record<TLanguage, string>` for `INTL_LOCALES`.
- **`locale.ts`** mirrors `_dictionary.ts`, defaults to `"ru"`, and lives in `utils` (no `utils` -> `context` import).
- **Exports**: every new export has an importer or is listed in the plan's "Provisioned for later phases" table (`getDisplayLanguage`, `INTL_LOCALES`, `useLanguage`, `settings.language`). `ILanguageContext` is imported by `_useLanguage.ts`.
- **i18n shape**: `settings.language` exists in both dictionaries and in `I18n`. The barrel exports `useLanguage` only.
- **`en.json`** (279 leaves, compared programmatically and read in full against `ru.json`)
  - Key parity is exact: no missing and no extra keys.
  - Every `{placeholder}` is identical to the Russian value.
  - No Cyrillic except the `Русский` endonym; no leftover Russian quotes («…» -> “…”).
  - The glossary is applied consistently: kcal/P/F/C, product list, variant/active, yield, "Log a cook", "Finished", archive/archived, freezer/fridge, draft, backup/export/import.
  - "label: count" strings are bare labels (`variants`, `Total recipes`, `Found`). Sentence case throughout, impersonal tone, natural phrasing.
  - Typographic apostrophes (`’`) are consistent with the “…” quotes.
- **Deviation `import.meta.glob` instead of `fs`**: accepted. The glob pattern is the folder (`public/dictionaries/*.json`), so there is no hardcoded file list and a new language is covered automatically. It runs under vitest (Vite transforms it; the 123-test run proves it) and avoids the TS2591 build error, since `tsconfig.app.json` has `types: ["vite/client"]` only. The two sanity tests (reference file present, more than one dictionary) guard against an empty glob. Behaviour equals the plan: recursive key set vs `ru.json`, every leaf a non-empty string.
- **Verification commands**: the report names `pnpm lint`, `pnpm build`, `pnpm test`; all three were re-run here with the same results. The PWA precache picks up `en.json` (`dictionaries/*.json` in `vite.config.ts`; `en.json` is present in `dist/sw.js`).
- **Comments**: all new and changed comments are English, state purpose first, and carry no pipeline residue. Cyrillic search over the touched code files = 0 (apart from the `Русский` data string in `en.json`).

## Notes

- **Provider comment ahead of the code.** The `I18nProvider` doc comment says the format language changes in the same step "so no frame mixes English labels with Russian numbers". Today no formatter reads `getDisplayLanguage()` yet (the plan says numbers and dates stay Russian until L3), so the sentence becomes literally true only after L3. Not blocking; worth re-reading when L3 lands.
- **No retry on the same language after a failed fetch (for L3 to consider).** If the fetch for `ru` fails, `requestedLanguage` is `ru` while `loaded.language` stays `en`, and the choice is already stored. In L3 the radios are checked by `useLanguage().language` (`en`), so tapping "Русский" again calls `setRequestedLanguage("ru")` with the same value, the effect does not re-run, and nothing happens until a reload. This follows the plan ("keeps the current dictionary, logs"), so it is not a defect of L2; L3 may want to handle it or accept it.
- **Redundant guard.** `_I18nContext.tsx:68` checks `loaded === null || languageValue === null`; `languageValue` is `null` exactly when `loaded` is, so the second operand only serves type narrowing. A single `loaded === null` check with the memo computed after it, or a non-null memo, would read simpler. Cosmetic.
- **Placeholder parity is not tested.** The parity test checks keys and non-empty strings, as the plan specifies, but not that `{placeholder}` sets match between dictionaries. I checked it by script and all match; a future dictionary edit could drift silently. Optional hardening, outside the L2 contract.
- **`products.addVariantSheet.namePlaceholder`** keeps a Russian brand ("Prostokvashino") as the example in the English text. Reasonable as demo data stays Russian; the owner may prefer a neutral English example.
- **Count-style strings with fixed word order.** `settings.importBlock.success` ("Imported: products — {products}, recipes — {recipes}, …") mirrors the Russian structure rather than reading as idiomatic English ("Imported {products} products, …"). Placeholders allow either; low priority.
- **Page-specific exports without external consumers**: none found.
