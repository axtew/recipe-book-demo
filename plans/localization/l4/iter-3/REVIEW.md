# REVIEW — Phase L4, iteration 3

Saved by the orchestrator from the reviewer's final message (the reviewer did not write the file).

MODE: review
STATUS: APPROVED
Issue source: none

## Checks

- Fix 1: `docs/architecture.md:130` — "The app works with `activeVariantId`, `kcal100` and `createdAt`; the snake_case names never leave the service." Matches `src/api/services/products.service.ts` (mappings at lines 23, 32, 36).
- Fix 2: ADR 0035 lines 25 and 32 in the future tense, consistent with the plan (L8).
- Fix 3: `docs/agents/conventions/i18n.md:38` — guillemets rule unambiguous.
- Fix 4: diagram left box 26 characters on every row; top block 78 wide.
- Fix 5: `docs/agents/conventions/data.md:34` points to `supabase/demo/DEPLOY.md` (exists); consistent with `local-environment.md:11`.
- Scope: only `docs/architecture.md`, ADR 0035, `i18n.md`, `data.md` changed since iteration 2 (plus orchestrator files).
- Cyrillic search over `AGENTS.md`, `plans/README.md`, `docs/agents`, `docs/architecture.md`, ADR 0035, `docs/decisions/README.md` = 0. `pnpm lint` exit 0. Publish dry run not repeated (no link or exclude-list change).

## Notes (non-blocking)

- Guillemets «…» around quoted section names remain in `AGENTS.md:12,27,67-70`, `plans/README.md:18,19,30,34`, `docs/agents/local-environment.md:40` — carried from the original; the new `i18n.md` rule covers dictionary strings only.
- `docs/architecture.md:32` "Both are visible in DevTools → Application" — harmless, owner's choice.
- `i18n.md` names file anchors likely to rot (`_language.ts`, the test path, …) — raised in iteration 2, left to the owner.
