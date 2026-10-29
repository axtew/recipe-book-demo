# 0005. TanStack Query with an IndexedDB cache: read offline, write online only

- Status: accepted
- Date: 2026-08-02

## Context and problem

Server state must be cached, invalidated by keys and survive a dropped network. The users live in Da Nang (Vietnam), where connectivity is unstable: the AAG and APG submarine cables break several times a year, and international traffic degrades for days.

## Considered options

1. **TanStack Query v5** + `persistQueryClient` into IndexedDB.
2. The synchronous `query-sync-storage-persister` (localStorage) — did not fit: localStorage has a ~5 MB limit and synchronous access, while we load the whole dataset.
3. An outbox queue of mutations for offline writes — deferred.

## Decision

- **TanStack Query v5** — server state cache, invalidation by keys, `persistQueryClient` into IndexedDB (hence offline reading).
- Persistence: **`@tanstack/react-query-persist-client` + `@tanstack/query-async-storage-persister` + `idb-keyval`** (approved retroactively on 2026-08-30). `idb-keyval` is a thin wrapper over IndexedDB.
- **Offline: reading — yes, writing — no**; writing requires a network. The recipe draft is autosaved to `localStorage` regardless of the network — this is a separate mechanism, a requirement of the brief.
- If it turns out that input is really lost in the kitchen without wifi, we will add an outbox queue of mutations: a local change that does not break the architecture.

## Consequences

- The `idb-keyval` package was installed by the executor without asking, against the rule about new dependencies. The choice was right, the process was violated. To prevent a repeat, a closed list of dependencies per phase was added to the plan: it is now a check against the list, not the executor's judgement of what counts as a new dependency.
- `@tanstack/query-persist-client-core` in the direct dependencies is most likely redundant — it is transitive for the two packages above. Not a blocker, to be cleaned up when convenient.
- Unstable connectivity is the second argument for a persisted cache (and for the Singapore region, [ADR 0010](0010-supabase-without-own-backend.md)).
- How this works — [`architecture.md`](../architecture.md).
