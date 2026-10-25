# 0007. zod for untrusted input, own form hook

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need validation of forms, of the JSON backup import and (later) of LLM structured output. We have to decide whether to take a form library and whether to apply validation to PostgREST responses.

## Considered options

1. **zod** + an own `useForm`-like hook (modelled on `Carbon-spa`).
2. A form library (`react-hook-form`) — not taken; the recipe editor state is isolated behind a small interface so that it can be replaced with `react-hook-form` without rewriting the screen if needed.
3. Validating every PostgREST response row with zod — rejected: the response shape is defined by our own schema and is already described by the generated `database.types.ts`; validating every row wastes phone CPU without new information.

## Decision

- **zod** — form validation + JSON backup import validation + later the schema for LLM structured output. Three roles, so we take it.
- **No form library.** An own `useForm`-like hook.
- zod stays where the input is untrusted: forms, JSON import, the draft from `localStorage`, later structured output. **zod is not applied to PostgREST responses.**
- **The only exception is `jsonb`.** For `cook_logs.snapshot` the generated type is a recursive `Json` without fields, that is, there is no contract at all. This column is parsed by `nutritionSnapshotSchema` at the service boundary.

## Consequences

- Schemas live in `src/domain/schemas/`, one module per entity; the input schema and the entity interface are tied together through `satisfies z.ZodType<…>` ([`conventions/data.md`](../agents/conventions/data.md)).
- More details — [`conventions/stack.md`](../agents/conventions/stack.md).
