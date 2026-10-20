Status: COMPLETED

# Фаза 12 — Экспорт, импорт, настройки. Итерация 2 (fix после ревью)

## Phase goal

Устранить замечания ревью итерации 1 (REVIEW.md): гонка переименования и перестановки, типизация `meta`, тип в мутации, размещение двух хелперов, строгость `snapshot`, удаление `RouteStub` (дополнение плана).

**Миграции применены только локально. Владельцу нужен `npx supabase db push`: теперь он выкатывает две миграции — `20261021090000_backup_export_import.sql` (без изменений) и новую `20261021120000_reorder_categories.sql`.** Миграция итерации 1 не редактировалась.

## What was implemented

1. **Гонка (blocking).** Выбор: rpc, не построчные `update` и не `upsert`. Построчные обновления — N запросов без общей транзакции (по CLAUDE.md многострочная запись идёт функцией); `upsert` без `name` невозможен (NOT NULL проверяется до разбора конфликта). Новая миграция `20261021120000_reorder_categories.sql`: `reorder_categories(p_kind text, p_ids uuid[])` — `security invoker`, `search_path = ''`, `revoke` у `public`/`anon`, `grant` для `authenticated`; один `UPDATE ... FROM unnest(p_ids) WITH ORDINALITY` пишет только `sort_order = ord * 10`. Имя в запрос не входит, поэтому перестановка не может откатить переименование. Неизвестный `kind` — исключение. `reorderCategories` в сервисе зовёт `supabase.rpc`; `pnpm db:types` перегенерирован (в diff типов только три функции: две из итерации 1 и новая).
2. **`meta.showsOwnError`**: `declare module "@tanstack/react-query" { interface Register { mutationMeta: { showsOwnError?: boolean } } }` в `src/app/_queryClient.ts`, рядом с `queryClient`.
3. `useReorderCategoriesMutation` принимает `ICategory[]`.
4. **Размещение:** `downloadTextFile` -> `src/pages/SettingsPage/_internal/ExportBlock/_helpers.ts`; `fillTemplate` -> `src/pages/SettingsPage/_helpers.ts`; `src/utils/helpers/files.ts` и `strings.ts` удалены; импорты в `_useExportBlock.ts` и `_useImportBlock.ts` обновлены.
5. **`snapshot`**: в `_schema.ts` `snapshotSchema = z.custom<z.infer<typeof nutritionSnapshotSchema>>().superRefine(...)` — форма проверяется `nutritionSnapshotSchema` (ошибки с путями вида `cook_logs[0].snapshot.version`), значение возвращается как есть. Так экспорт (`exportBackup` возвращает результат parse) и импорт (`parseBackup`) одинаково сохраняют неизвестные ключи внутри снимка; комментарий схемы теперь говорит именно это (строки таблиц строгие, `snapshot` — проверяется, но не обрезается). Тип выведен через `z.infer`, а не `INutritionSnapshot`: интерфейс не присваивается `Json`. Добавлен тест «не теряет неизвестные ключи внутри снимка журнала».
6. **RouteStub**: удалены `src/components/RouteStub/` и ветка `routeStub` в `ru.json` и `i18n.types.ts`. Grep по `src` и `public` на `RouteStub|routeStub|helpers/files|helpers/strings` — 0.

## Files created

Всё из итерации 1 (см. `iter-1/DEV-REPORT.md`) за вычетом `src/utils/helpers/files.ts` и `strings.ts`, плюс:
- `supabase/migrations/20261021120000_reorder_categories.sql`
- `src/pages/SettingsPage/_helpers.ts` (`fillTemplate`)
- `src/pages/SettingsPage/_internal/ExportBlock/_helpers.ts` (`downloadTextFile`)
- `plans/recipe-book-v1/phase-12/iter-2/DEV-REPORT.md`

## Files modified

Всё из итерации 1, плюс в этой:
- `src/api/services/categories.service.ts` — `reorderCategories` через `rpc("reorder_categories")`
- `src/api/mutations/categories.mutations.ts` — `ICategory[]`
- `src/app/_queryClient.ts` — `Register.mutationMeta`
- `src/domain/backup/_schema.ts` — `snapshotSchema`, комментарий
- `src/domain/backup/__tests__/backup.test.ts` — +1 тест
- `src/pages/SettingsPage/_internal/ExportBlock/_useExportBlock.ts`, `.../ImportBlock/_useImportBlock.ts` — импорты хелперов
- `src/types/database.types.ts` — `pnpm db:types` (+`reorder_categories`)
- `src/types/i18n.types.ts`, `public/dictionaries/ru.json` — удалена ветка `routeStub`
- `plans/recipe-book-v1/EXECUTION.md` — запись об итерации
Удалено: `src/components/RouteStub/` (3 файла), `src/utils/helpers/files.ts`, `src/utils/helpers/strings.ts`.

## Verification

- `pnpm lint` — exit 0, без замечаний.
- `pnpm test` — 12 файлов, 100/100 (было 99).
- `pnpm build` — exit 0 (`vite build && tsc -b`); предупреждение о размере чанка существовало.
- Prettier и `eslint --fix` — адресно по изменённым путям, без репо-широких прогонов.
- Exports: у новых символов есть импортёры (`_helpers.ts` обоих уровней, `reorder_categories` в сервисе).
- Живая проверка (локальный стек, `pnpm dev`, headless Chromium 390px, скрипт во временной папке вне репозитория, зависимости не добавлялись):
  1. Переименование первой категории продуктов и немедленный тап «Ниже» при искусственно задержанном на 800 мс ответе PATCH (худший случай гонки). После перезагрузки: `["Мясо и птица","Молочное RENAMED","Овощи",...]` — новое имя сохранено, порядок изменён.
  2. Экспорт скачал `recipe-book-backup-2026-10-21.json`, `version: 1`, 11 ключей, 13 продуктов.
  3. `db reset` (с новой миграцией) -> дев-пользователь -> импорт этого файла через экран: «Импортировано: продуктов — 13, рецептов — 1, записей журнала — 0». `export_backup()` до и после — все девять таблиц равны; файл равен `export_backup()` до сброса (без учёта порядка ключей внутри строки).
  4. Среда возвращена: `dev-data.sql` накатан заново (13 продуктов, 1 пользователь); переименование из проверки стёрто сбросом.
- Phase stop condition: выполнена. Не проверялось: iPhone/PWA (reviewer/owner), live-проверка импорта со снимком журнала (в dev-data записей журнала нет; покрыто unit-тестом).

## Known issues / follow-ups

- Нужен `npx supabase db push` (обе миграции, таблицы не меняются).
- Строка `snapshot` внутри бэкапа не обрезается и не валидируется строго по вложенным ключам — осознанно (см. п.5).
- Остальное из iter-1 (iPhone/PWA, `statement_timeout`) без изменений.
