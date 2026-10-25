Status: COMPLETED

# Phase L3, iteration 2 (fix after review)

## Phase goal
Fix the non-blocking review note: the language radios in `LanguageBlock` had no accessible group name.

## What was implemented
- The radios are wrapped in a `fieldset` (`SGroup`) with `aria-label={l.title}`. A fieldset exposes the `group` role, and `aria-label` supplies its name from the existing "Language" title key.
- Why `aria-label` and not a visually hidden `legend` or `aria-labelledby`:
  - The project has no visually-hidden utility, so a hidden legend would need new shared CSS.
  - `aria-labelledby` would need an id on the `Section` heading, which means editing `Section`.
  - `aria-label` touches only LanguageBlock. The name is the same string as the visible `Section` heading, so nothing is duplicated visually.
- `SGroup` reset styles mirror `FiltersSheet`'s `SSection` (margin/padding 0, no border, flex column) plus `gap: 12px` and `min-width: 0`. The 12px gap matches the `Section` gap, so the visible layout is unchanged. The hint stays outside the fieldset.
- `Section` was not touched.

## Files created
(cumulative, unchanged) src/app/_LocalizedDatesProvider.tsx; src/pages/SettingsPage/_internal/LanguageBlock/{index.ts,_LanguageBlock.tsx,_styles.ts}; src/utils/__tests__/nutrients.test.ts

## Files modified
(cumulative) index.html; src/app/App.tsx; src/context/I18nContext/_I18nContext.tsx; src/pages/SettingsPage/_SettingsPage.tsx; src/utils/__tests__/dates.test.ts; src/utils/helpers/dates.ts; src/utils/helpers/nutrients.ts; vite.config.ts. This iteration changed only LanguageBlock/_LanguageBlock.tsx and LanguageBlock/_styles.ts (added `SGroup`).

## Verification
- Prettier was run on the LanguageBlock folder only. `pnpm lint`: passed. `pnpm build`: passed. `pnpm test`: 16 files, 129 tests passed.
- Exports: `SGroup` is imported by `_LanguageBlock.tsx`.
- Runtime/browser: not performed by the developer. The live check was skipped; the change is structural markup plus CSS resets equal to the FiltersSheet precedent, and the layout gap was kept at 12px.
- `plans/localization/EXECUTION.md` was not touched.

## Known issues / follow-ups
None.
