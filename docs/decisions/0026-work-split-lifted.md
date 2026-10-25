# 0026. The work split is lifted: executors write everything, including the database

- Status: accepted
- Date: 2026-10-18

## Context and problem

Since 2026-09-08 the owner wrote the data layer by hand: services, TanStack Query hooks, zod schemas, multi-table mutations — the project was also a learning one. The owner wanted to understand the query language, as well as caching, invalidation, persistence and validation, on their own. The price of that decision: phases 6–12 waited not only for services but also for hooks — the only point where the whole plan depended on one person.

The previous boundary (2026-09-08): executors were forbidden from touching `src/api/**` entirely (otherwise an executor who needs a new query would honestly write the hook for themselves — formally violating no rule), except for a single-table mutation (nothing can diverge there, and the reference is already written); `src/domain/schemas/**` and `src/domain/backup/**` were also the owner's zone; everything that writes to several tables, goes in several steps or uploads to Storage belonged to the owner. The boundary is checkable: the number of tables is counted.

## Considered options

1. Keep the split (the owner writes the data layer and the schemas).
2. **Lift the split:** learning is moved outside the project, the priority is to launch the app.

## Decision

**Executors write everything, including the database.** The owner decided to move learning outside the project: the priority is to launch the app. This cancels the split from the decision of 2026-09-08 and steps `B6`–`B9` of the backend track.

What stays with the owner is whatever touches the working database and access: `npx supabase db push` to the cloud, the `.env*` files, the Supabase and Cloudflare dashboards. The executor applies migrations to the local database only and reports that it is time to roll them out.

## Consequences

- The technical rules worked out during the manual work stay in force: multi-step writes are a database function through `rpc` ([ADR 0023](0023-rpc-for-multi-step-writes.md)), `security invoker`, explicit `grant`s ([ADR 0015](0015-grant-plus-rls.md)), `satisfies` between the input schema and the interface, `CACHE_BUSTER` when an entity's shape changes. They are written down in [`AGENTS.md`](../../AGENTS.md) and the conventions ([`conventions/data.md`](../agents/conventions/data.md)), and did not depend on who writes the code.
