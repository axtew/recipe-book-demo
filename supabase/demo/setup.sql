-- Demo Supabase project setup: seed, nightly reset, closed write access to Storage.
--
-- This file is applied ONLY to the demo project and deliberately lives outside
-- `supabase/migrations/`: migrations are shared by the working database and the
-- demo, and the function that wipes all tables must not reach the working
-- database under any `db push`. Order of application — `supabase/demo/DEPLOY.md`.
--
-- Re-running is safe: tables and the schema are created "if not exists", functions
-- are recreated, the schedule is overwritten by name, policies are dropped "if exists".
-- The seed (data from `seed.json`) is not touched by this file — `load-seed.sql` loads it.
--
-- Run in psql only with `-v ON_ERROR_STOP=1`: without it psql goes on after an
-- error, and the check below protects nothing. The SQL Editor runs the file as a
-- single query, that is one transaction: an error rolls everything back.

-- Guard against running in the wrong project. The file drops the Storage write
-- policies and creates a nightly job that wipes the application tables; the
-- working database must have neither. The owner creates the user with the demo
-- email in the demo project before running the file (step 1 in DEPLOY.md); the
-- working database has none. The email is the same as `c_email` in `demo.reset()`
-- and in the user-remembering step below: change it there — change it everywhere.
-- The check comes before the first change.
do $$
declare
  c_email constant text := 'demo@recipe-book.example';
begin
  if not exists (select 1 from auth.users u where u.email = c_email) then
    raise exception
      'setup.sql: no user % in this project - this is not the demo project (or step 1 of DEPLOY.md was skipped). Nothing was changed.',
      c_email;
  end if;
end;
$$;

-- The `demo` schema is not in the PostgREST schema list, so neither the seed table
-- nor the reset function itself can be called over REST under any grants. One
-- function in `public` is exposed outward (to the anon role) — `demo_last_reset` below.
create schema if not exists demo;
revoke all on schema demo from public;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;

-- The seed. A single row (`id = 1`): the whole version 1 backup file, as
-- `public.import_backup` accepts it. Neither anon nor authenticated has grants, RLS
-- is enabled on top — the table is available only to the owner (the postgres role,
-- under which `pg_cron` and the SQL Editor run).
create table if not exists demo.seed (
  id         integer primary key check (id = 1),
  data       jsonb not null,
  loaded_at  timestamptz not null default now(),
  reset_at   timestamptz
);

alter table demo.seed enable row level security;
revoke all on demo.seed from public, anon, authenticated;

-- Which auth.users user is the demo account. `demo.reset()` finds it by email,
-- and if a visitor managed to change the email — by this identifier. It is
-- remembered on every run of the file (below), while the email is still correct.
create table if not exists demo.account (
  id       integer primary key check (id = 1),
  user_id  uuid not null
);

alter table demo.account enable row level security;
revoke all on demo.account from public, anon, authenticated;

-- Reset to the seed. Returns the same as `import_backup`: how many products,
-- recipes and cook log entries were loaded.
--
-- security definer: owner rights are needed for TRUNCATE and for the `auth` tables.
-- Only `pg_cron` and the project owner from the SQL Editor call it.
--
-- User data tables are cleared entirely, including both category tables: a visitor
-- could have added their own, and the seed brings its own (in `seed.json` dish
-- categories have their own ids, and the import matches them by name).
-- The load goes through the existing `import_backup` function, so the import logic
-- is not duplicated; it also requires an empty database, which is satisfied after TRUNCATE.
--
-- The demo user's account is returned to the values below: a visitor with an open
-- console could have changed the password or email. These are public values — they
-- are written in the README and live in `.env.demo`. Change it there — change it
-- here too (including in the check at the start of the file), and re-run the file.
create or replace function demo.reset()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_email constant text := 'demo@recipe-book.example';
  c_password constant text := 'demo-recipe-book';
  v_seed jsonb;
  v_result jsonb;
  v_user_id uuid;
begin
  -- Two resets in a row (cron and a manual call) must not run concurrently.
  perform pg_advisory_xact_lock(hashtext('demo.reset'));

  select s.data into v_seed from demo.seed s where s.id = 1;
  if v_seed is null then
    raise exception 'demo_seed_not_loaded';
  end if;

  -- In one statement: the circular references products <-> product_variants and the
  -- recipe links need not be checked when all tables are cleared together.
  truncate table
    public.cook_logs,
    public.recipe_ingredients,
    public.recipe_steps,
    public.recipe_dish_categories,
    public.recipes,
    public.product_variants,
    public.products,
    public.product_categories,
    public.dish_categories;

  v_result := public.import_backup(v_seed);

  -- Demo user: by email; if the email was changed — by the identifier
  -- remembered in `demo.account`. The function does not touch other users.
  select u.id into v_user_id from auth.users u where u.email = c_email;
  if v_user_id is null then
    select u.id into v_user_id
    from demo.account a
    join auth.users u on u.id = a.user_id
    where a.id = 1;
  end if;

  if v_user_id is null then
    raise warning 'demo.reset: demo user not found (deleted?), account not restored. Create it again and re-run setup.sql';
  else
    update auth.users u
    set email = c_email,
        encrypted_password = extensions.crypt(c_password, extensions.gen_salt('bf')),
        email_confirmed_at = coalesce(u.email_confirmed_at, now()),
        banned_until = null,
        updated_at = now()
    where u.id = v_user_id
      and (
        u.email is distinct from c_email
        or u.encrypted_password is distinct from extensions.crypt(c_password, u.encrypted_password)
        or u.banned_until is not null
      );

    update auth.identities i
    set identity_data = i.identity_data || jsonb_build_object('email', c_email),
        updated_at = now()
    where i.user_id = v_user_id
      and i.provider = 'email'
      and i.identity_data ->> 'email' is distinct from c_email;
  end if;

  update demo.seed s set reset_at = now() where s.id = 1;

  return v_result;
end;
$$;

revoke execute on function demo.reset() from public, anon, authenticated;

-- Remember the demo user (the check at the start of the file guarantees it exists).
insert into demo.account (id, user_id)
select 1, u.id from auth.users u where u.email = 'demo@recipe-book.example'
on conflict (id) do update set user_id = excluded.user_id;

-- Ping for the free project. A Supabase project falls asleep after a week without
-- activity, and its own `pg_cron` does not count as activity. The demo Worker's
-- Cron Trigger calls this function over REST every few days — the request reaches
-- Postgres and returns 200. It returns only the time of the last reset.
create or replace function public.demo_last_reset()
returns timestamptz
language sql
stable
security definer
set search_path = ''
as $$
  select s.reset_at from demo.seed s where s.id = 1;
$$;

revoke execute on function public.demo_last_reset() from public;
grant execute on function public.demo_last_reset() to anon, authenticated;

-- Nightly reset. `pg_cron` runs in UTC: midnight UTC is 03:00 in Moscow.
-- `cron.schedule` with the same name overwrites the job rather than creating a second one.
select cron.schedule('demo-nightly-reset', '0 0 * * *', 'select demo.reset()');

-- Storage: only reading stays in the demo bucket. The write policies from the `init`
-- migration are dropped; the read policy and the bucket's public status are
-- untouched, photos are still served. The owner uploads files with the secret key,
-- bypassing policies. In the working database these policies stay — the file is not
-- applied to it.
drop policy if exists "authenticated can upload photos" on storage.objects;
drop policy if exists "authenticated can update photos" on storage.objects;
drop policy if exists "authenticated can delete photos" on storage.objects;
