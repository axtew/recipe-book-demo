Status: COMPLETED

# Фаза 12 — Экспорт, импорт, настройки. Итерация 1

## Phase goal

Бэкап есть с первой версии (экспорт в JSON, импорт в пустую базу), категории продуктов и блюд переименовываются и переупорядочиваются, на экране `/settings` есть выход.

**Миграция применена только локально. Владельцу нужно выполнить `npx supabase db push` до выкатки фронта.** Облако не трогалось: `db push` не запускался, `migration list` без `--local` только читал список.

## What was implemented

**Миграция `20261021090000_backup_export_import.sql`** — две функции по образцу `create_product_with_variant` (`security invoker`, `set search_path = ''`, схемы в именах, `revoke … from public, anon`, `grant … to authenticated`):

- `export_backup()` возвращает jsonb со всеми девятью таблицами одним SELECT. Причины не делать девять запросов с клиента: один согласованный снимок и `max_rows = 1000` в `supabase/config.toml` (обычный `select *` молча обрезал бы большие таблицы, а бэкап с тихой потерей строк хуже его отсутствия).
- `import_backup(p_backup jsonb)`: `lock table … share row exclusive` по продуктам, вариантам, рецептам и журналу, затем проверка пустоты, затем вставки в порядке зависимостей. Круговая ссылка product ↔ variant проходит через отложенный составной FK. Возвращает счётчики. Отказ на непустой базе — исключение с текстом `backup_target_not_empty`; сервис превращает его в результат `{status: "notEmpty"}`, а не в ошибку.

**Что такое «пустая база» и как обработаны стартовые категории (решение исполнителя, проверено на `db reset`):**

- Свежая база после всех миграций: `product_categories` = 0, `dish_categories` = 7, продукты, варианты, рецепты, журнал = 0. Засеянные в `reference_data` продукты и категории продуктов удаляются миграцией `policies_dish_categories_cleanup`, поэтому правило «только в пустую» выполнимо, плановой развилки нет.
- «Пусто» = нет строк в `products`, `product_variants`, `recipes`, `cook_logs`. Категории пользовательскими данными не считаются.
- Категории файла согласуются с категориями базы в обеих таблицах: тот же `id` — обновляется; иначе то же имя — существующая строка получает `id` из файла (ссылки из файла остаются верными, семь стартовых категорий блюд не удваиваются; безопасно, потому что в пустой базе на категории никто не ссылается); иначе добавляется. Категории базы, которых нет в файле, остаются: права `DELETE` нет.

**`src/domain/backup/`** (чистый модуль, без React, Supabase и Mantine): `backupSchema` — строгая схема файла (`version: 1`, `exported_at`, девять таблиц строками-колонками в snake_case, потому что это формат дампа таблиц, а не сущность приложения); ограничения повторяют check'и базы; `snapshot` проверяется существующей `nutritionSnapshotSchema`; `superRefine` проверяет уникальность `id`, висящие ссылки, принадлежность активного/закреплённого варианта своему продукту, дубли связей рецепт-категория, `finished_at >= cooked_at`. `parseBackup(text)` ничего не бросает и возвращает код отказа (`notJson`, `notBackup`, `unsupportedVersion`, `invalid` + путь первой проблемы вида `products[2].name`). Схема строгая намеренно: колонка, которой схема не знает, ломает выгрузку, а не пропадает из файла молча.

**Слой данных:** `backup.service.ts` (выгрузка проходит ту же схему, что и импорт), `categories.service.ts` (`renameCategory`; `reorderCategories` — один `upsert` всего списка: один запрос = одна транзакция, `rpc` не нужен), мутации `backup.mutations.ts` и `categories.mutations.ts` с инвалидацией (после импорта — все пять ключей данных). В `_queryClient.ts` общий обработчик ошибок пропускает мутации с `meta.showsOwnError`, иначе экспорт и импорт получали бы тост про «сохранение».

**Экран `/settings`** (`src/pages/SettingsPage/`, роут вместо `SettingsStub`): `ExportBlock`, `ImportBlock`, `CategoriesEditor` (`CategoryList` → `CategoryRow`), общая обёртка `Section`, кнопка «Выйти». Использованы общие `Button`, `STextInput` (44px, 16px), типографика; тексты в `ru.json`, нейтральные по роду. Выход: `useSignOut` в `useAuth.hook.ts` (в проекте выхода до этого нигде не было), затем переход на `/login` и только после него `queryClient.clear()`, чтобы данные семьи не оставались в кэше и IndexedDB (очистка до перехода запустила бы перезагрузку данных без сессии).

**Зависимости:** не добавлялись. Скачивание — `Blob` + `<a download>`, чтение — `File.text()`. **`CACHE_BUSTER` не поднимался:** формы сущностей в кэше не менялись.

### UIKit wrappers

- `SNameInput` (`styled(STextInput)`) в `CategoryRow/_styles.ts`: `flex: 1; min-width: 0` — раскладка в строке рядом со стрелками, пропсами `STextInput` не выражается. `STextInput` — компонент проекта, не примитив Mantine.

