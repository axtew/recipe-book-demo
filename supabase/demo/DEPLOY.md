[Русский](DEPLOY.ru.md) · **English**

# Demo environment: deploy your own

How to bring up your own demo environment: a separate Supabase project, the demo build of the app and a Cloudflare Worker that keeps the free project from being paused. If you have a separate working Supabase project, nothing listed below touches it: for steps 2 and 4 the CLI is linked to the demo project, and at the end it is linked back to the working one.

The commands are given in two variants: PowerShell 7 first, then bash. If a command is the same for both, the block is labelled "PowerShell and bash". All commands are run from the repository root.

**Secrets do not get into the repository.** The CLI asks for the database password itself at `supabase link` and keeps it on your machine; the secret key lives only in an environment variable of the current terminal (step 4). `.env.demo` and `wrangler.demo.jsonc` get only the project address and the publishable key: it is public and ends up in the bundle anyway.

## What you will get

- A Supabase project (called `recipe-book-demo` in the examples) with the same migrations as the working one, sign-ups switched off and one shared user.
- A `demo` schema in the database with the reference data and a reset function; `pg_cron` returns the data and the user account to the reference once a day (00:00 UTC). The `demo` schema is not available over REST.
- The recipe photos in the `recipe-photos` bucket; writing to the bucket is closed for all users, read only.
- The `recipe-book-demo` Worker on Cloudflare: the static files of the demo build plus a Cron Trigger (Monday and Thursday, 06:00 UTC) that calls the `demo_last_reset` function over REST once every few days. This is needed so that the free Supabase project is not paused after a week without activity: its own `pg_cron` apparently does not count as activity.

## Before you start

1. If you have a working project and the Supabase CLI is linked to it, write down two things — you will need them at the end:
   - its ref: `npx supabase projects list` — the linked project is marked with `●` in the `LINKED` column, the ref is in the `REFERENCE ID` column;
   - its state: `npx supabase migration list` (the command only reads). Remember the last row of the list.
2. Log in to Cloudflare from the CLI, if you have not yet: `npx wrangler login`.

## 1. Create the project and the user

