# DEV-REPORT — Phase L4, iteration 3

Saved by the orchestrator from the developer's final message (the developer did not write the file).

Status: COMPLETED

## Fixes (from `plans/localization/l4/iter-2/REVIEW.md`)

1. `docs/architecture.md`: the false claim that the app "does not know `created_at` at all" removed; the text now says the app works with `activeVariantId`, `kcal100` and `createdAt`, and the snake_case names never leave the service (`products.service.ts` maps `created_at` → `createdAt`). `updated_at` not used as the example — `recipes.service.ts` reads it for the photo URL.
2. ADR 0035: `BACKLOG-ru.md` and its exclude-list entry described as arriving in L8 (future tense).
3. `docs/agents/conventions/i18n.md`: "Guillemets (« ») used in Russian text become plain double quotes in English text."
4. `docs/architecture.md` diagram: `│ Cache Storage — code   │`; all 7 rows of the left box end at the same column.
5. `docs/agents/conventions/data.md`: the stale `.env.demo` wording ("the owner fills the values in when the project is created") replaced by a pointer to `supabase/demo/DEPLOY.md`; no other file in the English set says `.env.demo` holds placeholders.

## Verification

- Cyrillic search over `AGENTS.md`, `plans/README.md`, `docs/agents`, `docs/architecture.md`, `docs/decisions/0035-*.md` = 0.
- `pnpm lint` exit 0.
- Publish dry run not repeated (no link or exclude-list change).