## Files created

- `supabase/migrations/20261021090000_backup_export_import.sql` — `export_backup`, `import_backup`
- `src/domain/backup/{_constants.ts,_schema.ts,_parse.ts,_types.ts,index.ts}` — формат и разбор файла
- `src/domain/backup/__tests__/backup.test.ts` — 13 тестов модуля
- `src/api/services/backup.service.ts`, `src/api/mutations/backup.mutations.ts`
- `src/api/mutations/categories.mutations.ts`
- `src/types/backup.types.ts`, `src/types/categories.types.ts`
- `src/utils/helpers/files.ts` (`downloadTextFile`), `src/utils/helpers/strings.ts` (`fillTemplate`)
- `src/pages/SettingsPage/{index.ts,_SettingsPage.tsx,_styles.ts,_useSettingsPage.ts}`
- `src/pages/SettingsPage/_internal/Section/{index.ts,_Section.tsx,_styles.ts}`
- `src/pages/SettingsPage/_internal/ExportBlock/{index.ts,_ExportBlock.tsx,_useExportBlock.ts}`
- `src/pages/SettingsPage/_internal/ImportBlock/{index.ts,_ImportBlock.tsx,_useImportBlock.ts,_styles.ts}`
- `src/pages/SettingsPage/_internal/CategoriesEditor/{index.ts,_CategoriesEditor.tsx,_styles.ts}`
- `src/pages/SettingsPage/_internal/CategoriesEditor/_internal/CategoryList/{index.ts,_CategoryList.tsx,_useCategoryList.ts,_styles.ts}`
- `src/pages/SettingsPage/_internal/CategoriesEditor/_internal/CategoryList/_internal/CategoryRow/{index.ts,_CategoryRow.tsx,_useCategoryRow.ts,_styles.ts}`
- `plans/recipe-book-v1/phase-12/iter-1/DEV-REPORT.md`

## Files modified

- `src/types/database.types.ts` — перегенерирован `pnpm db:types` (только две новые строки: `export_backup`, `import_backup`)
- `src/api/services/categories.service.ts` — `renameCategory`, `reorderCategories`
- `src/api/queries/categories.queries.ts` — ключи категорий экспортированы (importer: мутации)
- `src/hooks/useAuth.hook.ts` — `useSignOut`
- `src/app/_queryClient.ts` — `meta.showsOwnError` в общем обработчике ошибок
- `src/routes/_routes.tsx` — роут `/settings` на `SettingsPage`, `SettingsStub` удалён
- `public/dictionaries/ru.json`, `src/types/i18n.types.ts` — ветка `settings`
- `plans/recipe-book-v1/EXECUTION.md` — запись о фазе

## Verification

Baseline: переиспользован `plans/recipe-book-v1/baseline/` (чистый: lint и build без замечаний); заново не снимался.

Команды (все из плана / профиля, без замен):

- `pnpm lint` — чисто, 0 замечаний. Один раз до этого была ошибка порядка импортов, исправлена `eslint --fix` на папке `src/pages/SettingsPage`.
- `pnpm build` — exit 0 (`vite build && tsc -b`); предупреждение о размере чанка существовало и раньше.
- `pnpm test` — 12 файлов, 99/99 (было 86, +13 модуля бэкапа).
- `npx prettier --check src` — единственное замечание в `src/components/Typography/Head/_Head.tsx`, файл мной не менялся (существовавшее). Мои файлы отформатированы адресно, не репо-широко.
- `npx supabase migration up` (локально) и `pnpm db:types` — выполнены; в diff типов только две строки.

**Пункты «Проверки» фазы и дополнения** (живая проверка: локальный стек, дев-сервер `pnpm dev`, headless-скрипт Playwright вне репозитория; сравнение «до/после» — `export_backup()` из psql против файла и против базы после импорта, ключи и порядок отсортированы):

