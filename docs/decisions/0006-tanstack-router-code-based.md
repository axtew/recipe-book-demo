# 0006. TanStack Router in code-based mode, routes and pages are separate layers

- Status: accepted
- Date: 2026-08-02

## Context and problem

The SPA needs a router. The familiar choice is React Router.

## Considered options

1. React Router — familiar; rolling back to it is estimated at 1 day.
2. **TanStack Router** — taken deliberately as "try something new on a safe project"; a bonus is typed params/search.

## Decision

**TanStack Router.** The mode is code-based: the route tree is written out explicitly, with no code generation and no `routeTree.gen.ts`. The split (decided 2026-08-30): `src/routes/` holds only the tree (path, typed params/search, loading, guard, page rendering) and no markup; a screen lives in `src/pages/<Name>Page/`, its subcomponents in `_internal/`.

## Consequences

- Rolling back to React Router would take about a day.
- State that must survive navigation between routes (search and filters of the recipe list) lives in the route's typed search params ([ADR 0024](0024-no-external-state-store.md)).
- Rules — [`conventions/routing.md`](../agents/conventions/routing.md).
