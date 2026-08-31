MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Iteration 3 closes the last open Фаза 2 verification item (unit test for `readEnvVar`'s contract) exactly as the amended plan (`c3d9e93`) prescribes. The diff is minimal (one line export visibility change + one new test file), all three verification commands (`pnpm test`, `pnpm lint`, `pnpm build`) pass cleanly when re-run independently, and the test genuinely exercises the absent-key branch rather than faking it. No scope creep into Фаза 3, no owner-only paths touched, no dependency or config drift. Phase 2 is done.

## Verification re-run (independent)

- `pnpm test run` → `Test Files 1 passed (1)`, `Tests 3 passed (3)` — matches the report.
- `pnpm lint` → clean, no output.
- `pnpm build` (`tsc -b && vite build`) → clean, PWA precache generated (`dist/sw.js`, `dist/workbox-*.js`); `dist/` is gitignored and left no residue in the working tree after cleanup.
- `git status --porcelain` after all three runs: only `M src/utils/env.ts`, `?? plans/recipe-book-v1/phase-2/iter-3/`, `?? src/utils/__tests__/` — nothing stray survives from the developer's prettier incident or from my own command runs.
- `npx prettier --check src/utils/env.ts src/utils/__tests__/env.test.ts` → both already canonical, confirming the report's formatting claim independently.
- `pnpm-lock.yaml` untouched — no dependency was added, consistent with the closed Фаза 2 dependency list.

## Checklist results

**1. Test coverage / genuineness of the absent-key case.** Confirmed by reading `node_modules/.pnpm/vitest@4.1.11.../vitest/dist/chunks/test.DNmyFkvJ.js`: `stubEnv(name, value)` does `if (value === void 0) delete env[name]` — `vi.stubEnv("VITE_SUPABASE_URL", undefined)` (`src/utils/__tests__/env.test.ts:11`) genuinely deletes the key from the object vitest substitutes for `import.meta.env`, reproducing Vite's real "key absent" static-object behaviour rather than simulating it with `""` or a `some: undefined` property assignment (which would leave the key present with value `undefined`, not absent — a different, weaker case). The type signature `stubEnv: <T extends string>(name: T, value: T extends "PROD"|"DEV"|"SSR" ? boolean : string | undefined) => VitestUtils` accepts `undefined` for a non-boolean key without a cast, so no `as` was needed either.
Regression check: if `readEnvVar` reverted to the old `value.length === 0` check, case 1 (`env.test.ts:10-16`) would throw `TypeError: Cannot read properties of undefined (reading 'length')` instead of the Russian message, and `toThrowError("Переменная окружения VITE_SUPABASE_URL не задана")` would fail — the test would genuinely catch the exact regression this whole plan amendment exists to prevent. All three cases (absent, empty string, present) map 1:1 onto the plan's three bullets at `plan.md:521-523`.

**2. `readEnvVar` export.** `src/utils/env.ts:6` diff is exactly `function` → `export function`, nothing else touched (confirmed via `git diff -- src/utils/env.ts`). The only new importer is `src/utils/__tests__/env.test.ts:3` — satisfies "an export needs an importer, not a hope" with the importer landing in the same change. `env`'s public shape (`IEnv`, the two keys) and the `typeof value !== "string" || value.length === 0` check are byte-identical to before.

**3. Test placement/naming.** `src/utils/__tests__/env.test.ts` mirrors the plan's own Фаза 4 precedent (`src/domain/nutrition/__tests__/calculate.test.ts`, `plan.md:552`) exactly: `__tests__/` sibling folder, `<subject>.test.ts` naming. No drift.

**4. No dependency/config additions.** `vitest` was already in the closed Фаза 2 dependency list (`plan.md:509`); `pnpm-lock.yaml` is untouched; no `vitest.config.ts` was added and no `test` block exists in `vite.config.ts` (checked directly) — `pnpm test` picks up the file purely by the `*.test.ts` glob convention, and `tsc -b` type-checks it via the pre-existing `"include": ["src"]` in `tsconfig.app.json`. The report's claim that no extra wiring was needed is verified, not just asserted.

**5. Prettier incident cleanup.** `git status --porcelain` shows only the expected three entries — no leftover reformatted `.md` files, nothing under-reverted. Directly spot-checked `src/utils/env.ts` and `src/utils/__tests__/env.test.ts` against `prettier --check` myself: both are canonical, so the revert didn't clobber needed formatting either. The command-definition trap is real: `package.json:11` is `"prettier": "prettier --write ."` — the script hardcodes `.` as the target and does not consume forwarded positional args the way the caller might expect (prettier CLI treats forwarded paths as additional positional globs, not a replacement of `.`), so `pnpm prettier --write <files>` as templated in `.github/pipeline-profile.md:19` always reformats the whole repository regardless of `<files>`. This is a documentation/tooling mismatch between the profile and the actual script — it predates this iteration (neither file is in this iteration's diff) and isn't something the developer could fix inside phase scope, so it is not a blocking issue for this phase; see Notes for the routing rationale.

**6. Scope discipline.** `git status --porcelain` confirms no Фаза 3 files (routes, `AppLayout`, `TabBar`, `LoginPage`, `useAuth`) and no owner-only paths (`supabase/**`, `.env`, `src/types/database.types.ts`, `src/api/repositories/**`) were touched.

## Notes (optional)

- The `pnpm prettier` command-definition mismatch (`.github/pipeline-profile.md:19` vs `package.json:11`) is worth the owner fixing at some point — either the profile should read `pnpm prettier` with no file args (since the script ignores scoping anyway), or the script should become `prettier --write` (no `.`) so forwarded paths actually scope it. It isn't classified as a Phase 2 `code`/`plan` issue: it's not part of this iteration's diff, the developer caught it live, diagnosed it correctly, and fully reverted the collateral damage before finishing — exactly the right handling of a tooling trap discovered mid-task.
- Phase 2 is genuinely complete: all three iterations' findings have been resolved (iter-1/iter-2 issues per their own REVIEW.md, and this iteration's single remaining item). No new findings to manufacture here.
