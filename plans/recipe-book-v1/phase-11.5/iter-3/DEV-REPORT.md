Status: COMPLETED

# Фаза 11.5, итерация 3 — DEV-REPORT

## Phase goal
Исправить два замечания ревью итерации 2: размер ячейки дня через тему Mantine вместо глобального CSS-хака; переписать комментарий у `DatePickerInput`.

## What was implemented
1. Размер ячейки дня задан в `src/theme/_mantineTheme.ts`: `DatePicker.extend({ styles: { day } })` и `styles: { day }` у `DatePickerInput.extend`, общая константа `DAY_SIZE_VARS` = `--day-size-sm` и `--day-size-md` по 44px (покрывает явный `size="md"` у `DatePicker`). Переопределяются переменные шкалы, не `--day-size`: Mantine пишет в `--day-size` ссылку на них inline в стиле ячейки и значение из `styles` её не перебивает (проверено живьём: первая попытка с `--day-size` дала 42x42). Переменные `xs`/`lg`/`xl` не трогаются: в проекте не используются.
2. Из `src/theme/_GlobalStyle.ts` убраны переопределение, импорт `Day` и комментарий (файл совпадает с HEAD).
3. Комментарии у `DatePicker`/`DatePickerInput` переписаны на Russian, сначала что делает настройка. `modalProps` и `SPicker` margin не менялись: геометрия та же.

## Files created
Нет (итерации 1-2: см. их DEV-REPORT).

## Files modified (cumulative по итерации 3)
- `src/theme/_mantineTheme.ts` — `DAY_SIZE_VARS`, `DatePicker.extend`, `styles.day` у `DatePickerInput`, комментарии.
- `src/theme/_GlobalStyle.ts` — возвращён к виду HEAD (override удалён).
- Остальное из итераций 1-2 без изменений.

## Verification
- `npx prettier --check` на двух файлах: passed.
- `pnpm lint`: exit 0, без замечаний.
- `pnpm build`: passed.
- `pnpm test`: 11 files, 86 tests passed.
- Exports: новых нет (`DAY_SIZE_VARS` не экспортируется).
- Живая проверка (локальный стек, headless chromium, viewport 320px, скрипт вне репозитория): `DatePickerInput` в листе готовки — 35 ячеек, все 44.0x44.0, таблица месяца 2.5-317.5px; `DatePicker` в `FinishSheet` — 35 ячеек 44.0x44.0, таблица 2.5-317.5px. `documentElement.scrollWidth` 485 > 320 — как и ранее, это dev-панель TanStack Query, не приложение. Тестовые записи `cook_logs` удалены (count = 0). Dev-сервер остановлен.

## Known issues / follow-ups
Нет. На 320px календарь в 2.5px от краёв (как в итерации 2).
