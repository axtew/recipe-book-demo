MODE: review
STATUS: APPROVED
Issue source: none

## Summary

Проверена Фаза 11.5 целиком (`git diff HEAD` + новые папки `Button/`, `SheetForm/`). Рефакторинг чистый: логика форм, тексты, маршруты и слой данных не тронуты; обновление Mantine ограничено семейством `@mantine/*` и двумя транзитивными бампами в lock. Команды из «Проверки» перепрогнаны: `pnpm list "@mantine/*"` — 9.7.3 у всех четырёх, `pnpm lint` — exit 0, `pnpm build` — успешно, `pnpm test` — 11 файлов, 86/86. Блокирующих замечаний нет, ниже — решения по пунктам владельца и необязательные заметки.

## Зависимости

- `package.json`: четыре `@mantine/*` закреплены без каретки на `9.7.3`; ничего сверх семейства.
- `pnpm-lock.yaml`: изменились только `@mantine/{core,dates,hooks,notifications}`, `@mantine/store` (зависимость `notifications`) и `type-fest` 5.8.0 -> 5.10.0 (зависимость `core`). Других пакетов нет, новых пакетов нет — совпадает с отчётом.
- Честно оговорено, что заметки патч-релизов не читались; опора на `tsc` и живой прогон. Для 9.x -> 9.x это приемлемо.

## Общая `Button` против конвенций

- Значение пропа `variant`, не compound — по конвенции («слотов нет, различие — значение пропа»).
- Цвета только из `theme.palette`, `min-height: 44px`, подпись всегда `B2`, `:disabled` один на все виды. Литералов hex нет.
- Все пять видов используются: `primary` (много), `primaryOutline` (`LogEntry`, `VariantList`, `NutritionBlock`, `RecipesPage`), `secondary` (листы, `DraftPrompt`), `danger` (`ArchiveConfirm`), `dangerOutline` (`ProductPage`, `PhotoField`, `IngredientOptionsSheet`). Лишнего вида нет.
- `isInline` оправдан: ровно два потребителя (`VariantList`, `NutritionBlock`), оба раньше имели `align-self: flex-start`. Булев без значения по умолчанию.
- `SButtonRow` оправдан: у него два потребителя из разных слоёв (`LogEntry` — не лист, и `SheetForm`). Размещение в `Button/` вместо отдельной папки допустимо по лестнице; экспорт имеет importer.
- `_types.ts` при двух объявлениях — по порогу; пропсы целиком там, TSX без типов. `className`/`style` исключены из пропсов — осознанно, и `type` обязателен: кнопка без него внутри формы отправляет её.
- Экспорты: `Button`, `SButtonRow` (барель), `TButtonVariant` / `IButtonProps` не вынесены в барель. Дисциплина экспорта соблюдена.
- Оставшиеся `styled.button` (grep по `src`) совпадают со списком отчёта: `SAddButton` (пунктир, плановое исключение), `SPreset`, `SClearRating`, `SVariant`, `SChip`, `SMenuButton`, `RemoveButton/SButton`, `SHandle`, `CategoryGroup/SHeader`, `SFiltersButton`. Все — иная роль (сегмент/чип/иконка/ручка/заголовок группы/кнопка со счётчиком). Копий основной и второстепенной кнопок вне `Button` нет.

## `SheetForm`: были ли копии идентичны

Сверено по diff удалённых файлов:
- `SForm` в `ProductFormSheet`, `VariantFormSheet`, `FinishSheet`, `CookLogSheet` — дословно один и тот же (`flex column`, `gap 16`, `padding-bottom: env(safe-area-inset-bottom)`); `SSheetBody` в `IngredientOptionsSheet` — то же самое на `div`.
- `SField` — `label` с `gap 6px`; в `CookLogSheet` был `div` -> `as="div"`.
- `SActions` — `flex`, `gap 8`, `margin-top 8` в Product/Variant/CookLog/Archive; в `FinishSheet` и `FiltersSheet` без `margin-top` (отличие названо в отчёте).
Вынос в `src/components/SheetForm/` корректен: потребители из трёх разных фич (компоненты, `ProductPage`, `RecipePage`, `LogPage`, `RecipesPage`, редактор) — глобальный уровень лестницы оправдан. Все три экспорта имеют importer. Составной компонент не делался — верно.