1. In the [Supabase dashboard](https://supabase.com/dashboard) create a project named `recipe-book-demo` (free plan). Save the database password in a password manager; it does not go into the repository. Tip: set a password of letters and digits without special characters, so it does not need to be encoded in the connection string (step 2).
2. **Switch off sign-ups:** Authentication → Sign In / Providers → the **User Signups** block at the very top of the page → the **"Allow new users to sign up"** toggle → switch off → Save. Without this anyone who finds the project address can create an account.
   - **Do not switch off the Email provider lower on the same page (Auth Providers → Email):** it is the email and password sign-in, and without it the demo user cannot sign in.
3. **Create the user:** Authentication → Users → Add user → Create new user.
   - Email `demo@recipe-book.example`, password `demo-recipe-book` — this is the throwaway account from `.env.demo` that is filled in on the sign-in screen.
   - Tick "Auto Confirm User".
   - If you want a different login and password, change them in three places: `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` in `.env.demo`; in `supabase/demo/setup.sql` — all occurrences of the email `demo@recipe-book.example` (the check at the start of the file, the `c_email` constant of the `demo.reset` function and remembering the user before the ping function) and the `c_password` constant; then apply `setup.sql` (step 3) with the new values. Otherwise the nightly reset returns the account to the old values.

## 2. Roll out the migrations to the demo

**Link the CLI to the demo project.** The CLI is linked to one project per repository directory; switching means running `supabase link` with another ref. The ref of the demo project is in the address of its dashboard page (`supabase.com/dashboard/project/<ref>`) or in Project Settings → General → Project ID. PowerShell and bash:

```
npx supabase link --project-ref <demo project ref>
```

The CLI asks for the database password — the one set when the demo project was created. Make sure the demo one is linked: `npx supabase projects list` — the `●` mark in the `LINKED` column is on `recipe-book-demo`.

First a dry run: it must list **all** the migrations from `supabase/migrations/` (compare the number with the contents of the directory) — the demo database is still empty. If the list is empty, the CLI is looking at the already updated working project — stop and repeat `link`. PowerShell and bash:

```
npx supabase db push --dry-run
```

Now the rollout itself:

```
npx supabase db push
```

**If you mix up the projects, the working database is not harmed:** the migrations are shared and the working project needs the same ones; and the demo commands of step 4 simply fail on the working database — there is no `demo` schema there. Only `setup.sql` is dangerous, which is why it goes through the SQL Editor with a check (step 3).

## 3. Apply `setup.sql`

> **Warning: the file is for the demo project only.** It drops the Storage write policies and creates a nightly job that wipes the app tables. Before running it, check the project name in the dashboard header (top left): it must be the demo project (`recipe-book-demo`), not your working one. Do not run the file in the working project.
>
> As a safeguard there is a check at the start of the file: if the project has no user with the demo email (step 1), the file aborts with the error "this is not the demo project" before the first change. When you see it, do not hurry to create the user and run the file again — first make sure the demo project is the one that is open.

1. Open the file `supabase/demo/setup.sql` and copy it whole.
2. The demo project in the dashboard → SQL Editor → New query → paste → Run. Supabase warns about "potentially destructive operations" (the file has `drop policy` and a function with `truncate`) — confirm.
3. Expected result: no errors, and at the end the `cron.schedule` result with one row. The file can be run again.
4. If `create extension pg_cron` fails with a permissions error, enable the extension in Database → Extensions → `pg_cron` and run the file once more.

The file creates the `demo` schema, the reference and account tables, the `demo.reset()` function, the `public.demo_last_reset()` function for the ping and the schedule, and it drops the Storage write policies (in the working database they stay).

**After future migrations** (the migrations are shared by the working and the demo database): if a migration creates a new app table, add it to the `truncate` list in `demo.reset()` (`supabase/demo/setup.sql`), otherwise it survives the nightly reset; if a migration recreates or adds Storage write policies, add them to `drop policy` at the end of the file. After the edit run `setup.sql` in the demo once more.

## 4. Load the reference and the photos

### The reference

`supabase/demo/load-seed.sql` is one `INSERT` of 327 KB, too large for the SQL Editor, so the CLI runs it (`db query` accepts exactly one statement, and this file fits). The CLI is still linked to the demo (step 2). PowerShell and bash:

```
npx supabase db query --linked -f supabase/demo/load-seed.sql
```

If the command refuses because of the query size, run the same file through the connection string (the appendix at the end).

Now the first reset: it clears the app tables, loads the reference and restores the demo user account. Expected response: `{"recipes": 20, "products": 65, "cook_logs": 39}`.

```
npx supabase db query --linked "select demo.reset()"
```

The same can be run in the SQL Editor: `select demo.reset();`.

### The photos

You need the secret key of the demo project: dashboard → Project Settings → API Keys → `secret` (not publishable). It bypasses the Storage policies and is not written anywhere. The key is entered without being shown on the screen (in PowerShell `-MaskInput` is PowerShell 7.1+).

PowerShell:

```powershell
$env:SUPABASE_URL = 'https://<ref>.supabase.co'
$env:SUPABASE_SECRET_KEY = Read-Host -MaskInput "Secret key of the demo project"
node supabase/demo/upload-photos.mjs
Remove-Item Env:SUPABASE_SECRET_KEY
```

bash:

```bash
export SUPABASE_URL='https://<ref>.supabase.co'
read -rsp "Secret key of the demo project: " SUPABASE_SECRET_KEY && export SUPABASE_SECRET_KEY
node supabase/demo/upload-photos.mjs
unset SUPABASE_SECRET_KEY
```

The script puts the 20 files from `supabase/demo/photos/` into the `recipe-photos` bucket under the paths `<recipe id>/cover.webp` (the list is `supabase/demo/photos.json`). Expected result: `Uploaded 20 of 20.` Running it again is safe.

### Link the CLI back to the working project

If you have a working project, link the CLI back (the ref is written down in "Before you start"), otherwise the next regular `db push` goes to the demo. PowerShell and bash:

```
npx supabase link --project-ref <working project ref>
npx supabase projects list
```

The `●` mark must be on the working project.

## 5. Fill in the address and the key

The project address and the publishable key: dashboard → Project Settings → API. The values are needed in two files:

- `.env.demo` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (in place of the `REPLACE-ME` stubs);
- `wrangler.demo.jsonc` — `vars.SUPABASE_URL`, `vars.SUPABASE_PUBLISHABLE_KEY` (the same values; the ping script reads them from here, because the Worker does not see `.env.demo`).

Both values are public, both files are committed. Secret keys go into neither of them.

## 6. Build and roll out

One command: `deploy:demo` calls `build:demo` itself. PowerShell and bash:

```
pnpm deploy:demo
```

The first run creates the `recipe-book-demo` Worker on your `workers.dev` subdomain and registers the Cron Trigger. wrangler prints the address.

> **Warning. `VITE_DEMO` must not get into the build of the working Worker.** Vite picks up `VITE_*` from the process environment variables, and they take priority over the `.env.*` files. Do not add `VITE_DEMO` (and `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD`) to Cloudflare → the working Worker → Settings → Build → Variables and secrets, and do not set them in the terminal before a working build: the working app would turn into the demo with a banner and closed photo upload. The demo is built and rolled out only by the `pnpm deploy:demo` command from your machine, and it has no auto-build from the repository.

## How to check

1. **The demo opens.** The address from the `deploy:demo` output: the "Demo version…" banner is visible (in the language of the browser; the banner text is in `public/dictionaries/`), the sign-in screen already has the login and password filled in, "Sign in" signs in with one tap, and the list has 20 recipes with photos.
2. **The reset works.** Change something in the app (for example, a recipe name), then call the reset (the command from step 4) and refresh the page: the data is back. The demo login still signs in after the reset.
3. **The `pg_cron` job is in the list.** SQL Editor of the demo project:

   ```sql
   select jobid, jobname, schedule, active from cron.job;
   ```

   Expected: one row `demo-nightly-reset`, `0 0 * * *`, `active = t`. The next day check that it ran:

   ```sql
   select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5;
   ```

4. **Writing to Storage is closed, reading works.** The photo opens by the public link (substitute any path from `supabase/demo/photos.json`). PowerShell and bash:

   ```
   curl.exe -sI "https://<ref>.supabase.co/storage/v1/object/public/recipe-photos/<recipe id>/cover.webp"
   ```

   Expected: `HTTP/2 200` in the first line. (In bash the plain `curl` works instead of `curl.exe`.) An upload on behalf of the demo user must be rejected.

   PowerShell:

   ```powershell
   $token = (curl.exe -s -X POST "https://<ref>.supabase.co/auth/v1/token?grant_type=password" -H "apikey: <publishable key>" -H "Content-Type: application/json" -d '{"email":"demo@recipe-book.example","password":"demo-recipe-book"}' | ConvertFrom-Json).access_token
   curl.exe -s -X POST "https://<ref>.supabase.co/storage/v1/object/recipe-photos/check/cover.webp" -H "apikey: <publishable key>" -H "Authorization: Bearer $token" -H "Content-Type: image/webp" --data-binary "@supabase/demo/photos/syrniki.webp" -w "\nHTTP %{http_code}\n"
   ```

   bash:

   ```bash
   TOKEN=$(curl -s -X POST "https://<ref>.supabase.co/auth/v1/token?grant_type=password" -H "apikey: <publishable key>" -H "Content-Type: application/json" -d '{"email":"demo@recipe-book.example","password":"demo-recipe-book"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).access_token')
   curl -s -X POST "https://<ref>.supabase.co/storage/v1/object/recipe-photos/check/cover.webp" -H "apikey: <publishable key>" -H "Authorization: Bearer $TOKEN" -H "Content-Type: image/webp" --data-binary "@supabase/demo/photos/syrniki.webp" -w "\nHTTP %{http_code}\n"
   ```

   Expected: a response with `403` and `new row violates row-level security policy`. If `Successfully uploaded` came instead, the write policies were not dropped — re-run `setup.sql` and delete the object `check/cover.webp` in the dashboard.

5. **The ping reaches Postgres.** PowerShell and bash (the publishable key is from step 5):

   ```
   curl.exe -s -X POST "https://<ref>.supabase.co/rest/v1/rpc/demo_last_reset" -H "apikey: <publishable key>" -H "Content-Type: application/json" -d "{}" -w "\nHTTP %{http_code}\n"
   ```

   Expected: the time of the last reset in quotes (after the first reset) or `null`, and the line `HTTP 200`. The Cron Trigger is visible in Cloudflare → Workers → `recipe-book-demo` → Settings → Triggers (`0 6 * * 1,4`); the runs that completed are in the Logs tab.

6. **The working database did not change** (if you have one). The CLI is linked to the working project again (`npx supabase projects list`), and `npx supabase migration list` gives the same list as in "Before you start": no new rows.

7. **Two weeks after the launch.** Make sure the Supabase email "project will be paused" did not arrive. If it did, the ping from the Cron Trigger does not count as activity: replace it with another way (for example, a scheduled GitHub Actions run that calls the same `rpc`).

## If something went wrong

- `db push --dry-run` shows an empty or short list — the CLI is not linked to the demo. Do not apply anything, check `npx supabase projects list` and repeat `link` (step 2).
- A regular `db push` after all the steps "does nothing" in the working project — the CLI stayed linked to the demo; link it back (the end of step 4).
- `setup.sql` aborts with the error "this is not the demo project" — the wrong project is open, or the user from step 1 was not created.
- `setup.sql` aborts again with the error "this is not the demo project" although the project is right — a visitor changed the email of the demo user before the nightly reset. First run `select demo.reset();` (it restores the email), then re-run `setup.sql`.
- The demo signs in but there is no data — step 4 (the reference and the first reset) was not done.
- The demo signs in but the photos do not load (empty cards) — the photo upload was not done, or the bucket is named differently from `recipe-photos`.
- The reset complains `demo_seed_not_loaded` — the reference table is empty, repeat loading the reference.
- The reset warns "demo user not found" — the demo user was deleted, or its email was changed and the user is lost; create it again (step 1) and re-run `setup.sql`.
- In the `wrangler` log the ping fails with "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are not set in wrangler.demo.jsonc" — step 5 was not done for `wrangler.demo.jsonc`.

## Appendix: a connection string instead of `link`

The fallback — if `db query --linked` refuses a large file or you do not want to re-link the CLI. The CLI gets the full address of the demo database through `--db-url`.

**Where to get the string:**

1. Open the demo project in the dashboard and press the **Connect** button in the top bar of the project page. If it is not visible — Project Settings → Database.
2. Choose **Session pooler**. Not Direct connection: on the free plan the direct connection works only over IPv6. Not Transaction pooler: it has port 6543, and 5432 is needed.
3. Copy the whole string: `postgresql://postgres.<ref>:[YOUR-PASSWORD]@aws-<N>-<region>.pooler.supabase.com:5432/postgres`. Copy the host as is — the digit `<N>` cannot be guessed.
4. Replace `[YOUR-PASSWORD]` together with the brackets with the database password.

**A password with special characters.** The password sits inside the address, so characters like `@`, `:`, `/`, `#` break the string. If the password has only letters and digits, skip this paragraph. Otherwise it is easier to change the password to an alphanumeric one (Project Settings → Database → Reset database password) or to encode the characters: `%` → `%25` (first), space → `%20`, `!` → `%21`, `#` → `%23`, `$` → `%24`, `&` → `%26`, `'` → `%27`, `+` → `%2B`, `/` → `%2F`, `:` → `%3A`, `?` → `%3F`, `@` → `%40`.

Put the string into an environment variable, **in single quotes** (in double quotes PowerShell substitutes `$` variables, and bash expands `!`). All commands go in the same terminal window. **An empty variable is dangerous:** `--db-url` with an empty value means the linked project, so the commands below check that it is set.

PowerShell:

```powershell
$env:DEMO_DB_URL = 'postgresql://postgres.<ref>:<PASSWORD>@<host from the string>:5432/postgres'
if (-not $env:DEMO_DB_URL) { throw "DEMO_DB_URL is not set" }
npx supabase db query --db-url $env:DEMO_DB_URL -f supabase/demo/load-seed.sql
```

bash:

```bash
export DEMO_DB_URL='postgresql://postgres.<ref>:<PASSWORD>@<host from the string>:5432/postgres'
npx supabase db query --db-url "${DEMO_DB_URL:?DEMO_DB_URL is not set}" -f supabase/demo/load-seed.sql
```

In the same way — with `--db-url` instead of `--linked` or instead of linking — `db push` (step 2) and `select demo.reset()` (step 4) work.
