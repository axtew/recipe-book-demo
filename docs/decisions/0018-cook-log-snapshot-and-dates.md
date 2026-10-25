# 0018. The cook log stores a nutrition snapshot; dates are strings without time zones

- Status: accepted
- Date: 2026-08-02

## Context and problem

Recipe nutrition is recalculated from the active variants of products ([ADR 0016](0016-variants-and-active-variant.md)). If the cook log refers to live data, the history will drift when a product's brand changes.

## Considered options

1. **A snapshot in `cook_logs`** — a frozen document.
2. Normalised snapshot tables — rejected: the snapshot is not queried relationally.
3. Recalculating the log from current data — would rewrite history retroactively.

## Decision

- **`CookLog` stores a snapshot** of the nutrition and of the variants actually used at the moment of cooking. History is not rewritten retroactively when the active variant changes.
- **The snapshot in `cook_logs` is a single `jsonb` field**, not normalised tables. It is a frozen document, not queried relationally.
- **The dates `cooked_at` / `finished_at` are `date` without time**, in TS strings `YYYY-MM-DD`. No `Date` and no time zones.

## Consequences

- For a `jsonb` column the generated type is a recursive `Json` without fields, so it is parsed by `nutritionSnapshotSchema` at the service boundary ([ADR 0007](0007-zod-and-own-form-hook.md), [`conventions/typing.md`](../agents/conventions/typing.md)).
- The real output of a particular cook is `cook_logs.actual_yield_grams` ([ADR 0020](0020-recipe-content-and-backup.md)).
