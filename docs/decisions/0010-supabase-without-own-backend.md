# 0010. Supabase without own server code, Singapore region

- Status: accepted
- Date: 2026-08-02

## Context and problem

We need a source of truth for the data. Relational integrity is the heart of the feature here (a two-level product list, nutrition recalculation through FKs), and we also need Storage for photos and TS type generation from the schema. The users are in **Da Nang, Vietnam** (not in Bishkek — that was a wrong guess based on the work projects).

## Considered options

Backend:
1. **Supabase** (managed Postgres + Auth + Storage).
2. Local-first on IndexedDB — rejected: 4 devices, clobbering on simultaneous editing.
3. Own Node + Postgres — rejected: a week of work for plain CRUD.
4. PocketBase on a VPS — rejected: backups and uptime would be on me.

Region (the former fork R-3):
1. **Singapore (`ap-southeast-1`)** — ~30–40 ms from Da Nang.
2. Tokyo — ~70 ms.
3. Mumbai — ~90 ms.

## Decision

**Supabase** as the source of truth. **We do not write own server code.** The region is **Singapore (`ap-southeast-1`)**; the users' location is Da Nang.

## Consequences

- Connectivity from Vietnam is unstable (submarine cables break several times a year, international traffic degrades for days). This is the second argument for a persisted cache ([ADR 0005](0005-tanstack-query-persisted-cache.md)) and for Singapore, whose routes suffer less.
- The app has no server: `supabase-js` calls PostgREST over HTTPS directly. The data path is [ADR 0022](0022-data-access-path-and-services.md); access is [ADR 0011](0011-manual-accounts-signup-off.md) and [ADR 0015](0015-grant-plus-rls.md).
- The `sb_publishable_…` key in the client bundle is normal; `sb_secret_…` must never get into the client.
