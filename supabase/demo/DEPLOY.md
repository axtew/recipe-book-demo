# Демо-стенд: развернуть у себя

Как поднять собственный демо-стенд: отдельный проект Supabase, демо-сборка приложения и Cloudflare Worker, который не даёт бесплатному проекту уйти на паузу. Если у вас есть отдельный рабочий проект Supabase, ничего из ниже перечисленного его не затрагивает — пока вы не забудете флаг `--db-url` (см. шаг 2).

Команды приведены в двух вариантах: сначала PowerShell 7, затем bash. Если команда одинакова для обоих — блок подписан «PowerShell и bash». Все команды выполняются из корня репозитория. **Команды шагов 2 и 4 выполняйте в одном окне терминала:** адрес базы живёт в переменной окружения этого окна.

**Секреты в репозиторий не попадают.** Пароль базы и ключ secret — только в переменных окружения текущего терминала, как ниже. `.env.demo` и `wrangler.demo.jsonc` получают только адрес проекта и publishable key: он публичен и так уезжает в бандл.

## Что в итоге получится

- Проект Supabase (в примерах `recipe-book-demo`) с теми же миграциями, что и рабочий, регистрацией выключенной и одним общим пользователем.
- В базе схема `demo` с эталоном и функцией сброса; `pg_cron` раз в сутки (00:00 UTC) возвращает данные и учётку пользователя к эталону. Через REST схема `demo` недоступна.
- В бакете `recipe-photos` фото рецептов; запись в бакет закрыта для всех пользователей, только чтение.
- Worker `recipe-book-demo` на Cloudflare: статика демо-сборки плюс Cron Trigger (понедельник и четверг, 06:00 UTC), который раз в несколько дней вызывает функцию `demo_last_reset` по REST. Это нужно, чтобы бесплатный проект Supabase не ушёл на паузу после недели без активности: собственный `pg_cron` активностью, по всей видимости, не считается.

## Перед началом

1. Если у вас есть рабочий проект и Supabase CLI привязан к нему, зафиксируйте его состояние, чтобы в конце сравнить: `npx supabase migration list` (команда только читает). Запомните последнюю строку списка.
2. Войдите в Cloudflare из CLI, если ещё не входили: `npx wrangler login`.

## 1. Создать проект и пользователя