## Высота полей Mantine

Исправление в одном месте — `src/theme/_mantineTheme.ts`, `Input.extend({ vars })` для `size="md"`. Все 17 потребителей (`NumberInput`, `DatePickerInput`, `FileInput`, `InputBase` в `ProductPicker`) уже передают `size="md"`, поэтому покрыты. `SNumberInput`-обёртка с `&& input { min-height }` удалена, остальные места переведены на `NumberInput` напрямую. Шрифт 16px у собственных полей (`TextInput`, `Select`) на месте и не затронут; `!important` не появился; `&&` над Mantine остался только в `BottomSheetDrawer`. Инварианты iOS соблюдены.

## Видимые отличия — решения

- **48 -> 44px (сохранение рецепта, «Записать готовку»), подпись `B1` -> `B2`.** Принимается как унификация: инвариант — не меньше 44px, 48 не был требованием; одна кнопка проекта без исключений — цель фазы.
- **8px сверху у ряда кнопок в `FinishSheet` и `FiltersSheet`.** Принимается: выравнивает с остальными листами.
- **«Войти»: 24 -> 16px сверху; «Повторить»: 20 -> 12px по вертикали, padding 24 -> 16.** Принимается как несущественное; при желании вернуть 8px у «Войти» это правка одной строки в `LoginPage/_styles.ts` (`SForm` с `gap`), но по смыслу фазы не требуется.
- **«Сбросить» в `FiltersSheet`: фон `surface` -> прозрачный.** Визуальной разницы нет: `palette.surface` = `#ffffff` = фон Drawer.
- Переход `border: none` -> `1px solid` того же цвета у `primary`/`danger`: высота по `min-height` одинаковая, размеры не меняются.

## Крестик закрытия `Drawer` 44px (сверх текста плана)

Принимается. Это тап-цель внутри листа, а проверка фазы требует «высота кнопок … в листах не меньше 44px»; правка в той же теме Mantine, в одном месте, без побочных стилей. Рекомендация: отразить в `## Дополнения` плана одной строкой, чтобы расхождение с текстом пункта не потерялось.

## Notes (не блокируют)

- **Остаточные копии `SField`.** `RecipeEditorPage/_styles.ts` (`SField`) и `LoginPage/_styles.ts` (`SField`) дословно равны `SSheetField`. Отчёт это называет и оставляет вне объёма. Но `IngredientOptionsSheet` — лист, который уже импортирует `SheetForm` (`SSheetForm`), и при этом берёт `SField` из `../../../../_styles` (`_IngredientOptionsSheet.tsx`, импорт `SField`): мелкая правка — заменить на `SSheetField` и убрать лишний импорт. Остальные два `SField` — кандидат на отдельное решение: либо общее нейтральное имя вместо `SSheetField`, либо оставить как есть.
- **Комментарии в `_mantineTheme.ts`.** Первые строки комментариев к `Drawer` и `Input` описывают исходное значение (28px / 42px), а не что делает переопределение; цель понятна только из продолжения. Вариант: начать с «Поднимает …до 44px», затем причина. Не блокирует.
- **Не проверено вживую** (по отчёту): `DraftPrompt`, «Повторить» в `AppLayout`, «Сделать активным», загрузка/замена фото, «Сбросить оценку». Все эти места — прямая замена на `Button` с теми же `onClick`/`disabled`, риск низкий; владельцу стоит один раз пройти их руками на iPhone.
- **Остаются ниже 44px виджеты Mantine** (по отчёту, не менялись): день календаря 36px, степперы `NumberInput` 21px в листах продукта, варианта и записи готовки. Решение (размер дня, `hideControls`) — за владельцем.
- **Page-specific exports без внешних потребителей:** не обнаружено; все барели `Button/` и `SheetForm/` имеют importer.
