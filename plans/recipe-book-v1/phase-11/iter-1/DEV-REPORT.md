Status: COMPLETED

# Фаза 11 — Журнал готовки, итерация 1

## Phase goal
Начать сбор данных журнала: лист быстрой записи готовки, кнопка в карточке рецепта, экран `/log` с «доели», агрегаты по рецепту в `src/domain/stats/`.

## What was implemented
- **Зависимости.** `pnpm add @mantine/dates dayjs`, затем `@mantine/dates` переустановлен на `9.5.2` (равен `@mantine/core`; `9.7.3` требовал бы того же `core`). Расхождение peer-версий у `notifications` было до меня. Больше ничего не ставилось. `main.tsx`: стили `@mantine/dates` и `dayjs/locale/ru`; `App.tsx`: `DatesProvider` (`ru`, неделя с понедельника).
- **`src/domain/stats/`** — `calculateCookStats` перенесена из страницы (`git mv`), вход сужен до `Pick<ICookLog, "cookedAt" | "finishedAt" | "actualYieldGrams">`; тесты перенесены без потерь (`__tests__/cookStats.test.ts`). `formatCookDate` перенесена в `src/utils/helpers/dates.ts` (презентация, не агрегат) вместе с новой `getTodayDate` (местные части даты, без `toISOString`) и тестами.
- **Данные.** `createCookLog`, `finishCookLog` (`cookLogs.service.ts`); `src/api/mutations/cookLogs.mutations.ts`; `COOK_LOGS_QUERY_KEY` экспортирован; `ICookLogInput` в `cookLogs.types.ts`, `cookLogInputSchema ... satisfies z.ZodType<ICookLogInput>`; множитель ограничен `max(99.99)` (`numeric(4,2)`). В сервисе снимок проходит `nutritionSnapshotSchema.parse`: интерфейс не присваивается `Json`, а выведенный из схемы тип присваивается (прямая передача интерфейса роняла `tsc` по памяти).
- **`CookLogSheet`** (`src/components/CookLogSheet/`). Поля: дата (`DatePickerInput`, `dropdownType="modal"`, не позже сегодня), множитель (кнопки ×1–×4 + `NumberInput`), выход, контейнеры, оценка (`Rating` 44px + «Сбросить оценку»), заметка. «Два тапа»: `cookedAt` и `multiplier` с `prevValue: ""` и `required`, отправка включена без правок.
- **Карточка рецепта.** `useRecipeCard` отдаёт `snapshot` (`buildSnapshot` из того же расчёта); `_internal/CookLogAction` (кнопка + лист, своё состояние открытия) под блоком статистики.
- **`/log`.** `src/pages/LogPage/` + `_internal/{MonthGroup,LogEntry,FinishSheet}`; `groupLogsByMonth` (без `Date`) с тестами; в `_routes.tsx` заглушка заменена на `LogPage`. «Доели» — одним тапом сегодняшняя дата, «Другая дата» — лист с `DatePicker` (от даты готовки до сегодня). Ккал на 100 г в записи берётся из снимка записи; навигация на рецепт — обычная ссылка, `BackLink` карточки возвращает по истории (состояния «откуда пришли» нет).
- **i18n.** `recipeCard.recordCookButton`, `cookLogSheet.*`, `cookLog.*` (в т.ч. `months`) в `ru.json` и `I18n`; тексты без рода («Записать готовку», «Доели», «Приготовлено раз»). Словарь один.
- `formatMultiplier` в `src/utils/helpers/nutrients.ts` («×2», «×1,5»).

## UIKit wrappers
Новых `styled(<примитив кита>)` нет; `SBottomSheetDrawer` используется как есть.

## Files created
- `src/domain/stats/index.ts`
- `src/utils/helpers/dates.ts`, `src/utils/__tests__/dates.test.ts`
- `src/api/mutations/cookLogs.mutations.ts`
- `src/components/CookLogSheet/{index.ts,_CookLogSheet.tsx,_useCookLogForm.ts,_types.ts,_styles.ts,_constants.ts}`
- `src/pages/RecipePage/_internal/CookLogAction/{index.ts,_CookLogAction.tsx,_styles.ts}`
- `src/pages/LogPage/{index.ts,_LogPage.tsx,_useLogPage.ts,_helpers.ts,_helpers.test.ts,_styles.ts}`
- `src/pages/LogPage/_internal/MonthGroup/{index.ts,_MonthGroup.tsx,_styles.ts}`
- `src/pages/LogPage/_internal/LogEntry/{index.ts,_LogEntry.tsx,_styles.ts}`
- `src/pages/LogPage/_internal/FinishSheet/{index.ts,_FinishSheet.tsx,_useFinishForm.ts,_styles.ts}`
- `plans/recipe-book-v1/phase-11/iter-1/DEV-REPORT.md`

