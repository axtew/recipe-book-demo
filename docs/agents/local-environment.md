# Локальное окружение

**Облако — рабочая база семьи, в ней живые рецепты. Тестовые данные туда не пишутся никогда.** Любая живая проверка — только на локальном стеке.

| Команда | Куда смотрит |
|---|---|
| `pnpm dev` | локальный Supabase (`.env.development`) |
| `pnpm build`, `pnpm preview` | облако (`.env.production`) |
| `pnpm dev:prod` | дев-сервер против облака — только посмотреть, ничего не записывая |
| `pnpm dev:demo` | демо-режим (`VITE_DEMO=true`) против локального стека (`.env.demo-local`), вход под дев-пользователем |
| `pnpm build:demo` | демо-сборка (`.env.demo`: демо-проект Supabase, заглушки, пока владелец не подставил значения) |

**Перед живой проверкой — убедиться, что окружение поднято, и поднять самому.** Владелец может забыть запустить Docker или стек; останавливаться и спрашивать из-за этого не надо.

1. `docker info`. Ошибка — Docker не запущен: `Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"` (PowerShell) и повторять `docker info`, пока не ответит; обычно до пары минут.
2. `npx supabase status`. Стек не запущен — `npx supabase start`.
3. В `product_categories` пусто — накатить дев-данные: `docker exec -i supabase_db_recipe-book psql -U postgres -d postgres < supabase/dev-data.sql`. Запускать скрипт можно, править — нет.
4. Вход в приложение: **`dev@recipe-book.local` / `devpass123`**, пользователь только локальный. Нет такого (после сброса базы) — создать одним запросом, регистрация на локальном стеке открыта:

   ```bash
   curl -s -X POST "http://127.0.0.1:54321/auth/v1/signup" -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH" -H "Content-Type: application/json" -d '{"email":"dev@recipe-book.local","password":"devpass123"}'
   ```

**Новую миграцию к локальной базе** применять через `npx supabase migration up` — она накатывает только непримененные и не трогает данные. `npx supabase db reset` стирает локальную базу целиком: после него заново накатить `dev-data.sql` и создать дев-пользователя (шаги 3–4).

**Нельзя:** `npx supabase db push` (облако — только владелец) и `npx supabase stop --no-backup` (стирает локальные данные без нужды). Писать в локальную базу через приложение можно сколько угодно — для этого она и есть.

## Демо-проект: проверка `supabase/demo/setup.sql` локально

`setup.sql` и `load-seed.sql` применяются к локальному стеку только для проверки, и после неё базу нужно вернуть к дев-состоянию. `setup.sql` содержит несколько операторов, а `supabase db query` принимает один, поэтому файл подаётся в `psql` внутри контейнера:

```bash
docker exec -i supabase_db_recipe-book psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/demo/setup.sql
npx supabase db query --local -f supabase/demo/load-seed.sql   # один INSERT — подходит
docker exec -i supabase_db_recipe-book psql -U postgres -d postgres -c "select demo.reset()"
```

Сброс очищает таблицы приложения, поэтому дев-данные после проверки пропадают; пароль он меняет только пользователю `demo@recipe-book.example`, дев-пользователя не трогает. Полный возврат: удалить загруженные в `recipe-photos` объекты через Storage API (иначе файлы останутся в томе сиротами), затем `npx supabase db reset`, `dev-data.sql` и дев-пользователь (шаги 3–4 выше). `db reset` заодно возвращает политики Storage, стирает расписание `pg_cron` и демо-пользователя.

`setup.sql` в начале проверяет, что в проекте есть пользователь `demo@recipe-book.example`, и без него прерывается. В локальном стеке дев-пользователь называется иначе, поэтому перед применением файла (и в проверке «не тот проект») заведите такого пользователя: либо Studio → Authentication → Add user (`demo@recipe-book.example`, любой пароль, Auto Confirm), либо SQL-запросом через `auth.users` — после проверки он уйдёт вместе с `db reset`. Порядок применения в облаке — `supabase/demo/DEPLOY.md`.
