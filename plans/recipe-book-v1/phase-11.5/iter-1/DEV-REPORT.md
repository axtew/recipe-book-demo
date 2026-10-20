Status: COMPLETED

# Фаза 11.5 — Общие кнопки и формы листов, обновление Mantine (итерация 1)

## Цель

Убрать копии стилей кнопок и разметки форм листов, поднять высоту полей Mantine до 44px в одном месте, выровнять все `@mantine/*` на одной версии.

## Что сделано

### 1. Mantine

- `@mantine/core`, `hooks`, `dates`, `notifications` -> `9.7.3` (последняя 9.x по `pnpm view`), в `package.json` без каретки, у всех четырёх одинаково. `pnpm add --save-exact` каретку всё равно поставил — поправил руками и пересобрал lock.
- Потянулось за собой (только в lock): `@mantine/store` 9.6.1 -> 9.7.3 (зависимость `notifications`) и `type-fest` 5.8.0 -> 5.10.0. Других версий не менялось.
- Changelog: прочитаны исходники страниц `9-6-0.mdx` и `9-7-0.mdx` на GitHub (raw). Ломающих изменений для используемых компонентов (`Drawer`, `Combobox`, `NumberInput`, `Notifications`, `Skeleton`, `Rating`, `DatePicker`/`DatePickerInput`, `DatesProvider`) там нет: новые компоненты и опции; `Tooltip hideDetached` и `HoverCard` в проекте не используются; новые пропы `Notifications` необязательные. Mantine теперь требует Node 22 (локально v22.17.0). **Не читал** заметки патч-релизов (9.5.x, 9.6.x, 9.7.1-9.7.3) — у них нет отдельных страниц changelog. Сверх прочитанного опирался на `tsc` (после обновления `pnpm build` проходит без правок кода) и живую проверку.

### 2. Общая кнопка `src/components/Button/`

Имя проверено: папки `Button` в проекте не было. Файлы: `_Button.tsx`, `_styles.ts`, `_types.ts` (два объявления — по порогу конвенции), `index.ts`.

- `variant`: `primary`, `primaryOutline`, `secondary`, `danger`, `dangerOutline` — ровно те пять видов, что нашлись поиском. `type` обязателен (`button` | `submit`), `isInline` — по ширине содержимого (`align-self: flex-start`; булев пропс без значения по умолчанию). Подпись всегда `B2`, цвета только из `theme.palette`, `min-height: 44px`, `:disabled` (opacity 0.6, курсор по умолчанию) один на все виды.
- `SButtonRow` (в той же папке): ряд кнопок равной ширины, `gap: 8px`.
- Составной компонент не делался: слотов нет, различие — значение пропа.

Инвентарь — поиском `styled.button` / `<button` по `src`.

Заменены на `Button`:

| Было | Где | Стало |
|---|---|---|
| `SSubmit` / `SCancel` | `ProductFormSheet`, `VariantFormSheet`, `CookLogSheet`, `FinishSheet` | `primary` / `secondary` |
| `SConfirm` / `SCancel` | `ArchiveConfirm` | `danger` / `secondary` |
| `SDone` / `SReset` (+ базовая `SButton`) | `FiltersSheet` | `primary` / `secondary` |
| `SSecondaryButton`, `SDangerButton` | `IngredientOptionsSheet`, `PhotoField`, `DraftPrompt` | `secondary`, `dangerOutline` |
| `SSubmit` (редактор, 48px) | `RecipeForm`, `DraftPrompt` | `primary` |
| `SButton` / `SOutlineButton` | `LogEntry` | `primary` / `primaryOutline` |
| `SButton` (48px) | `CookLogAction` | `primary` |
| `SSubmit` | `LoginPage` | `primary` |
| `SArchiveButton` | `ProductPage` | `dangerOutline` |
| `SActivate` | `VariantList` | `primaryOutline` + `isInline` |
| `SRecalculate` | `NutritionBlock` | `primaryOutline` + `isInline` |
| `SResetButton` | `RecipesPage` | `primaryOutline` |
| `SRetry` | `AppLayout` | `primary` |

Оставлены (другая роль, не основная / второстепенная / опасная кнопка действия):

- `SAddButton` (редактор) — пунктирная «Добавить» (плановое исключение);
- `SPreset` (множители ×1–×4) — сегмент с состоянием выбора; `SClearRating` — текстовая кнопка без рамки;
- `SVariant` (выбор варианта продукта), `SChip` (категория блюда) — выбираемые элементы;
- `SMenuButton`, `SButton` в `RemoveButton`, `SHandle` — иконочные кнопки и ручка перетаскивания;
- `SHeader` в `CategoryGroup` — заголовок раскрывающейся группы;
- `SFiltersButton` в `SearchBar` — кнопка со счётчиком-бейджем внутри (не помещается в `B2`-оболочку `Button`).

