# 0023. Multi-step writes are database functions called through `rpc`

- Status: accepted
- Date: 2026-09-08

## Context and problem

PostgREST gives one transaction per request. A chain of several calls that fails in the middle leaves half a record: a product without variants, a recipe without ingredients.

## Considered options

1. **PL/pgSQL functions in migrations, called through `rpc`.** Inside a function, a failure rolls everything back.
2. A chain of three requests ("it is simpler", the earlier choice from the plan, the "Known risks" section) — reconsidered.

## Decision

**Multi-step writes are database functions called through `rpc`.** Creating a product with its first variant and saving a whole recipe are written as PL/pgSQL functions in migrations: `security invoker`, `search_path = ''`, the right to call is given to `authenticated` only.

## Consequences

- The technical rules stay in force after the work split was lifted ([ADR 0026](0026-work-split-lifted.md)): multi-step writes are a function through `rpc`, `security invoker`, explicit `grant`s, `satisfies` between the input schema and the interface, `CACHE_BUSTER` when an entity's shape changes.
- The reference and the list of function properties — [`conventions/data.md`](../agents/conventions/data.md).