1. В [дашборде Supabase](https://supabase.com/dashboard) создайте проект с именем `recipe-book-demo` (бесплатный план). Пароль базы сохраните в менеджере паролей, в репозиторий он не попадает. Совет: задайте пароль из букв и цифр, без спецсимволов, — так его не придётся кодировать в строке подключения (шаг 2).
2. **Выключите регистрацию:** Authentication → Sign In / Providers → Email (или общий переключатель «Allow new users to sign up») → выключить. Без этого любой, кто найдёт адрес проекта, заведёт аккаунт.
3. **Заведите пользователя:** Authentication → Users → Add user → Create new user.
   - Email `demo@recipe-book.example`, пароль `demo-recipe-book` — это временная учётка из `.env.demo`, подставляемая на экране входа.
   - Отметьте «Auto Confirm User».
   - Если хотите другие логин и пароль — поменяйте их в трёх местах: `VITE_DEMO_EMAIL` и `VITE_DEMO_PASSWORD` в `.env.demo`; в `supabase/demo/setup.sql` — все вхождения почты `demo@recipe-book.example` (проверка в начале файла, константа `c_email` функции `demo.reset` и запоминание пользователя перед функцией пинга) и константу `c_password`; затем применяйте `setup.sql` (шаг 3) уже с новыми значениями. Иначе ночной сброс вернёт учётку к старым значениям.

## 2. Выкатить миграции в демо

Строка подключения: Dashboard → Connect → вкладка «Session pooler» (работает по IPv4). **Скопируйте строку целиком из дашборда** и подставьте в неё пароль базы: хост и регион у проектов разные (`aws-0-…`, `aws-1-…`), по памяти или шаблону их не угадать.

Если в пароле есть спецсимволы, закодируйте их в процентах: `%` → `%25` (кодируйте первым), пробел → `%20`, `!` → `%21`, `#` → `%23`, `$` → `%24`, `&` → `%26`, `'` → `%27`, `+` → `%2B`, `/` → `%2F`, `:` → `%3A`, `?` → `%3F`, `@` → `%40`. Проще задать пароль без них.

Адрес держим в переменной окружения. **Кавычки одинарные:** в двойных PowerShell подставит `$`-переменные и съест обратный апостроф, а интерактивный bash раскроет `!`, и команда уйдёт с искажённым паролем.

PowerShell:

```powershell
$env:DEMO_DB_URL = 'postgresql://postgres.<ref>:<ПАРОЛЬ>@<хост из дашборда>:5432/postgres'
```

bash:

```bash
export DEMO_DB_URL='postgresql://postgres.<ref>:<ПАРОЛЬ>@<хост из дашборда>:5432/postgres'
```

**Пустая переменная опасна:** `--db-url` с пустым значением означает «связанный проект», то есть рабочий. Поэтому каждая команда с `--db-url` ниже начинается с проверки, что переменная задана; не пропускайте её, а если открыли новое окно терминала — задайте переменную заново.

Сначала сухой прогон: он должен перечислить **все** миграции из `supabase/migrations/` (сверьте число с содержимым каталога). Если список пуст или короче, значит, команда смотрит не в демо — остановитесь.

PowerShell:

```powershell
if (-not $env:DEMO_DB_URL) { throw "DEMO_DB_URL не задана" }
npx supabase db push --db-url $env:DEMO_DB_URL --dry-run
```

bash:

```bash
npx supabase db push --db-url "${DEMO_DB_URL:?DEMO_DB_URL не задана}" --dry-run
```

Теперь сама выкатка (те же команды без `--dry-run`).

PowerShell:

```powershell
if (-not $env:DEMO_DB_URL) { throw "DEMO_DB_URL не задана" }
npx supabase db push --db-url $env:DEMO_DB_URL
```

bash:

```bash
npx supabase db push --db-url "${DEMO_DB_URL:?DEMO_DB_URL не задана}"
```

**CLI остаётся привязан к рабочему проекту (если он у вас есть), перелинковывать его не нужно.** Обычный `npx supabase db push` без `--db-url` по-прежнему уходит в рабочую базу — не путайте их. Без флага `--db-url` в демо ничего не попадёт.

## 3. Применить `setup.sql`

> **Внимание: файл только для демо-проекта.** Он удаляет политики записи в Storage и заводит ночное задание, стирающее таблицы приложения. Перед запуском проверьте имя проекта в шапке дашборда (вверху слева): там должен быть демо-проект (`recipe-book-demo`), а не ваш рабочий. В рабочем проекте файл не запускайте.
>
> Как страховка в начале файла стоит проверка: если в проекте нет пользователя с демо-почтой (шаг 1), файл прерывается с ошибкой «это не демо-проект» до первого изменения. Увидев её, не торопитесь создавать пользователя и запускать файл снова — сначала убедитесь, что открыт именно демо-проект.

1. Откройте файл `supabase/demo/setup.sql`, скопируйте целиком.
2. Dashboard демо-проекта → SQL Editor → New query → вставить → Run. Supabase предупредит о «potentially destructive operations» (в файле `drop policy` и функция с `truncate`) — подтвердите.
3. Ожидаемый результат: без ошибок, в конце результат `cron.schedule` с одной строкой. Файл можно запускать повторно.
4. Если на `create extension pg_cron` ошибка о правах — включите расширение в Database → Extensions → `pg_cron` и запустите файл ещё раз.

Файл создаёт схему `demo`, таблицы эталона и учётки, функцию `demo.reset()`, функцию `public.demo_last_reset()` для пинга, расписание и удаляет политики записи в Storage (в рабочей базе они остаются).

**После будущих миграций** (миграции общие для рабочей и демо-базы): если миграция заводит новую таблицу приложения, добавьте её в список `truncate` в `demo.reset()` (`supabase/demo/setup.sql`), иначе она переживёт ночной сброс; если миграция пересоздаёт или добавляет политики записи Storage, добавьте их в `drop policy` в конце файла. После правки запустите `setup.sql` в демо ещё раз.

## 4. Загрузить эталон и фото

### Эталон

`supabase/demo/load-seed.sql` — один `INSERT` на 327 КБ, слишком велик для SQL Editor, поэтому его выполняет CLI (`db query` принимает ровно один оператор, этот файл подходит).

PowerShell:

```powershell
if (-not $env:DEMO_DB_URL) { throw "DEMO_DB_URL не задана" }
npx supabase db query --db-url $env:DEMO_DB_URL -f supabase/demo/load-seed.sql
```

bash:

```bash
npx supabase db query --db-url "${DEMO_DB_URL:?DEMO_DB_URL не задана}" -f supabase/demo/load-seed.sql
```

Теперь первый сброс: он очищает таблицы приложения, заливает эталон и возвращает учётку демо-пользователя. Ожидаемый ответ: `{"recipes": 20, "products": 65, "cook_logs": 39}`.

PowerShell:

```powershell
if (-not $env:DEMO_DB_URL) { throw "DEMO_DB_URL не задана" }
npx supabase db query --db-url $env:DEMO_DB_URL "select demo.reset()"
```

bash:

```bash
npx supabase db query --db-url "${DEMO_DB_URL:?DEMO_DB_URL не задана}" "select demo.reset()"
```

То же можно выполнить в SQL Editor: `select demo.reset();`.

### Фото

Нужен ключ secret демо-проекта: Dashboard → Project Settings → API Keys → `secret` (не publishable). Он обходит политики Storage и никуда не записывается. Ключ вводится без отображения на экране (в PowerShell `-MaskInput` — PowerShell 7.1+).

PowerShell:

```powershell
$env:SUPABASE_URL = 'https://<ref>.supabase.co'
$env:SUPABASE_SECRET_KEY = Read-Host -MaskInput "Ключ secret демо-проекта"
node supabase/demo/upload-photos.mjs
Remove-Item Env:SUPABASE_SECRET_KEY
```

bash:

```bash
export SUPABASE_URL='https://<ref>.supabase.co'
read -rsp "Ключ secret демо-проекта: " SUPABASE_SECRET_KEY && export SUPABASE_SECRET_KEY
node supabase/demo/upload-photos.mjs
unset SUPABASE_SECRET_KEY
```

Скрипт кладёт 20 файлов из `supabase/demo/photos/` в бакет `recipe-photos` по путям `<id рецепта>/cover.webp` (список — `supabase/demo/photos.json`). Ожидаемый итог: `Загружено 20 из 20.` Повторный запуск безопасен.

## 5. Прописать адрес и ключ

Адрес проекта и publishable key: Dashboard → Project Settings → API. Значения нужны в двух файлах:

- `.env.demo` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (на месте заглушек `REPLACE-ME`);
- `wrangler.demo.jsonc` — `vars.SUPABASE_URL`, `vars.SUPABASE_PUBLISHABLE_KEY` (те же значения; скрипт пинга читает их отсюда, потому что `.env.demo` Worker не видит).

Оба значения публичны, оба файла коммитятся. Секретные ключи — ни в один из них.

## 6. Собрать и выкатить

Одна команда: `deploy:demo` сама вызывает `build:demo`. PowerShell и bash:

```
pnpm deploy:demo
```

Первый запуск создаст Worker `recipe-book-demo` на вашем поддомене `workers.dev` и зарегистрирует Cron Trigger. Адрес выведет wrangler.

> **Предупреждение. `VITE_DEMO` не должна попасть в сборку рабочего Worker.** Vite подхватывает `VITE_*` из переменных окружения процесса и они приоритетнее файлов `.env.*`. Не добавляйте `VITE_DEMO` (и `VITE_DEMO_EMAIL` / `VITE_DEMO_PASSWORD`) в Cloudflare → рабочий Worker → Settings → Build → Variables and secrets и не задавайте их в терминале перед рабочей сборкой: рабочее приложение превратится в демо с плашкой и закрытой загрузкой фото. Демо собирается и выкатывается только командой `pnpm deploy:demo` с вашей машины, а автосборки из репозитория у него нет.

## Как проверить

1. **Демо открывается.** Адрес из вывода `deploy:demo`: видна плашка «Демо-версия…», на экране входа логин и пароль уже подставлены, «Войти» входит одним нажатием, в списке 20 рецептов с фото.
2. **Сброс работает.** В приложении измените что-нибудь (например, название рецепта), затем вызовите сброс (команда из шага 4) и обновите страницу: данные вернулись. Демо-логин после сброса по-прежнему входит.
3. **Задание `pg_cron` в списке.** SQL Editor (или `db query`):

   ```sql
   select jobid, jobname, schedule, active from cron.job;
   ```

   Ожидается одна строка `demo-nightly-reset`, `0 0 * * *`, `active = t`. На следующий день проверьте, что оно отработало:

   ```sql
   select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5;
   ```

4. **Запись в Storage закрыта, чтение работает.** Фото открывается по публичной ссылке (подставьте любой путь из `supabase/demo/photos.json`). PowerShell и bash:

   ```
   curl.exe -sI "https://<ref>.supabase.co/storage/v1/object/public/recipe-photos/<id рецепта>/cover.webp"
   ```

   Ожидается `HTTP/2 200` в первой строке. (В bash вместо `curl.exe` годится обычный `curl`.) Загрузка от имени демо-пользователя должна отклоняться.

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

   Ожидается ответ с `403` и `new row violates row-level security policy`. Если вместо этого пришёл `Successfully uploaded`, политики записи не удалились — перезапустите `setup.sql` и удалите объект `check/cover.webp` в дашборде.

5. **Пинг доходит до Postgres.** PowerShell и bash (publishable key — из шага 5):

   ```
   curl.exe -s -X POST "https://<ref>.supabase.co/rest/v1/rpc/demo_last_reset" -H "apikey: <publishable key>" -H "Content-Type: application/json" -d "{}" -w "\nHTTP %{http_code}\n"
   ```

   Ожидается время последнего сброса в кавычках (после первого сброса) или `null`, и строка `HTTP 200`. Cron Trigger виден в Cloudflare → Workers → `recipe-book-demo` → Settings → Triggers (`0 6 * * 1,4`); отработавшие запуски — во вкладке Logs.

6. **Рабочая база не изменилась** (если она у вас есть). `npx supabase migration list` по вашему рабочему проекту (CLI привязан к нему) выдаёт тот же список, что и в «Перед началом»: без новых строк.

7. **Через две недели после запуска.** Убедитесь, что письма Supabase «project will be paused» не приходило. Если пришло — пинг по Cron Trigger не считается активностью: замените его другим способом (например, плановым запуском GitHub Actions, который дёргает тот же `rpc`).

## Если что-то пошло не так

- `db push` показывает пустой или короткий список — вы без `--db-url` или с чужой строкой: он смотрит в ваш рабочий проект. Ничего не применяйте, исправьте переменную `DEMO_DB_URL` (она задаётся в том же окне терминала).
- `setup.sql` прерывается ошибкой «это не демо-проект» — открыт не тот проект или не заведён пользователь из шага 1.
- `setup.sql` снова прерывается ошибкой «это не демо-проект», хотя проект верный, — посетитель сменил почту демо-пользователя до ночного сброса. Сначала выполните `select demo.reset();` (вернёт почту), затем перезапустите `setup.sql`.
- Демо входит, но данных нет — не выполнен шаг 4 (эталон и первый сброс).
- Демо входит, но фото не грузятся (пустые карточки) — не выполнена загрузка фото или бакет называется иначе, чем `recipe-photos`.
- Сброс жалуется `demo_seed_not_loaded` — таблица эталона пуста, повторите загрузку эталона.
- Сброс предупреждает, что демо-пользователь не найден, — его удалили или сменили почту и пользователь потерян; создайте его заново (шаг 1) и перезапустите `setup.sql`.
- В журнале `wrangler` пинг падает с «не заполнены SUPABASE_URL» — шаг 5 не сделан для `wrangler.demo.jsonc`.
