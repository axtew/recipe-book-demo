# 0012. The whole dataset is loaded into the client

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need to decide where search, filtering and nutrition calculation run. The database size is a few megabytes even after years.

## Considered options

1. **Load everything into the client and search in memory.**
2. Server search endpoints, pagination, filtering on the database side.

## Decision

**The whole dataset is loaded into the client.** Search, filtering, nutrition calculation — all local, in memory; no server search endpoints and no pagination. The backend is a dumb store with integrity.

Clarifications (2026-09-08):

- **Loading and selection are separated.** One loader in `AppLayout` mounts all five queries and exposes only the status (`isPending`, `isError`, `isFetching`) — it exists for the sake of this invariant. Screens take data through narrow selectors, each subscribed to its own slice. A single hook returning everything would subscribe every screen to all five datasets.
- Phase executors are allowed to add screen selectors: this is derivation on top of the cache, not data access. A selector does not call supabase, does not introduce a key and does not add a query — otherwise the phase stops and reports.
- `useAppData` is **not a store**, it is selectors: it stores nothing, it only derives from the cache the shape needed for a particular screen. This is also where archived records are cut off — they are not filtered in the queries ([ADR 0014](0014-archiving-instead-of-deletes.md)).
- Russian search folds the letter yo (U+0451) into ye (U+0435) on both sides of the comparison.

## Consequences

- Search is instant and works offline; there are no server search endpoints at all. A phase that adds a filtered backend query contradicts the architecture rather than optimising it.
- Search by ingredient is by product names only; variant names ("Prostokvashino") are not searched.
- How this looks in practice — [`architecture.md`](../agents/architecture.md).
