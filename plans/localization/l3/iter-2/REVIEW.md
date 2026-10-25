MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Reviewed iteration 2 of phase L3: the fix for the iteration-1 note "radio group semantics". Only `LanguageBlock/_LanguageBlock.tsx` and `LanguageBlock/_styles.ts` changed. The language radios are now inside a `fieldset` (`SGroup`) named through `aria-label={l.title}`, and the visible layout is unchanged. `pnpm lint`, `pnpm build` and `pnpm test` (16 files, 129 tests) pass on re-run.

## Checklist

- Group semantics: `_LanguageBlock.tsx:16` renders `<SGroup aria-label={l.title}>` (a `styled.fieldset`) around the radio list. A fieldset exposes the `group` role, and `aria-label` supplies its name from the existing "Language" key, so the group is now announced. Pass.
- No duplicated visible title: `aria-label` adds no visible node. The `Section` heading is the only visible title, and the hint stays outside the group (`:15`). Pass.
- Visible layout: `Section`'s `SSection` is a flex column with `gap: 12px`. `SGroup` is a flex column with `gap: 12px`, so the 12px between the heading, the hint, the group and each option is the same as before. The fieldset reset (`margin: 0; padding: 0; border: none`) matches the `FiltersSheet` `SSection` precedent. `min-width: 0` neutralises the fieldset default `min-inline-size: min-content`. Pass.
- `aria-label` over a hidden `legend` / `aria-labelledby`: the choice is justified. The project has no visually-hidden utility, and `aria-labelledby` would require an id on the `Section` heading, meaning a change to `Section`. `Section` is untouched. The label reuses the same dictionary key as the heading, so there is no new i18n key and no risk of divergence between the two in either language. Pass.
- Scope: `git status` shows no other source files changed beyond the iteration-1 set. `SGroup` has an importer (`_LanguageBlock.tsx`). The single `l` selector, `name="language"` and the `checked` / `onChange` wiring are unchanged. Pass.
- Conventions: English only, no Cyrillic, no new abstractions, styled-components in the colocated `_styles.ts`, no theme-token violations (no new colours). Pass.

## Verification re-run

- `pnpm lint`: clean. `pnpm build`: passes (generateSW, 10 precache entries). `pnpm test`: 16 files, 129 tests passed. Matches the developer's report.
- Browser verification is not part of this review. The developer did not run a live check either; the change is markup plus CSS resets equal to the existing precedent.

## Notes (non-blocking)

- The duplicated `SOption` between `LanguageBlock/_styles.ts` and `FiltersSheet/_styles.ts` (iteration-1 note) remains. It is still worth lifting into `src/components/` when a third radio list appears. The fieldset reset is now duplicated too, in a smaller form.
- The remaining iteration-1 notes (the ref read inside the `setRequest` updater, no provider test, `localStorage` written before a failed switch) are unchanged and not part of this iteration.
