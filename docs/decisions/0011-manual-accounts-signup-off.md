# 0011. Accounts are created manually, sign-up is off

- Status: accepted
- Date: 2026-08-02

## Context and problem

The app is personal, for two ([ADR 0001](0001-personal-app-for-two.md)). We need authorization without a sign-up screen and without extra layers of protection.

## Considered options

1. **Accounts created manually in the Supabase dashboard, RLS "authenticated only".**
2. A PIN on top of the login — not doing: the phone is under a lock.
3. Open sign-up — not allowed while the RLS policies look like `using (true) to authenticated` ([ADR 0029](0029-multi-tenancy-deferred.md)).

## Decision

**Auth** — accounts are created manually in the Supabase dashboard. There is no sign-up UI. RLS policies are "authenticated only". No PIN on top.

**New user sign-up must be turned off in the project settings** (Authentication → Providers → Email). RLS gives the `authenticated` role access to everything, with no check by owner — with open sign-up, anyone who learns the project URL creates an account and gets the whole database. This is the only real hole in such a security scheme, and it is closed by a single switch.

## Consequences

- The **publishable key** (`sb_publishable_...`) in the client bundle is fine, it is meant for that, and the data is protected by RLS. The **secret key** (`sb_secret_...`) must never get into the client — it bypasses RLS.
- Supabase keys were renamed: `sb_publishable_*` instead of the former `anon`, `sb_secret_*` instead of `service_role`. The old names are found in documentation and articles — they are the same by purpose. The environment variable in the project is called `VITE_SUPABASE_PUBLISHABLE_KEY`.
- The real secrets of the project, which belong in a password manager: the **Database Password** and the **secret key**. The Project URL and the publishable key are not secrets.