1. **Экспорт скачивает файл со всеми таблицами и полем `version`.** Выполнено. Имя `recipe-book-backup-2026-10-21.json`, `version: 1`, `exported_at`, девять таблиц (категории продуктов 5, блюд 7, продукты 13, варианты 17, рецепты 2, шаги 5, связи категорий 4, ингредиенты 5, журнал 2, включая архивный рецепт). Содержимое файла равно `export_backup()` по всем таблицам (`ALL EQUAL`).
2. **Импорт битого файла отклоняется с внятным сообщением и ничего не пишет.** Выполнено на шести файлах: не JSON; JSON без `version`; `version: 2`; висящая ссылка шага на рецепт (`recipe_steps[0].recipe_id`); число вместо названия (`products[0].name`); битый `snapshot` (`cook_logs[0].snapshot.nutrition`). Для каждого показано русское сообщение с «Ничего не изменено», база после — равна исходной по всем таблицам. Битый файл не доходит до базы, так как отвергается на клиенте до `rpc`.
3. **Импорт валидного файла на пустой базе восстанавливает состояние один в один.** Выполнено: `npx supabase db reset` → дев-пользователь создан по `CLAUDE.md`, `dev-data.sql` не применялся → база: 0 продуктов, 7 категорий блюд. Импорт файла экспорта через экран: «Импортировано: продуктов — 13, рецептов — 2, записей журнала — 2». Все девять таблиц совпали с исходными включая `id` и метки времени (`ALL EQUAL`); категорий блюд осталось 7 (перепривязаны по имени, не удвоены); данные видны в приложении без перезагрузки.
4. **Категории переименовываются и переупорядочиваются, `sort_order` сохраняется.** Выполнено на обеих группах: переименование по Enter и по потере фокуса, пустое название откатывается, перестановка стрелками (крайние стрелки отключены), после перезагрузки страницы порядок и имена те же, в базе `sort_order` 10, 20, 30… в показанном порядке. Поле 191x44px, кнопка 41x44px, шрифт поля 16px, на ширине 320px.
5. **Дополнение: импорт в базу с хотя бы одним продуктом или рецептом отклоняется, в базе ничего не меняется.** Выполнено двумя способами: через экран повторный импорт в заполненную базу показывает «В базе уже есть данные: импорт возможен только в пустую базу. Ничего не изменено.» (две проверки — до и после `db reset`), база не изменилась. Отдельно в psql под ролью `authenticated`: функция бросает `backup_target_not_empty`.
6. **Выход.** На `/settings` кнопка «Выйти» ведёт на `/login`, защищённый роут после этого снова редиректит на `/login`; снимок кэша в IndexedDB после выхода без запросов (0 запросов, 85 символов).

Дополнительные проверки функции в psql (всё в транзакциях с откатом):
- атомарность: дубль `id` в последней вставке (`cook_logs`) после вставки всех остальных таблиц — после отката продуктов, рецептов и категорий 0;
- перепривязка категорий продуктов по имени под ролью `authenticated`: совпавшая по имени получила `id` из файла, лишняя категория осталась;
- `anon` получает `42501 permission denied for function` на обе функции.

Exports: у каждого нового `export` есть импортёр вне модуля. Лишние экспорты, найденные при проверке (`TBackupParseResult` из barrel, `IBackupImportCounts`), убраны. Provisioned-символов нет.

Phase stop condition: выполнено. В фазе пометка «🔒 владелец (шаг B9)» устарела по дополнению 2026-10-20 — модуль написан исполнителем.

Runtime на устройстве: **не проверялось на iPhone** — ни скачивание через `<a download>` (в том числе из PWA с домашнего экрана, где скачивание файлов на iOS исторически капризно), ни системный выбор файла, ни поведение клавиатуры в строках категорий. Проверка шла в headless Chromium на 320 и 390 px.

Состояние локальной среды: после проверок снова выполнены `db reset`, создание дев-пользователя и `supabase/dev-data.sql` (5 категорий продуктов, 7 блюд, 13 продуктов, 1 рецепт, 1 пользователь) — окружение как до фазы, плюс новая миграция. Временные файлы (скрипты, выгрузки) лежали во временной папке сессии вне репозитория; `.playwright-mcp` в корне не создавалось.

## Known issues / follow-ups

- **Нужен `npx supabase db push`** (две функции, ничего в таблицах не меняется). Без него экран экспорта и импорта в облаке не заработает (`rpc` вернёт 404).
- **Создание и архивирование категорий не делались** (вне плана). Переименование и порядок есть. Новая категория по-прежнему заводится через SQL; запись в `BACKLOG.md` («Экран управления справочником категорий») остаётся актуальной, `BACKLOG.md` я не правил.
- **Скачивание файла на iPhone/PWA не проверено**; при проблемах запасной путь — Web Share API или показ текста для копирования. Решать по результату проверки владельца.
- **Лимит времени запроса.** Импорт — один `rpc` с телом всего файла; для текущих объёмов (десятки рецептов) это единицы килобайт и миллисекунды. Для базы на порядки больше стоит проверить `statement_timeout` роли `authenticated` в Supabase.
- **Мёртвый код после замены заглушки:** `src/components/RouteStub/` и ветка словаря `routeStub` больше нигде не используются (заглушка `/settings` была последней). Не удалял — вне списка файлов фазы; можно убрать отдельной правкой.
- **Дрейф плана:** в плане раздел «Конвенции» упоминает `src/api/repositories/` — в проекте это `src/api/services/`; формат файла бэкапа в плане не описан (описан здесь, в `_schema.ts`). Строки таблиц в файле — snake_case по именам колонок: сознательное исключение из правила «форма строки не выходит за слой сервисов», так как файл бэкапа и есть дамп таблиц; доменная схема при этом лежит в `src/domain/backup/` и не зависит от `database.types.ts`.
- **Отказ на непустой базе виден как `400 Bad Request` в консоли браузера** (так PostgREST отдаёт исключение функции) — ожидаемо, пользователю показывается сообщение из словаря.
- Prettier-замечание в `src/components/Typography/Head/_Head.tsx` существовало до фазы.
