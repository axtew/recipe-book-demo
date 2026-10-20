Status: COMPLETED

## Phase goal
Карточка рецепта `/recipes/$recipeId` со всеми состояниями КБЖУ, кнопка «Редактировать» и переход на карточку после сохранения в редакторе.

## What was implemented
- Экран `RecipePage`: порядок блоков как в ТЗ — фото, название/категории/время/порции, предупреждение и КБЖУ (крупно на 100 г, мельче на порцию и на всё блюдо), хранение (только `freezable`), состав, шаги, видео, заметки, статистика журнала. Данные и расчёт — хук `_useRecipeCard.ts` (resolve + calculate из `src/domain/nutrition`, своей арифметики нет).
- `IncompleteWarning` — над цифрами, продукты без КБЖУ ссылками на `/products/$productId`. `NutritionBlock` — подсказка про уварку при `basis === "rawWeight"`, переопределённые поля помечены `*` и названы, кнопка «Пересчитать». Пустой состав без override — текст вместо нулей.
- «Пересчитать»: `resetRecipeNutritionOverrides` (один `update recipes`, четыре `*_override` → null) + `useResetRecipeNutritionOverridesMutation` с инвалидацией рецептов. Существующий `save_recipe` не подходит (переписывает состав и шаги), rpc не нужна — одна таблица. Кнопка одна и сбрасывает все ручные значения рецепта (плановое «соответствующие *_override»: не переопределённые и так null).
- Состав: имя варианта мелким шрифтом, если у продукта больше одного варианта (считаются все, включая архивные — карточка показывает, какой вариант реально использован); иконка «закреплён» для `isPinned`.
- Видео: `<a target="_blank" rel="noopener noreferrer">`, подпись — хост.
- Статистика (`CookStats`): раз готовила, последняя дата, средний выход, среднее число дней до «доели»; записи без значения в среднее не входят, при отсутствии данных — прочерк; без записей — «Пока ни разу не готовила». Разность дат — арифметика над номерами дней, без `Date`; тест рядом.
- Роут `routerPaths.recipeCard`, `RecipeCardRoute`. Редактор: `useRecipeSave` ведёт на карточку; ссылка «назад» при правке — на карточку (`SBack` в редакторе переведён на `createLink`, как в плане типизации params), при создании/ненайденном — на `/`.
- Форматирование КБЖУ (`formatKcal`, `formatMacro`) перенесено `NutrientsRow/_helpers.ts` → `src/utils/helpers/nutrients.ts` (второй потребитель — страница).
- Словарь `recipeCard.*` и `recipeEditor.backToRecipe` в `ru.json` + `I18n`.

### UIKit wrappers
Нет `styled(<Mantine/Typography>)`; `SBack`/`SEditLink`/`SProductLink` — `createLink` над `styled.a` (типизированные params), как `ProductsPage`.

## Files created
- `src/pages/RecipePage/{index.ts,_RecipePage.tsx,_styles.ts,_helpers.ts,_useRecipeCard.ts}`
- `src/pages/RecipePage/_internal/NutritionBlock/{index.ts,_NutritionBlock.tsx,_styles.ts}`
- `src/pages/RecipePage/_internal/IncompleteWarning/{index.ts,_IncompleteWarning.tsx,_styles.ts}`
- `src/pages/RecipePage/_internal/StorageBlock/{index.ts,_StorageBlock.tsx,_styles.ts}`
- `src/pages/RecipePage/_internal/IngredientsBlock/{index.ts,_IngredientsBlock.tsx,_styles.ts,_helpers.ts}`
- `src/pages/RecipePage/_internal/StepsBlock/{index.ts,_StepsBlock.tsx,_styles.ts}`
- `src/pages/RecipePage/_internal/VideoBlock/{index.ts,_VideoBlock.tsx,_styles.ts,_helpers.ts}`
- `src/pages/RecipePage/_internal/CookStats/{index.ts,_CookStats.tsx,_styles.ts,_helpers.ts,_helpers.test.ts}`
- `src/utils/helpers/nutrients.ts` (перенос из `NutrientsRow/_helpers.ts`)

