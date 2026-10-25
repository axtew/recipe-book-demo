# 0015. Data access = grant + RLS policy

- Status: accepted
- Date: 2026-08-18

## Context and problem

The review of Phase 1 and of migration `20260817172518` found two defects: `RLS-1` (policies existed only on `products`, forgotten on 7 of 8 tables) and `GRANT-1` (`authenticated` had no `SELECT/INSERT/UPDATE` privileges — the query failed with `42501` even before RLS).

## Considered options

1. **Two independent barriers — grant and policy, with a checklist for a new table.**
2. `alter default privileges` — so that a new table gets privileges automatically.

## Decision

**Data access = grant + RLS policy, two independent barriers.** The grant decides whether the table can be accessed at all (otherwise `42501`), the policy decides which rows are visible. Either can be forgotten: without a policy the list is empty with no error, without a grant there is an explicit error. Checklist for a new table: `enable rls` + policy + `grant`.

**`alter default privileges` is deliberately not used:** a new table should fail with a clear `42501`, not get privileges silently.

## Consequences

- The `DELETE` privilege is granted selectively — [ADR 0014](0014-archiving-instead-of-deletes.md).
- Policies are written uniformly (`using (true)` for `authenticated`) so that replacing them with a membership check is mechanical — [ADR 0029](0029-multi-tenancy-deferred.md). Sign-up is off meanwhile — [ADR 0011](0011-manual-accounts-signup-off.md).
