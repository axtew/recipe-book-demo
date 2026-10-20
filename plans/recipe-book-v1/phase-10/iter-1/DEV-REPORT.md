Status: COMPLETED

# Фаза 10 — Список рецептов, поиск и фильтры (iter-1)

Не закоммичено, правки в рабочем дереве. Миграций нет, `db push` не нужен, новых зависимостей нет.

## Phase goal
Главный экран `/`: рецепты по категориям блюд, поиск по названию и составу, фильтры, свёрнутость групп, FAB «＋» на `/recipes/new`.

## What was implemented
- `src/pages/RecipesPage/` + `_internal/{RecipeCard,CategoryGroup,SearchBar,FiltersSheet}`; логика в `_useRecipesList.ts`, `_useCollapsedGroups.ts`, `_helpers.ts`.
- Карточка: фото (`recipe.photoUrl`) или плейсхолдер, название, время, `❄` у `freezable`, ккал на 100 г из `src/domain/nutrition` (`resolveIngredients` + `calculateNutrition`, считается один раз на изменение данных, а не на каждую букву).
- Группировка: рецепт в каждой своей категории по `sortOrder`, «Без категории» последней, пустые группы не создаются; неизвестный id категории = нет категории. Счётчик «Всего рецептов» — по уникальным рецептам; у группы — свой счётчик. Архивные скрывает список (`archivedAt !== null`), не запрос.
- Поиск: `src/utils/search.ts` (`normalizeSearch` перенесён из `helpers/products.ts` — появился второй потребитель; `getSearchTokens`, `matchesTokens`). Слова запроса — по «и», каждое должно встретиться в названии рецепта или в названии любого продукта состава (включая необязательные и архивные продукты). `ё`→`е` + lowercase с обеих сторон.
- Фильтры: «только замораживаемые», время (≤15 / ≤30 / ≤60 / >60); комбинируются по «и» с поиском. Рецепт без `cookTimeMin` не проходит ни одну границу времени. Лист фильтров применяет выбор сразу, «Готово» только закрывает.
- Search-params: `validateRecipesSearch` в `src/routes/_routes.tsx` (`q`, `freezable`, `time`; каждое поле валидируется отдельно, число из JSON-разбора роутера приводится к строке). Ввод идёт `navigate({ replace: true })`, история не засоряется.
- Свёрнутость групп: localStorage `recipes:collapsed-groups` (массив id; `uncategorized` для «Без категории»). Пока поиск непустой, группы показываются раскрытыми, иначе найденное пряталось бы под заголовком.
- FAB «＋»: `createLink` → `routerPaths.recipeNew`, `position: fixed` над таб-баром, правый отступ считается от края колонки 600px; плюс нарисован псевдоэлементами (подпись в `aria-label`, шрифтового размера для значка в шкале нет).
- Заглушка `RecipesStub` удалена.

### Решения, требующие внимания владельца
1. **Неполное КБЖУ на карточке списка.** Показывается посчитанная цифра (как в карточке рецепта, Фаза 9, где цифры идут под предупреждением) **плюс** красная подпись `nutrients.incomplete` («КБЖУ заполнено не полностью») — тот же ключ и вид, что в строках справочника через `NutrientsRow`. Рецепт, у которого считать не из чего (нет веса сырья и нет override), показывает прочерк `nutrients.empty`. Условие неполноты то же, что у карточки: `incompleteProducts.length > 0`, без учёта override ккал.
2. **Ссылка «← К рецептам» в карточке рецепта** вела на `/` без параметров и сбрасывала поиск и фильтры (в установленном PWA кнопки «назад» нет). Добавлен `src/utils/lastRecipesSearch.ts` (переменная модуля, пишется эффектом из главного роута), `RecipePage` передаёт её в `search` ссылки. Работает и после цепочки карточка → редактор → карточка, где шаг по истории был бы неверным. Таб «Рецепты» по-прежнему ведёт на чистый `/`.
3. `getNutritionOverrides` из `RecipePage/_helpers.ts` поднят в `src/utils/helpers/recipes.ts` (третий потребитель, лестница размещения); файл `RecipePage/_helpers.ts` удалён. Версия в `RecipeEditorPage/_helpers.ts` принимает `IRecipe | null` и осталась как есть.

## Files created
- `src/pages/RecipesPage/{index.ts,_RecipesPage.tsx,_styles.ts,_types.ts,_constants.ts,_helpers.ts,_helpers.test.ts,_useRecipesList.ts,_useCollapsedGroups.ts}`
- `src/pages/RecipesPage/_internal/RecipeCard/{index.ts,_RecipeCard.tsx,_styles.ts}`
- `src/pages/RecipesPage/_internal/CategoryGroup/{index.ts,_CategoryGroup.tsx,_styles.ts}`
- `src/pages/RecipesPage/_internal/SearchBar/{index.ts,_SearchBar.tsx,_styles.ts}`
- `src/pages/RecipesPage/_internal/FiltersSheet/{index.ts,_FiltersSheet.tsx,_styles.ts}`
- `src/utils/search.ts`, `src/utils/__tests__/search.test.ts`
- `src/utils/lastRecipesSearch.ts`
- `src/utils/helpers/recipes.ts`

