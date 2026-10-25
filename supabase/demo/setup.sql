-- Настройка демо-проекта Supabase: эталон, ночной сброс, закрытая запись в Storage.
--
-- Этот файл применяется ТОЛЬКО к демо-проекту и сознательно лежит вне
-- `supabase/migrations/`: миграции общие для рабочей базы и демо, а функция,
-- которая стирает все таблицы, не должна попасть в рабочую базу ни при каком
-- `db push`. Порядок применения — `supabase/demo/DEPLOY.md`.
--
-- Повторный запуск безопасен: таблицы и схема создаются «если нет», функции
-- пересоздаются, расписание перезаписывается по имени, политики удаляются «если есть».
-- Эталон (данные из `seed.json`) файл не трогает — его кладёт `load-seed.sql`.
--
-- Запуск в psql — только с `-v ON_ERROR_STOP=1`: без него psql после ошибки идёт
-- дальше, и проверка ниже ничего не защитит. SQL Editor выполняет файл одним
-- запросом, то есть одной транзакцией: ошибка откатывает всё.

-- Защита от запуска не в тот проект. Файл удаляет политики записи в Storage и
-- заводит ночное задание, которое стирает таблицы приложения; в рабочей базе
-- этого быть не должно. Пользователя с демо-почтой владелец заводит в демо-проекте
-- до запуска файла (шаг 1 в DEPLOY.md), в рабочей базе его нет. Почта — та же, что
-- в `c_email` функции `demo.reset()` и в запоминании пользователя ниже: поменял там — поменяй везде.
-- Проверка стоит до первого изменения.
do $$
declare
  c_email constant text := 'demo@recipe-book.example';
begin
  if not exists (select 1 from auth.users u where u.email = c_email) then
    raise exception
      'setup.sql: в проекте нет пользователя % — это не демо-проект (или не выполнен шаг 1 из DEPLOY.md). Ничего не изменено.',
      c_email;
  end if;
end;
$$;

-- Схема `demo` не входит в список схем PostgREST, поэтому ни таблица эталона, ни
-- сама функция сброса не вызываются через REST ни при каких грантах. Наружу
-- (роли anon) выставлена одна функция в `public` — `demo_last_reset` ниже.
create schema if not exists demo;
revoke all on schema demo from public;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_cron with schema pg_catalog;

-- Эталон. Одна строка (`id = 1`): файл бэкапа версии 1 целиком, как его принимает
-- `public.import_backup`. Грантов нет ни у anon, ни у authenticated, RLS включена
-- сверху — таблица доступна только владельцу (роли postgres, под которой работает
-- `pg_cron` и SQL Editor).
create table if not exists demo.seed (
  id         integer primary key check (id = 1),
  data       jsonb not null,
  loaded_at  timestamptz not null default now(),
  reset_at   timestamptz
);

alter table demo.seed enable row level security;
revoke all on demo.seed from public, anon, authenticated;

-- Какой пользователь auth.users — демо-учётка. `demo.reset()` находит её по почте,
-- а если посетитель успел сменить почту, — по этому идентификатору. Запоминается
-- при каждом запуске файла (ниже), пока почта ещё верная.
create table if not exists demo.account (
  id       integer primary key check (id = 1),
  user_id  uuid not null
);

alter table demo.account enable row level security;
revoke all on demo.account from public, anon, authenticated;

-- Сброс к эталону. Возвращает то же, что `import_backup`: сколько продуктов,
-- рецептов и записей журнала залито.
--
-- security definer: нужны права владельца на TRUNCATE и на таблицы `auth`.
-- Вызывают её только `pg_cron` и владелец проекта из SQL Editor.
--
-- Таблицы пользовательских данных очищаются целиком, включая обе таблицы
-- категорий: посетитель мог добавить свои, а эталон приносит собственные
-- (в `seed.json` у категорий блюд свои id, и импорт сопоставляет их по названию).
-- Заливка идёт существующей функцией `import_backup`, логика импорта не
-- дублируется; она же требует пустую базу, что после TRUNCATE выполнено.
--
-- Учётка демо-пользователя возвращается к значениям ниже: посетитель с открытой
-- консолью мог сменить пароль или почту. Это публичные значения — они написаны в
-- README и лежат в `.env.demo`. Поменял там — поменяй и здесь (в том числе в
-- проверке в начале файла), перезапусти файл.
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
  -- Два сброса подряд (cron и ручной вызов) не должны идти одновременно.
  perform pg_advisory_xact_lock(hashtext('demo.reset'));

  select s.data into v_seed from demo.seed s where s.id = 1;
  if v_seed is null then
    raise exception 'demo_seed_not_loaded';
  end if;

  -- Одним оператором: циклические ссылки products <-> product_variants и связи
  -- рецептов проверять не нужно, когда очищаются все таблицы вместе.
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

  -- Демо-пользователь: по почте; если почту сменили — по идентификатору,
  -- запомненному в `demo.account`. Чужих пользователей функция не трогает.
  select u.id into v_user_id from auth.users u where u.email = c_email;
  if v_user_id is null then
    select u.id into v_user_id
    from demo.account a
    join auth.users u on u.id = a.user_id
    where a.id = 1;
  end if;

  if v_user_id is null then
    raise warning 'demo.reset: демо-пользователь не найден (удалён?), учётка не восстановлена. Создайте его заново и перезапустите setup.sql';
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

-- Запоминаем демо-пользователя (проверка в начале файла гарантирует, что он есть).
insert into demo.account (id, user_id)
select 1, u.id from auth.users u where u.email = 'demo@recipe-book.example'
on conflict (id) do update set user_id = excluded.user_id;

-- Пинг для бесплатного проекта. Проект Supabase засыпает после недели без
-- активности, а собственный `pg_cron` активностью не считается. Cron Trigger демо-
-- Worker раз в несколько дней вызывает эту функцию через REST — запрос доходит
-- до Postgres и возвращает 200. Отдаёт только время последнего сброса.
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

-- Ночной сброс. `pg_cron` работает в UTC: полночь UTC — три часа ночи по Москве.
-- `cron.schedule` с тем же именем перезаписывает задание, а не плодит второе.
select cron.schedule('demo-nightly-reset', '0 0 * * *', 'select demo.reset()');

-- Storage: в демо-бакете остаётся только чтение. Политики записи из миграции
-- `init` удаляются; политика чтения и публичность бакета не затрагиваются, фото
-- по-прежнему отдаются. Загружает файлы владелец ключом secret, в обход политик.
-- В рабочей базе эти политики остаются — файл к ней не применяется.
drop policy if exists "authenticated can upload photos" on storage.objects;
drop policy if exists "authenticated can update photos" on storage.objects;
drop policy if exists "authenticated can delete photos" on storage.objects;