## Files modified
- `src/routes/_paths.ts`, `src/routes/_routes.tsx` — роут карточки
- `src/api/services/recipes.service.ts`, `src/api/mutations/recipes.mutations.ts` — сброс override
- `src/pages/RecipeEditorPage/{_useRecipeSave.ts,_RecipeEditorPage.tsx,_styles.ts}` — переход и «назад»
- `src/components/NutrientsRow/_NutrientsRow.tsx` — импорт форматтеров; `_helpers.ts` удалён
- `public/dictionaries/ru.json`, `src/types/i18n.types.ts` — тексты
- `plans/recipe-book-v1/EXECUTION.md` — запись Фазы 9

## Verification
- `pnpm lint` — чисто (baseline чист).
- `pnpm build` — exit 0 (только прежнее предупреждение о размере чанка).
- `pnpm test` — 53/53 (было 44; +9 в `CookStats/_helpers.test.ts`).
- Exports: все новые экспорты имеют импортёра (`toDayNumber` — тест и сам модуль; `formatKcal/formatMacro` — `NutrientsRow` и `NutritionBlock`).
- Формат: `pnpm format` прогнан.
- Миграций нет, `db push` не нужен.

Живая проверка (локальный стек, `pnpm dev`; тестовый рецепт «Проверка карточки» заведён SQL и после проверки удалён, имя «Омлета» восстановлено; значения читал из DOM, скриншотов нет) — пункты «Проверки» фазы:
1. Порядок блоков — текст страницы в DOM идёт: КБЖУ, хранение, ингредиенты, шаги, видео, заметки, история. Выполнено.
2. Продукт без КБЖУ — «КБЖУ посчитано не полностью… Соевый соус», ссылка `href=/products/dddddddd-…10c`; цифры без нулевого вклада. Выполнено.
3. Рецепт без `yield_grams` — «Расчёт по весу сырья, уварка не учтена» есть; у «Омлета» (yield 380) подсказки нет. Выполнено.
4. Блок хранения — у `freezable=true` показан (90 дн./3 дн.), у «Омлета» (`false`) отсутствует. Выполнено.
5. Override — `123*`, «* Введено вручную: ккал», после клика «Пересчитать» в БД `kcal_100_override` = null, цифра стала 252 без пометки. Выполнено.
6. Имя варианта — у продуктов с несколькими вариантами (Молоко, Масло, Рис) показано, у однозначных (Яйцо, Помидоры, Огурцы, Соевый соус) нет; значок «вариант закреплён» у закреплённых Молока и Масла есть, у незакреплённого Риса (виден активный «Жасминовый») нет. Выполнено.
7. Видео — `target=_blank`, `rel=noopener noreferrer`, href http(s). Что ссылка действительно открывается во внешнем приложении, не проверено (нужен телефон).
8. «Редактировать» → `/recipes/<id>/edit`, ссылка «← К рецепту» → карточка, сохранение (правка названия) → `/recipes/<id>`. Выполнено. Сохранение нового рецепта с редиректом на карточку живьём не проверено (тот же код `useRecipeSave`, `recipeId` — сгенерированный id).
9. Статистика: 2 записи, последняя 10.10.2026, выход 500 г (запись без выхода не учтена), 2 дн. (3 и 1). Нулевой записи и единственной записи — покрыты юнит-тестами, живьём ноль записей виден у «Омлета» («Пока ни разу не готовила»).
Не проверено: вид на iPhone/Safari, фото на карточке (в локальных данных у рецептов нет `photo_path`).

## Known issues / follow-ups
- Кнопка «Готовила» (последний блок по ТЗ) не сделана: лист записи — Фаза 11; пустая кнопка была бы молчаливым no-op. Блок встаёт под статистику/над ней при Фазе 11.
- Фаза 11 планирует `src/domain/stats/`; `calculateCookStats` лежит локально в `CookStats/_helpers.ts` (лестница размещения). При переносе — вместе с тестом.
- Planner-drift: в плане нет ссылки на `src/utils/helpers/nutrients.ts` — перенос форматтеров потребовался из-за второго потребителя. Список файлов Фазы 9 не упоминает правки `src/api/**` и словаря — они необходимы для «пересчитать» и текстов.
- `resolveIngredients` бросает исключение при оборванной ссылке на продукт/вариант — карточка в этом случае упадёт (контракт домена, данные внутренне согласованы: архивные строки грузятся).
- `recipeCard.nutrition.overrideMark` используется как `aria-label` звёздочки; на экране ручные поля названы текстом под цифрами.