## Files modified
- `package.json`, `pnpm-lock.yaml` — `@mantine/dates@^9.5.2`, `dayjs`.
- `src/main.tsx`, `src/app/App.tsx` — стили, локаль, `DatesProvider`.
- `src/domain/stats/_cookStats.ts` (перенос из `RecipePage/_internal/CookStats/_helpers.ts`), `src/domain/stats/__tests__/cookStats.test.ts` (перенос теста) — без `formatCookDate`.
- `src/pages/RecipePage/_internal/CookStats/_CookStats.tsx` — импорты из домена и utils.
- `src/pages/RecipePage/_RecipePage.tsx`, `_useRecipeCard.ts` — кнопка записи, `snapshot`.
- `src/api/services/cookLogs.service.ts`, `src/api/queries/cookLogs.queries.ts`.
- `src/types/cookLogs.types.ts`, `src/types/i18n.types.ts`, `src/domain/schemas/_cookLogs.ts`.
- `src/routes/_routes.tsx` — `LogPage` вместо `LogStub`.
- `src/utils/helpers/nutrients.ts` — `formatMultiplier`.
- `public/dictionaries/ru.json`.
- `plans/recipe-book-v1/EXECUTION.md` — запись о Фазе 11.

## Verification
Baseline (до правок): `pnpm lint` чисто, `pnpm test` 80/80; build-baseline не пересобирался (предупреждение о чанке >500 kB есть и в `baseline/p10-build.log`).
- `pnpm lint` — чисто.
- `pnpm test --run` — 11 файлов, 86/86 (+6: `dates.test.ts` 3, из них один перенесён, `groupLogsByMonth` 4).
- `pnpm build` — exit 0 (только прежнее предупреждение о размере чанка).
- Exports: у каждого нового экспорта есть внешний импортёр; провизионных и «контрактных» без импортёра нет.
- Prettier — только по затронутым папкам `src/…`, не по репозиторию.

### Проверка фазы — по пунктам
1. **Запись в два тапа с дефолтами** — пройдено живьём (локальный стек, Playwright вне репозитория, реальные клики): «Записать готовку» → «Записать» без правок; кнопка не `disabled`; в базе `2026-10-20|1.00` (сегодня по местной дате), лист закрылся, в статистике «Приготовлено раз 1».
2. **`snapshot` — валидный по zod `INutritionSnapshot`** — в базе `version = 1`, `per100g.kcal = 100`; вставка проходит `nutritionSnapshotSchema.parse`, чтение журнала (`mapCookLog`) парсит той же схемой, и лента показывает ккал из снимка (при провале было бы `snapshot: null` и `console.error`; ошибок в консоли 0).
3. **Смена активного варианта не меняет запись, но меняет карточку** — SQL-переключение A→B: карточка показала 200 ккал на 100 г, `snapshot` в базе остался 100, лента `/log` по-прежнему «100 ккал на 100 г».
4. **«Доели» проставляет дату** — одним тапом `finished_at = 2026-10-20`; «Другая дата» — лист, «Готово» включена сразу, дата записана; кнопок «Доели» не осталось.
5. **Статистика не падает** — единственная запись без выхода и «доели»: `1 / 20.10.2026 / — / —`; нули и граничные даты — тестами (`cookStats.test.ts`); две записи: выход 1500 г, 9 дн.
- Дополнительно живьём: порядок блоков (кнопка после «История готовки»), все поля листа (×3, выход, контейнеры, звёзды, заметка с переносом, дата из календаря с русскими месяцами), ссылка записи на карточку и «Назад» обратно в `/log`.
- **Не проверено:** внешний вид и жесты на iPhone/в PWA (скриншотов не делал); кнопка «Сбросить оценку»; облачная база не трогалась; `dropdownType="modal"` поверх `Drawer` проверен только функционально.
- Тестовые рецепт и продукт удалены (`ZZ%` = 0, `cook_logs` = 0); `pnpm dev` остановлен; `.playwright-mcp` не создавался.

## Known issues / follow-ups
- Миграций нет, `db push` не нужен (на `cook_logs` уже есть RLS и `select, insert, update, delete`).
- Peer-версии Mantine: `@mantine/dates` закреплён под `core 9.5.2`; `notifications@9.6.1` расходится с `core` и до этой фазы. Обновление семейства Mantine до 9.7.x — отдельная задача.
- Правка и удаление записей журнала, отмена «доели» в фазу не входят и не сделаны.
- `cookLog.months` — массив из двенадцати названий в словаре: месяц берётся без `Date`/`Intl`.
- Planner-drift: нет. Сверх списка фазы тронуты `src/utils/helpers/dates.ts`, мутации, типы/схема/сервис, маршрут, словарь, `main.tsx`, `App.tsx` — необходимое для работы. `STATUS.md` не правился (обновляется после ревью).
