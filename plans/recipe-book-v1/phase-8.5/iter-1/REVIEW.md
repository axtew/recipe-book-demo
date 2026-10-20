MODE: review
STATUS: APPROVED
Issue source: none

## Summary
Reviewed the working-tree diff against HEAD (07f5b21) plus the untracked files for Phase 8.5 (shared `STextInput`/`STextArea`, `z.httpUrl()`, `createId`, `areDraftsEqual` tests, `blurOnEnter`, `finishDraft`). All six plan items are implemented as specified; no code or plan defects found, only non-blocking notes.

Verification re-run by the reviewer: `pnpm lint` - clean (eslint, no output); `pnpm build` - passes (only the pre-existing chunk-size warning); `pnpm test` - 4 files, 44 tests, all pass. Matches the developer's report.

## Notes

Focus points requested by the owner:
- **Enter / blur and portal trap** (`src/pages/RecipeEditorPage/_helpers.ts:379`): correct. `currentTarget.contains(target)` skips events from the portal sheets; textarea, checkbox/radio/file/button types, IME (`isComposing`) and `defaultPrevented` are skipped. The `submit` bubbling through the portal is separately guarded by the existing `event.target !== event.currentTarget` check in `_useRecipeSave.ts:41`, so Enter in a sheet creates the product and does not save the recipe. `enterKeyHint="done"` is on all single-line editor inputs (name, three number fields, two storage fields, grams, video URL).
- **finishDraft vs clearDraft** (`src/hooks/useRecipeDraft.hook.ts:100`): correct. `finishDraft` sets `isFinishedRef` then runs `clearDraft`; both `saveDraft` and `writePending` (hence the `pagehide`/unmount flush) are gated by the flag. `clearDraft` is untouched and `DraftPrompt` "start over" (`_RecipeEditorPage.tsx:66`) still uses it, so writing continues. Prop renamed `clearDraft` -> `finishDraft` consistently through `_types.ts`, `_useRecipeEditor.ts`, `_useRecipeSave.ts`.
- **createId** (`_helpers.ts:339`): `bytes[6] = (b & 0x0f) | 0x40`, `bytes[8] = (b & 0x3f) | 0x80` - correct v4 / RFC 4122 variant bits; 8-4-4-4-12 grouping correct. Test validates the fallback with `z.uuid()` (which checks version and variant) and uniqueness. All three `crypto.randomUUID()` calls replaced (grep finds the only remaining one inside `createId`).
- **Shared fields vs Select precedent**: `TextInput/` and `TextArea/` mirror `Select/` (`_styles.ts` + `index.ts`, `S`-prefixed styled export). Placement is on the right rung (consumers in several features -> `src/components/`). `textFieldStyles` is exported from the `TextInput` barrel and has a real importer (`TextArea/_styles.ts`), so it passes export discipline. The 16px/Safari comment now exists once in TextInput (plus Select's own, which is out of scope per the plan). No `styled.input` with border/16px remains (grep confirms; the remaining `styled.input` are the checkbox/switch).
- **No styling regression**: compared the five removed `styled.input` blocks (ProductFormSheet, VariantFormSheet, LoginPage, ProductsPage `SSearch`, RecipeEditorPage) - all byte-identical to `textFieldStyles`, no local differences lost. The removed `STextarea` declarations are all preserved in `STextArea` after the shared fragment (`min-height: 88px`, `padding: 10px 12px`, `font-family: inherit`, `resize: vertical`); cascade order is correct, so the overrides win. `ProductsPage` keeps `type="search"`.

Other observations (non-blocking, no action required):
- `blurOnEnter` relies on `nativeEvent.isComposing`; in Safari the keydown that ends an IME composition can report `false`. Irrelevant for the Russian keyboard, mentioned only because iOS is the reference platform.
- Enter on a checkbox/switch inside the editor form still does implicit submission (they are deliberately excluded from `blurOnEnter`). Plan scope is "single-line field (`input`)", and iOS has no Enter on a checkbox, so this is consistent with the plan.
- `finishDraft` is called before `await navigate(...)`; if `navigate` ever rejected, the catch would show the submit error while drafts stay disabled for that mounted editor. Theoretical, and the error message is already misleading in that case before this phase.
- `RecipeEditorPage/_helpers.ts` is now 262 lines; it is a helpers module, not a render body, so the size rule does not apply, but a split would be the next step if it grows.
- No test covers `blurOnEnter` or `useRecipeDraft.finishDraft`; the plan did not require them (tests were required for items 2-4 only).
- `recipeDraftSchema` untouched, `useForm` / `useRecipePhotoUrl` untouched - as the plan demands.
- Comments checked: all new/changed comments state purpose first, carry no pipeline residue, and match the code behaviour.
- Page-specific exports: no new non-component re-exports in page folders; `createId`/`blurOnEnter` both have importers outside `_helpers.ts`.
- Not verified by me (browser pass not in scope): visual parity of login/search/sheets and the iPhone behaviour, as the developer also stated.
