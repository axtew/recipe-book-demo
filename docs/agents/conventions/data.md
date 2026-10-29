# Data — the path to the backend, services, migrations, the domain

## Data access — the only path to the backend

There is no application server: the client talks to Supabase (PostgREST + GoTrue + Storage) directly. The transport is `@supabase/supabase-js`; the project does **not** wrap it in an HTTP service and never issues raw `fetch` at PostgREST.

The path is fixed, and every step of it is mandatory:

```
component → TanStack Query hook (src/api/queries|mutations) → service (src/api/services) → supabase client
```

- **A component never imports the Supabase client.** Not for a "quick" read, not in a `useEffect`. A component that needs data uses a query hook; one that writes uses a mutation hook. A direct `supabase.from(...)` outside `src/api/services/` is a defect.
- **Services are the only place that knows PostgREST.** Table names and `select()` strings with embedded relations live there and nowhere else.
- **Services are the type boundary.** A service maps the generated row type into the project's own entity interface — camelCase names, only the fields consumers need, nested relations resolved. The generated row shape does not leave this layer. Verify the runtime type of every `numeric` column once against the generated type and convert if they disagree; a numeric string past this boundary is a defect.
- **The generated types are the contract.** `src/types/database.types.ts` holds the real column set, nullability and row / insert / update shapes for every table — read it before declaring a type for anything that comes out of the database, instead of inferring the shape from a call site (see [`typing.md`](typing.md)). It is regenerated with `pnpm db:types` after every migration and is never edited by hand.
- **One file per domain**, as in `Carbon-spa`: `products.service.ts`, `recipes.service.ts`, `cookLogs.service.ts`, `categories.service.ts`. Plain exported functions, **not** a class with methods — there is no per-domain state to inject, and `supabase-js` is already the client.
- **Query keys and hooks** live in `src/api/queries/` and `src/api/mutations/`, one module per domain. A mutation invalidates by key; no manual refetch calls from components.
- **Archived rows are loaded too.** The dataset must be internally consistent: the nutrition module throws on a dangling reference, and a recipe may well point at an archived product. Filtering `archived_at` in the query would crash that recipe's screen. Archived rows are hidden by the selectors and screens that list things, not by the query.
- **The whole dataset is loaded up front.** No server-side search, no pagination, no filtering pushed to the database — searching and filtering run over the in-memory dataset. A phase that adds a filtered request to the backend is contradicting the architecture, not optimising it.

The decisions behind these rules: [ADR 0012](../../decisions/0012-whole-dataset-in-client.md), [0022](../../decisions/0022-data-access-path-and-services.md), [0024](../../decisions/0024-no-external-state-store.md), [0014](../../decisions/0014-archiving-instead-of-deletes.md).

## Migrations and the work split

**Executors write the whole data layer** — migrations, services, query and mutation hooks, zod schemas (since 2026-10-18, [ADR 0026](../../decisions/0026-work-split-lifted.md)). Two things stay with the owner: `npx supabase db push` to the cloud project, and the `.env*` files. A phase that adds a migration applies it **locally** (`npx supabase migration up`), regenerates the types (`pnpm db:types`), and reports that the migration must be rolled out.

The executor may: write migrations in `supabase/migrations/`, apply them **to the local** database, regenerate `src/types/database.types.ts` with `pnpm db:types`, write services, query and mutation hooks, zod schemas.

What stays with the owner:

- `npx supabase db push` — rolling migrations out to the cloud. This is the family's working database; the executor stops and reports that the migration is ready to be rolled out.
- `.env`, `.env.development`, `.env.production`, `.env.test` — the addresses and keys of the environments.
- `.env.demo` — the address and publishable key of the demo Supabase project; the demo project's deployment is described in `supabase/demo/DEPLOY.md`. `.env.demo-local` is the demo mode against the local stack; its values are the same on any machine, the file is committed and not to be edited.
- The Supabase and Cloudflare dashboards.

Rules that are not cancelled together with the split:

- **Multi-step writes are a database function called through `rpc`**, not a chain of requests ([ADR 0023](../../decisions/0023-rpc-for-multi-step-writes.md)): PostgREST gives one transaction per request, and a failure half-way leaves half a record behind. A write that touches more than one table or needs several sequential requests is a PL/pgSQL function called through `rpc`, never a chain of client requests. The model is `supabase/migrations/20260919051102_create_product_with_variant.sql`: `security invoker`, `set search_path = ''`, schema-qualified table names, `revoke execute … from public, anon`, `grant execute … to authenticated`.
- **Never edit an applied migration** — only add a new one. To check whether one is applied: `npx supabase migration list`.
- **A new table — three items:** `enable row level security`, a policy, `grant` ([ADR 0015](../../decisions/0015-grant-plus-rls.md)). `DELETE` is not granted for archivable entities.
- **The shape of an entity in the cache changed — raise `CACHE_BUSTER`** in `src/constants/caching.constants.ts`.
- **The input schema and the entity interface are tied with `satisfies z.ZodType<…>`.**

After any change to the DB schema **always** regenerate the types — never edit `database.types.ts` by hand.

## Purity of the domain module

`src/domain/nutrition/` holds every arithmetic operation on nutrition values, and it must run in Node with no DOM. It imports **nothing** from React, Supabase or Mantine — pure functions over plain data. No component, hook or service computes nutrition itself ([ADR 0017](../../decisions/0017-nutrition-module-purity.md)).

The module returns raw numbers; rounding is the UI's job (kcal to integers, macros to one decimal). A rounding call inside the domain module is a defect.
