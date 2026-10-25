# 0024. There will be no separate state store

- Status: accepted
- Date: 2026-09-08

## Context and problem

We need to decide where the app state lives besides server data, and whether to add an external store for it.

## Considered options

1. **No store:** server data lives in the TanStack Query cache, the rest is divided by the question "did it come from the server?".
2. Redux, Zustand, Jotai and the like — rejected: keeping a copy of server data in an external store means writing by hand the invalidation, deduplication, retries, background refresh and persistence — everything Query already does — and creating a second truth that falls out of sync.

## Decision

**There will be no separate store.** Server data lives in the TanStack Query cache, which is also the only source of truth for it. Redux, Zustand, Jotai and the like are not added.

The rest of the state is divided by the question "did it come from the server?":

- screen state — `useState` next to the component;
- what must survive navigation between routes (search and filters of the recipe list) — the route's typed search params;
- small conveniences such as collapsed groups — `localStorage`.

## Consequences

- `useAppData` is not a store but a set of selectors on top of the cache ([ADR 0012](0012-whole-dataset-in-client.md)).
- The cache — [ADR 0005](0005-tanstack-query-persisted-cache.md), routing — [ADR 0006](0006-tanstack-router-code-based.md).
