# Local environment

**The cloud is the family's working database and holds live recipes. Test data is never written there.** Any live check runs only on the local stack.

| Command | Points at |
|---|---|
| `pnpm dev` | the local Supabase (`.env.development`) |
| `pnpm build`, `pnpm preview` | the cloud (`.env.production`) |
| `pnpm dev:prod` | a dev server against the cloud — look only, write nothing |
| `pnpm dev:demo` | demo mode (`VITE_DEMO=true`) against the local stack (`.env.demo-local`), signed in as the dev user |
| `pnpm build:demo` | the demo build (`.env.demo`: the demo Supabase project) |

**Before a live check, make sure the environment is up, and bring it up yourself.** The owner may have forgotten to start Docker or the stack; this is no reason to stop and ask.

1. `docker info`. An error means Docker is not running: `Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"` (PowerShell) and repeat `docker info` until it answers; usually up to a couple of minutes.
2. `npx supabase status`. If the stack is not running — `npx supabase start`.
3. If `product_categories` is empty, load the dev data: `docker exec -i supabase_db_recipe-book psql -U postgres -d postgres < supabase/dev-data.sql`. The script may be run, not edited.
4. Signing in to the app: **`dev@recipe-book.local` / `devpass123`**, a local-only user. If there is none (after a database reset), create it with one request; sign-up is open on the local stack:

   ```bash
   curl -s -X POST "http://127.0.0.1:54321/auth/v1/signup" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH" -H "Content-Type: application/json" -d '{"email":"dev@recipe-book.local","password":"devpass123"}'
   ```

**Apply a new migration to the local database** with `npx supabase migration up`: it applies only the unapplied ones and does not touch the data. `npx supabase db reset` wipes the whole local database: after it, load `dev-data.sql` again and create the dev user (steps 3–4).

**Forbidden:** `npx supabase db push` (the cloud is the owner's only) and `npx supabase stop --no-backup` (wipes the local data for no reason). Writing to the local database through the app is fine, as much as needed — that is what it is for.

## Demo project: checking `supabase/demo/setup.sql` locally

`setup.sql` and `load-seed.sql` are applied to the local stack only to check them, and afterwards the database must be returned to the dev state. `setup.sql` contains several statements while `supabase db query` accepts one, so the file is fed to `psql` inside the container:

```bash
docker exec -i supabase_db_recipe-book psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/demo/setup.sql
npx supabase db query --local -f supabase/demo/load-seed.sql   # a single INSERT — fits
docker exec -i supabase_db_recipe-book psql -U postgres -d postgres -c "select demo.reset()"
```

The reset clears the app tables, so the dev data is lost after the check; it changes the password only of the user `demo@recipe-book.example` and does not touch the dev user. The full way back: delete the objects uploaded to `recipe-photos` through the Storage API (otherwise the files stay in the volume as orphans), then `npx supabase db reset`, `dev-data.sql` and the dev user (steps 3–4 above). `db reset` also restores the Storage policies and wipes the `pg_cron` schedule and the demo user.

At the start, `setup.sql` checks that the project has the user `demo@recipe-book.example` and aborts without it. In the local stack the dev user is named differently, so before applying the file (and in the «wrong project» check) create such a user: either Studio → Authentication → Add user (`demo@recipe-book.example`, any password, Auto Confirm), or an SQL query through `auth.users` — after the check it goes away with `db reset`. The order of applying it in the cloud is in `supabase/demo/DEPLOY.md`.