Поиск `styled.button` по `_styles.ts` теперь находит только эти кнопки и сам `Button`.

### 3. Общая разметка листа `src/components/SheetForm/`

`SSheetForm`, `SSheetField` (`label`; `as="div"` в `CookLogSheet`, где внутри несколько элементов управления), `SSheetActions` (= `SButtonRow` + `margin-top: 8px`). Потребители из трёх разных фич — поэтому глобально в `src/components/`. Используют: `ProductFormSheet`, `VariantFormSheet`, `CookLogSheet`, `FinishSheet` (форма и ряд), `ArchiveConfirm` и `FiltersSheet` (ряд), `IngredientOptionsSheet` (`SSheetForm as="div"` вместо `SSheetBody`).

Не вынесено, намеренно:

- `ArchiveConfirm/SContent` (gap 12, а не 16), `IngredientOptionsSheet/SActions` (`space-between`, кнопки по ширине содержимого), `FiltersSheet/SContent` — другая раскладка.
- `SForm` / `SField` в `LoginPage` и `RecipeEditorPage` — не листы; `SField` там совпадает с `SSheetField` дословно, `SForm` отличается. Оставлено вне объёма фазы.

### 4. Высота полей — одно место, `src/theme/_mantineTheme.ts`

- `Input.extend({ vars })`: при `size="md"` `--input-height` = 44px. Покрывает `NumberInput`, `DatePickerInput`, `FileInput`, `InputBase` (пикер продуктов) без правок потребителей. Шрифт полей не трогал (16px у собственных полей проекта на месте).
- `Drawer.extend({ defaultProps: { closeButtonProps: { size: 44 } } })`: крестик закрытия листа был 28px — первый живой прогон показал его единственным нестандартным элементом листа ниже порога вне виджетов Mantine. В тексте плана этого нет, добавлено по проверке «высота кнопок в листах».
- `SNumberInput` (обёртка в `RecipeEditorPage/_styles.ts` с `&& input { min-height: 44px }`) удалена; пять мест используют `NumberInput` напрямую.

## Файлы

Созданы: `src/components/Button/{_Button.tsx,_styles.ts,_types.ts,index.ts}`, `src/components/SheetForm/{_styles.ts,index.ts}`, логи в `plans/recipe-book-v1/phase-11.5/iter-1/` (`baseline-*.log`, `install*.log`, `final-build.log`).

Удалены (после выноса пусты): `src/components/ProductFormSheet/_styles.ts`, `src/components/VariantFormSheet/_styles.ts`, `src/pages/RecipePage/_internal/CookLogAction/_styles.ts`.

Изменены: `package.json`, `pnpm-lock.yaml`, `src/theme/_mantineTheme.ts`; `ProductFormSheet`, `VariantFormSheet`; `CookLogSheet` (+`_styles.ts`), `CookLogAction`; `FinishSheet`, `LogEntry` (оба + `_styles.ts`); `LoginPage`, `ProductPage`, `ArchiveConfirm`, `VariantList`, `NutritionBlock`, `RecipesPage`, `FiltersSheet`, `AppLayout` (все + `_styles.ts`); редактор: `RecipeEditorPage/_styles.ts`, `DraftPrompt`, `IngredientRow`, `IngredientOptionsSheet` (+`_styles.ts`), `PhotoField`, `RecipeForm`, `StorageFields`.

## Видимые отличия (поведение и тексты не менялись)

- Две крупные кнопки (сохранение рецепта, «Записать готовку» в карточке) были 48px, стали 44px; подпись «Записать готовку» была `B1`, стала `B2`, как у остальных.
- `FinishSheet` и `FiltersSheet`: ряд кнопок получил `margin-top: 8px`, как у остальных листов.
- «Войти»: отступ сверху 16px (gap формы) вместо 24px. «Повторить» в `AppLayout`: 12px (gap) вместо 20px, горизонтальный padding 16px вместо 24px.
- «Сбросить» в `FiltersSheet`: фон прозрачный, был цвета `surface` (в листе это один цвет).

## Проверка (по пунктам «Проверки» фазы)

1. **`pnpm list "@mantine/*"`**:

   ```
   @mantine/core 9.7.3
   @mantine/dates 9.7.3
   @mantine/hooks 9.7.3
   @mantine/notifications 9.7.3
   ```

   `pnpm install` (после правки `package.json`, полный вывод — `install.log`): единственное предупреждение `WARN 1 deprecated subdependencies found: glob@11.1.0` — это `workbox-build` через `vite-plugin-pwa`, к Mantine не относится и было до фазы. Предупреждений о peer-версиях нет. `pnpm install --force` (полная переустановка, `install-force.log`) — тоже нет, только штатное «Ignored build scripts: esbuild, workerd».