## Files modified
- `src/routes/_routes.tsx` — `validateRecipesSearch`, `RecipesRoute` вместо заглушки.
- `src/types/recipes.types.ts` — `TCookTimeFilter`, `IRecipesSearch`.
- `src/types/i18n.types.ts`, `public/dictionaries/ru.json` — ветка `recipeList` (единственный словарь; текст без привязки к роду).
- `src/utils/helpers/products.ts`, `src/components/ProductPicker/_ProductPicker.tsx` — `normalizeSearch` из `@/utils/search`.
- `src/pages/RecipePage/_RecipePage.tsx` — ссылки «назад» с запомненным поиском.
- `src/pages/RecipePage/_useRecipeCard.ts` — `getNutritionOverrides` из общего места.
- Удалён `src/pages/RecipePage/_helpers.ts`.

## UIKit wrappers
Нет `styled(<примитив>)` над Mantine, кроме уже существующего `SBottomSheetDrawer` (использован как есть). `SReset`/`SDone` в `FiltersSheet` — `styled(SButton)` над собственным styled-элементом.

## Verification
- Baseline (до правок): `pnpm lint` exit 0, `pnpm build` exit 0 (`plans/recipe-book-v1/baseline/p10-*.log`).
- `pnpm lint` — чисто. `pnpm build` — exit 0. `pnpm test --run` — 70/70 (было 56; +`search.test.ts`, +`RecipesPage/_helpers.test.ts`).
- Exports: у каждого нового экспорта есть внешний потребитель (`getLastRecipesSearch` — `RecipePage`, `rememberRecipesSearch` — роут, `IRecipesSearch`/`TCookTimeFilter` — роут, страница, i18n, utils); провиженных нет.
- Живая проверка на локальном стеке (`pnpm dev`, уже авторизованная сессия dev-пользователя; тестовые продукты/рецепты `ZZ …` заведены SQL в локальную БД и удалены после, `select` подтвердил 0 остатка; события — синтетические, не реальные клавиши):
  - «курица» → «ZZ Плов» и «ZZ Без категории» (в названии нет слова, продукт «ZZ Курица филе» в составе); группы Обеды/Ужины/Без категории, «Всего рецептов: 2» при 3 показанных карточках в группах (дубль Плова в двух группах считается один раз).
  - «МЁД» и «мед» → «ZZ Блины» (продукт «ZZ Мёд»); обратное направление (е в запросе, ё в тексте) — в unit-тесте.
  - «курица рис» → заглушка «Ничего не нашлось / Попробуйте изменить запрос…»; кнопка «Сбросить поиск и фильтры» возвращает `/` и «Всего рецептов: 4».
  - Архивный «ZZ Архивный» в списке отсутствует, итого 4 = 3 тестовых + существующий «Омлет».
  - «Без категории» — последняя группа; «КБЖУ заполнено не полностью» только у рецепта с продуктом без КБЖУ; плов 110 ккал, блины 330.
  - Свёрнутость: «Ужины» и «Без категории» свёрнуты → `localStorage["recipes:collapsed-groups"]` = `["2d5c…","uncategorized"]`, после перезагрузки страницы те же группы свёрнуты.
  - Фильтры: `freezable` → только Плов; `freezable`+`time` (≤15, ≤30, ≤60, >60) и `time` отдельно дают ожидаемые наборы (Плов 45 мин проходит ≤60, не проходит ≤15/≤30; «Без категории» 90 мин проходит >60); комбинация с запросом — `?q=курица&freezable=true&time=over60`.
  - Возврат: из карточки по ссылке «← К рецептам» и по `history.back()` приходим на тот же адрес, в поле поиска «курица», фильтры на месте.
  - FAB → `/recipes/new` (клик), 56×56, плюс 20px.
  - Консоль: 0 ошибок. Папка `.playwright-mcp` удалена.
- Phase stop condition: выполнено по всем пунктам «Проверки».
- **Не проверено:** внешний вид на iPhone/в PWA (тап-цели 44px заданы, safe-area учтена, вживую не смотрено); реальный набор с клавиатуры (только синтетические `input`); FAB на экране шире 600px с классическим скроллбаром смещён на ширину полосы (`100vw` включает её) — на телефоне полосы нет; лист фильтров глазами не смотрен (проверено поведением через DOM).

## Known issues / follow-ups
- Дублирование списка значений времени: `COOK_TIME_VALUES` в `_routes.tsx` и `COOK_TIME_FILTERS` в `RecipesPage/_constants.ts` (оба типизированы `TCookTimeFilter`). Страница не экспортирует константу наружу, чтобы не нарушать правило экспортов; при добавлении значения править оба — компилятор подскажет только через `Record<TCookTimeFilter, …>`.
- Значение `time` в адресе из-за JSON-разбора роутера выглядит как `time=%2215%22` (кавычки) для «15/30/60» и `time=over60` для остального; разбор принимает оба вида.
- `getNutritionOverrides` теперь в двух местах (общий в `utils/helpers/recipes.ts` и вариант с `null` в редакторе) — слить при случае, вне фазы.
- Ошибочно запущенный `pnpm prettier` (скрипт = `prettier --write .`) переформатировал весь репозиторий включая документы; я откатил все файлы вне фазы через `git checkout`, остальные диффы проверены `git diff --stat`. `src/utils/helpers/nutrients.ts` не проходит `prettier --check` и без моих правок (существующий дрейф формата, не трогал).
- `useRecipesList` вызывает `resolveIngredients`, который бросает на оборванной ссылке; на главном экране это уронило бы список целиком — датасет грузится целиком вместе с архивными, так что ситуация возможна только при реальной порче данных (то же поведение, что у карточки).
- Планово дальше: Фаза 11 (журнал); кнопка «Записать готовку» — там.
