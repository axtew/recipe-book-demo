-- Чтение объектов бакета recipe-photos ролью authenticated.
--
-- Замена обложки рецепта — загрузка с upsert поверх того же пути
-- `<id рецепта>/cover.webp`. Postgres выполняет её как `insert … on conflict do
-- update`, а для конфликтной ветки нужно право читать существующую строку;
-- без политики select загрузка с upsert падает с 403 «new row violates row-level
-- security policy», хотя политики на insert и update есть.
--
-- Публичные ссылки на фото от этой политики не зависят — бакет публичный.
-- Роли anon доступ не выдаётся.

create policy "authenticated can read photos" on storage.objects
  for select to authenticated
  using (bucket_id = 'recipe-photos');
