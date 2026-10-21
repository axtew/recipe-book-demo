# Локальное окружение

**Облако — рабочая база семьи, в ней живые рецепты. Тестовые данные туда не пишутся никогда.** Любая живая проверка — только на локальном стеке.

| Команда | Куда смотрит |
|---|---|
| `pnpm dev` | локальный Supabase (`.env.development`) |
| `pnpm build`, `pnpm preview` | облако (`.env.production`) |
| `pnpm dev:prod` | дев-сервер против облака — только посмотреть, ничего не записывая |

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