2. **Копии кнопок.** `grep -rn "styled\.button" src --include=_styles.ts` находит только оставленные кнопки из списка выше и сам `Button`. Исключения названы.
3. **Живая проверка** (локальный стек, `pnpm dev`, вход `dev@recipe-book.local`, headless Chromium 390x844, скрипт вне репозитория; высоты — `getBoundingClientRect().height`):
   - вход: кнопка 44px, вход работает;
   - фильтры: лист открывается, кнопки 44/44, «до 60 мин» отправляется (`?time=upTo60`), «Сбросить» в листе сбрасывает; пустая выдача -> «Сбросить поиск и фильтры» 44px и работает;
   - запись готовки: «Записать готовку» 44px; в листе поле даты 44, множители 44, числовые поля 44, заметка 88, кнопки 44; календарь `DatePickerInput` открывается, день выбирается (лист остаётся); звёзды выбираются (появляется «Сбросить оценку»); отправка с оценкой и отправка с дефолтами в два тапа — обе записи в базе, `snapshot.version = 1`;
   - журнал: «Доели» / «Другая дата» 44; «Другая дата» открывает лист с календарём (`DatePicker`), кнопки 44, отправка ставит дату; «Доели» ставит дату; при подмене ответа сети на 500 появляется уведомление «Не удалось сохранить изменения» (проверка `Notifications`);
   - редактор рецепта: вся форма — поля, чипы, кнопки 44 (25 элементов, ниже порога нет); «Сохранить рецепт» 44;
   - параметры ингредиента: все элементы листа 44; «Добавить вариант продукта» открывает `VariantFormSheet`, поля 44, отправка создаёт вариант;
   - создание продукта из пикера (`ProductFormSheet`): поля и селект 44, отправка создаёт продукт;
   - архивация тестового продукта: триггер 44, лист 44/44/44, подтверждение архивирует (бейдж «В архиве»);
   - «Пересчитать» в карточке: 44px, сбрасывает ручное КБЖУ;
   - крестик закрытия листа: 28px до правки темы, 44px после;
   - консоль: ошибок и предупреждений Mantine нет; единственные записи — ожидаемые от подмены ответа на 500.
   - Тестовые данные (рецепт `ZZ-тест рецепт` с ингредиентами, две записи журнала, продукт `ZZtest`, вариант `ZZ-test-variant`) удалены SQL; счётчики вернулись: recipes 1, cook_logs 0, products 13, записей `ZZ%` нет, `active_variant_id` у «Молока» прежний. Dev-сервер остановлен.
   - **Ниже 44px остаются виджеты Mantine** (не менял): ячейки дня в календарях `DatePicker` / `DatePickerInput` — 36px; стрелки-степперы `NumberInput` в листах продукта, варианта и записи готовки — по 21px, две стопкой внутри поля высотой 44px (в редакторе рецепта `hideControls`). Кандидат на решение владельца: размер дня календаря и `hideControls` у числовых полей листов.
   - **Не проверено вживую:** внешний вид и жесты на iPhone; `DraftPrompt` (в прогоне плашка черновика не появилась); «Повторить» в `AppLayout` (нужен отказ загрузки данных); «Сделать активным» у продукта с одним неактивным вариантом (в dev-данных не воспроизводится); загрузка и замена фото; нажатие «Сбросить оценку».
4. **Команды:** `pnpm lint` — чисто (exit 0); `pnpm build` — exit 0; `pnpm test` (`vitest run`) — 11 файлов, 86/86. До фазы то же (`baseline-*.log`).
5. **Экспорты.** `Button/index.ts`: `Button` (много потребителей), `SButtonRow` (`LogEntry`, `SheetForm`). `SheetForm/index.ts`: все три имени используются. `TButtonVariant` / `IButtonProps` экспортируются из `_types.ts` и импортируются внутри папки, через барель не идут.

## Замечания

- План упоминал кнопки «в `RecipeEditorPage`», но `SSubmit` / `SSecondaryButton` / `SDangerButton` использовались ещё в `DraftPrompt`, `IngredientOptionsSheet` и `PhotoField` — заменены и там.
- `SButtonRow` лежит в `Button/`, а не в `SheetForm/`: его использует и `LogEntry` (не лист); `SSheetActions` строится поверх него.
- Изменения не закоммичены; `STATUS.md` не правился.
