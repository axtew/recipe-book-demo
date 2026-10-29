-- Revoke all privileges on schema public from the anon role.
--
-- Why, if RLS already hides the data. Access rests on two independent lines of
-- defence: first the grant ("may the table be touched at all"), then the RLS
-- policy ("which rows are visible"). In the local image anon was also rejected by
-- the grant, but in the cloud project it turned out to have SELECT — so only one
-- line of defence worked there. A forgotten RLS on a future table would have
-- meant exposed data, not an empty response.
--
-- Anonymous access is not intended for any table in this application.
--
-- Sign-up and future family groups are unaffected: registered users access data
-- as authenticated, and sign-up itself goes through GoTrue at /auth/v1,
-- bypassing PostgREST and these grants.
--
-- If a public recipe link without login is ever needed — grant anon SELECT
-- narrowly on the required table together with a policy like
-- using (is_public = true), rather than returning the access wholesale.

revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;

-- For tables that future migrations will create (they run as postgres). Default
-- privileges are bound to the creating role, so the set defined by the
-- supabase_admin role is not cancelled by this — the guarantee comes not from
-- this line but from the new-table checklist in phase-1-tutorial.md.
alter default privileges in schema public revoke all on tables    from anon;
alter default privileges in schema public revoke all on sequences from anon;
