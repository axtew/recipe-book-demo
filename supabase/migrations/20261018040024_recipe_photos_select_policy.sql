-- Reading objects of the recipe-photos bucket by the authenticated role.
--
-- Replacing a recipe cover is an upload with upsert over the same path
-- `<recipe id>/cover.webp`. Postgres executes it as `insert … on conflict do
-- update`, and the conflict branch needs the right to read the existing row;
-- without a select policy an upload with upsert fails with 403 "new row violates
-- row-level security policy", even though insert and update policies exist.
--
-- Public photo links do not depend on this policy — the bucket is public.
-- The anon role gets no access.

create policy "authenticated can read photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'recipe-photos');
