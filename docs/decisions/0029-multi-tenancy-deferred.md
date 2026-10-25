# 0029. Multi-tenancy and open sign-up are a reserve for v3+, not preparing now

- Status: deferred
- Date: 2026-08-17

## Context and problem

Discussed on 2026-08-17: perhaps we will want to share the app with acquaintances, and later — app stores and more features.

- The app has no server and, in the current architecture, will not: `supabase-js` calls PostgREST over HTTPS directly. The publishable key identifies the **project**, not the user.
- **Hiding the key is impossible in principle.** Anything that gets into a browser or a mobile app can be extracted. An intermediate server changes nothing: the client still needs some credentials, and they are just as extractable. Security is provided by auth and RLS, not by hiding the key — this is by design.
- **Sign-up must not be opened while the RLS policies look like `using (true) to authenticated`.** Right now any logged-in user sees everything. Opening sign-up in this state = giving your database to the first taker ([ADR 0011](0011-manual-accounts-signup-off.md)).

## Considered options

1. **Prepare nothing for this now.** Adding `group_id` to a database of a few hundred rows is a half-hour migration. Designing multi-tenancy in advance would slow down v1 for the sake of a hypothesis. The only hedge: policies are written uniformly so that replacing `using (true)` with a membership check is mechanical.
2. Design multi-tenancy right away — rejected.
3. An own server layer to hide the requests — gives no security: what protects is authorization on every request, not the client's ignorance of the address. Server code with the secret key bypasses RLS, that is, it is **more dangerous** — a check can be forgotten in a single handler.

## Decision

Deferred. What multi-tenancy will require:

- tables `groups` + `group_members(group_id, user_id, role)`;
- a `group_id` column on all user tables;
- policies through a `security definer` membership-check function (a direct subquery in a policy causes a call per row, and on the membership table itself — recursion);
- `(select auth.uid())` instead of `auth.uid()` in policies, so that Postgres caches the value;
- the product side — invitations, roles, a "share" screen.

## Consequences

- **As soon as other people's data appears in the database, a mistake in RLS stops being an inconvenience and becomes a leak.** The `RLS-1` defect from Phase 1 (policies forgotten on 7 of 8 tables, [ADR 0015](0015-grant-plus-rls.md)) is exactly this category of error. When moving to multi-tenancy, **tests for the policies** are needed: a set of checks "a user from group A does not see the data of group B", run automatically. Without them, going by eye is not enough.
- **The Free tier limits** are sufficient for a couple of dozen acquaintances, but the bottleneck will be not rows but **photos**: 20 families × 100 recipes × 150 KB ≈ 300 MB against a 1 GB quota, plus 5 GB of egress a month. After that, Pro at $25/month.
- **App stores:** the App Store does not accept a PWA directly — a wrapper (Capacitor) is needed. Google Play accepts it through a Trusted Web Activity (Bubblewrap), PWAs pass.
- Ideas — [`BACKLOG.md`](../../BACKLOG.md) ("Families and multi-tenancy", "Publishing to the stores").
