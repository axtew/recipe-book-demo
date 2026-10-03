MODE: review
STATUS: NEEDS_CHANGES
Issue source: code

## Summary
Reviewed Фазу 7.5 (`useForm` port + form primitives) against `Carbon-spa/src/utils/hooks/useForm/`, the plan's nine adaptations and four FIXME requirements, and the three translated consumers. The hook port is faithful and correct — all nine adaptations are present and correctly implemented (in particular #1 required-for-numbers and #8 try/finally-with-prevValue-only-on-success, both verified by reading the code and by the developer's local live run), all four FIXME comments are present, well-written, and free of pipeline residue, `pnpm lint`/`build`/`test` reproduce clean as claimed, `src/api/**`/`src/domain/schemas/**`/`supabase/**`/`database.types.ts` are untouched, and the `styled.select`/Drawer-height-override greps each return exactly one match as claimed. One placement defect: two new form-shape types were left inline in two hook files that already have a dedicated `_types.ts`, which the plan explicitly named as a file to touch.

## Issues

### Code issues

#### TypeScript — Types placement
- [code] `src/components/ProductFormSheet/_useProductForm.ts:9,11` — `TProductFieldName` and `TProductFields` (2 new `type` declarations) are declared inline in the hook file, even though `src/components/ProductFormSheet/_types.ts` already exists right next to it (3 interfaces: `IProductFormSheetProps`, `IUseProductFormProps`, `IUseProductFormResult`). Per conventions → "Placement — one ladder for everything extracted": a file may keep at most one type/interface/enum inline before the ≥2-declarations trigger applies, and "once `_types.ts` exists, all component-local types live there... splitting type blocks between the [component file] and `_types.ts` is exactly what this rule forbids." The plan itself lists `src/components/ProductFormSheet/{_useProductForm.ts,_types.ts}` as the files for this translation — `_types.ts` was named and left untouched, so this is a `code` finding, not a plan gap.
- [code] `src/components/VariantFormSheet/_useVariantForm.ts:9,11` — same issue: `TVariantFieldName`/`TVariantFields` declared inline while `VariantFormSheet/_types.ts` already exists (3 interfaces) and was named in the plan's file list for this exact translation.
- Note: `src/pages/LoginPage/_useLoginForm.ts:7` declares one type (`TLoginFields`, 2 fields) and `LoginPage/` has no `_types.ts` — that one stays correctly inline under the same rule (≤1 declaration, <10 fields).

## Notes
- `_useForm.hook.ts` diverges from the Carbon-spa original in exactly the nine ways the plan enumerates, plus the developer-named, build-forced `SubmitEvent` vs `FormEvent` swap (`@types/react` 19.2, already the project-wide pattern since commit `7966414`) — no unlisted behavior changes found on a line-by-line comparison.
- Adaptation #8 (no form lock-out on failed submit) is exercised concretely: both `ProductFormSheet`/`VariantFormSheet` submit handlers now `throw` on schema-validation failure too (not just mutation failure), which the plan's adaptation only describes for the mutation-failure case. The developer named this extrapolation explicitly in `EXECUTION.md` ("Решения, принятые по ходу", item 5) — a reasonable and correctly-reasoned generalization of the same fix, not a deviation to flag.
- `TUseFormState` intentionally not re-exported from the `useForm` barrel (no current consumer names it) — correct application of export discipline; decision is documented.
- `resetOn` typed `unknown` on the exported `useForm<T>` signature is a legitimate use of the generic-utility exception in Strong typing (compared only via `!==`, never narrowed).
- Verification commands were re-run independently: `pnpm lint` (clean), `pnpm build` (clean, same pre-existing >500kB chunk warning), `pnpm test` (32/32), `grep -c FIXME src/hooks/useForm/_useForm.hook.ts` → 4, `styled.select`/`mantine-Drawer-content` greps → one match each. All match the developer's report.
