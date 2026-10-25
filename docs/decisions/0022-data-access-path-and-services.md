# 0022. Data path: component → hook → service → Supabase client

- Status: accepted
- Date: 2026-08-30

## Context and problem

After porting the instructions from the work project `Carbon-spa`, we need to decide how the data layer is organised here. This is the most likely place where an executor will cut a corner, so the rule is put into the conventions as a separate section. The name of the layer changed: `repositories` (2026-08-30), then back to `services` (2026-09-08).

## Considered options

1. **Port the `src/api` structure**: one module per domain, plain functions instead of class methods.
2. Port `httpService` from `Carbon-spa` — rejected. Its value is a deduplicated token refresh on parallel 401s, a timeout and abort; `supabase-js` does all of this internally. Going through raw HTTP to PostgREST would mean losing the typing from `database.types.ts`, the whole GoTrue (login, session, refresh), Storage for photos and typed nested selects. There is nothing to wrap `supabase-js` in `httpService` — it is not fetch-shaped.
3. The name `repositories` versus `services`:
   - for `repository` — terminological accuracy ("a boundary that maps storage rows to domain entities");
   - for `service` — a practical argument: the owner keeps two repositories in mind, and an identical layout is cheaper than an accurate term.

## Decision

- **The path is fixed rigidly:** component → TanStack Query hook → service → Supabase client. A direct `supabase.from(...)` outside `src/api/services/` is a defect.
- **`src/api/services/`, not `repositories/`** (a return to the name from `Carbon-spa`, 2026-09-08). The substantive decision did not change: these are plain exported functions, not a class with methods; there is nothing to inject into the layer, there is one client per app.
- **Entity types are flat in `src/types/`, one file per domain** (`products.types.ts`, `recipes.types.ts`, `cookLogs.types.ts`). We do not create the `data/` folder from `Carbon-spa`. Reason: the criterion "api types versus the rest" is unstable — a response shape becomes an entity, an entity gets into a form, and to avoid a circular import everything ends up in one place. The domain a concept belongs to is a stable criterion. A domain that outgrows one file gets a folder.
- **The service is the type boundary:** the generated row shape does not leave the services layer.
- The rule about `numeric` was empirically refuted on 2026-09-08. It was believed that PostgREST returns `numeric` as a string and the data layer does the cast to `number`. A check on live data (`typeof row.kcal_100`) gave `number`: drivers like `node-postgres` return `numeric` as a string, while PostgREST serialises through `to_json`, and `to_json(numeric)` gives a number without quotes. The generated `database.types.ts` was right from the start. The rule was replaced by "check the actual response against the type".

## Consequences

- The risk of the name "service" is stated directly in the conventions: in `Carbon-spa` it is a class on top of `httpService`, here it is functions.
- Layer rules — [`conventions/data.md`](../agents/conventions/data.md); loading and selection — [ADR 0012](0012-whole-dataset-in-client.md).
