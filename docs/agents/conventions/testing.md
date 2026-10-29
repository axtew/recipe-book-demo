# Tests

`pnpm test` runs vitest. The nutrition calculation module (`src/domain/nutrition/`) must pass its tests in Node without a DOM — it imports no React, Supabase or Mantine ([`data.md`](data.md) → "Purity of the domain module").

The pipeline verifies against `pnpm lint` and `pnpm build`; if there are tests, `pnpm test` passes too ([`AGENTS.md`](../../../AGENTS.md)).
