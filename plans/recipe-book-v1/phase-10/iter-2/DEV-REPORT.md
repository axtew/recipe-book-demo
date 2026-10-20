Status: COMPLETED

# Фаза 10 — Список рецептов, поиск и фильтры (iter-2, FIX после ревью)

Не закоммичено, правки в рабочем дереве. Миграций нет, `db push` не нужен, зависимостей не добавлено.

## Phase goal
Закрыть замечания ревью итерации 1 и решение владельца о «назад» по истории (план, «Дополнения» → «Фаза 10 — добавлено 2026-10-20»).

## What was implemented

**A. «Назад» по истории.**
- `BackLink` (`src/components/BackLink/_BackLink.tsx`): `createLink` + перехват клика; при `useCanGoBack` и обычном клике — `router.history.back()`, иначе обычный переход на `to`/`params` из пропов (он же остаётся в `href`, модификаторы и «в новой вкладке» работают). Тип приведён к типу `createLink`, чтобы `to`/`params` проверялись.
- Подпись «← Назад» в карточке рецепта, редакторе (оба случая) и карточке продукта; ключ `recipeEditor.backToRecipe` удалён.
- `_useRecipeSave.ts`: правка — `history.back()` на карточку, если есть куда; иначе `navigate` на карточку с `replace`. Новый рецепт — `navigate` на карточку с `replace: true`.
- `src/utils/lastRecipesSearch.ts` и эффект в роуте удалены.

**1.** URL — источник истины: локальный `query` нужен только пока набирают, при смене `search.q` снаружи (таб «Рецепты», back/forward) подтягивается из адреса (`_useRecipesList.ts`, синхронизация при рендере по сохранённому предыдущему значению).

**2.** `useCollapsedGroups`: `next` считается из текущего состояния, `setCollapsed(next)`, запись в localStorage отдельно.

**3.** Значения времени — один список `COOK_TIME_FILTERS` в `src/constants/recipes.constants.ts` (роут/валидатор через `normalizeRecipesSearch`, `FiltersSheet`); границы — `Record<TCookTimeFilter, number>` на странице. Одна нормализация `normalizeRecipesSearch` (`src/utils/helpers/recipes.ts`) — и валидатор роута, и ввод на странице.

**4.** Значения `upTo15 | upTo30 | upTo60 | over60`; `String(search.time)` убран; ключи словаря переименованы.

**5.** `isNutritionEmpty` в `src/utils/helpers/recipes.ts` — используют `NutritionBlock` и `buildListItems`.

**6.** `SPage`: нижний отступ `FAB_SIZE + 2*FAB_OFFSET + env(safe-area-inset-bottom)` (в браузере без safe-area = 88px).

**7.** Счётчик: «Всего рецептов: N» — все неархивные уникальные; при активном поиске/фильтрах — «Найдено: N». Ключ `recipeList.found`.

**8.** Тесты `buildListItems` (6 кейсов: архивный отсутствует; нет веса и override → `kcal100: null`; override без состава; расчёт из состава; продукт без КБЖУ → `isNutritionIncomplete`; нормализация `searchTexts`) и `normalizeRecipesSearch` (4 кейса).

**9.** `<h3>` теперь обёртка вокруг `<button>` (идиома аккордеона), внутри кнопки `Caption1 as="span"`; `recipeList.title` удалён, заголовок берётся из `navigation.recipes`.

### Находка по ходу живой проверки (в рамках пункта 3)
Роутер накладывает результат `validateSearch` на сырой поиск из адреса: ключи, которые валидатор не вернул, остаются как есть. Из-за этого `?time=zzz` и прежний `?time=60` проходили в поиск неотфильтрованными (в итерации 1 такая же ошибка была). `normalizeRecipesSearch` теперь возвращает отброшенные поля явным `undefined`, чего достаточно; тест это фиксирует.

## Files created
- `src/components/BackLink/_BackLink.tsx`
- `src/constants/recipes.constants.ts`
- `src/utils/__tests__/recipes.test.ts`
- (из итерации 1, без изменений в списке) `src/pages/RecipesPage/**`, `src/utils/search.ts`, `src/utils/__tests__/search.test.ts`, `src/utils/helpers/recipes.ts`

## Files modified
- `src/components/BackLink/_styles.ts` (теперь экспортирует `SBackAnchor`), `src/components/BackLink/index.ts`
- `src/pages/RecipePage/_RecipePage.tsx` — без `lastRecipesSearch`
- `src/pages/RecipePage/_internal/NutritionBlock/_NutritionBlock.tsx` — `isNutritionEmpty`
- `src/pages/RecipeEditorPage/_RecipeEditorPage.tsx` — одна подпись «← Назад»
- `src/pages/RecipeEditorPage/_useRecipeSave.ts` — навигация после сохранения
- `src/pages/RecipesPage/{_RecipesPage.tsx,_constants.ts,_helpers.ts,_helpers.test.ts,_styles.ts,_useCollapsedGroups.ts,_useRecipesList.ts}`, `_internal/CategoryGroup/{_CategoryGroup.tsx,_styles.ts}`, `_internal/FiltersSheet/_FiltersSheet.tsx`
- `src/routes/_routes.tsx` — `validateSearch: normalizeRecipesSearch`, без эффекта и констант времени
- `src/types/recipes.types.ts`, `src/types/i18n.types.ts`, `public/dictionaries/ru.json`
- `src/utils/helpers/recipes.ts` — `isNutritionEmpty`, `normalizeRecipesSearch`
- `plans/recipe-book-v1/EXECUTION.md` — запись «Итерация 2»
- Удалены: `src/utils/lastRecipesSearch.ts`, `src/pages/RecipePage/_helpers.ts` (с итерации 1)

## UIKit wrappers
Новых `styled(<примитив>)` нет.

## Verification
- Baseline: переиспользован из итерации 1 (`baseline/p10-*.log`, оба exit 0).
- `pnpm lint` — exit 0, чисто. `pnpm build` — exit 0. `pnpm test --run` — 80/80 (было 70).
- Exports: `COOK_TIME_FILTERS` — `recipes.ts`, `FiltersSheet`; `isNutritionEmpty` — `NutritionBlock`, `_helpers.ts`; `normalizeRecipesSearch` — роут, хук; `BackLink`/`SBackAnchor` — потребители / `_BackLink`. Висячих нет; `grep lastRecipesSearch|backToRecipe|COOK_TIME_VALUES` в `src`/`public` — 0.
- Живая проверка на локальном стеке (Docker и Supabase были запущены; `pnpm dev`; headless Chromium через playwright-core, 390×844, **реальные нажатия клавиш**, dev-пользователь; тестовые рецепты `ZZ …` заведены SQL и удалены, `select` — 0 остатка; `pnpm dev` остановлен):
  - набор «плов» → `/?q=плов`, «Найдено: 1», поле хранит значение;
  - список с поиском → карточка → «← Назад» → тот же адрес и поле «плов»;
  - таб «Рецепты» при активном поиске → `/`, поле пустое, показаны все, «Всего рецептов: N»;
  - `goBack` в пределах роута (`/?q=суп` → `/`) очищает поле; загрузка `/?q=суп` — поле заполнено;
  - список с поиском → карточка → «Редактировать» → сохранить → оказываемся на той же карточке; «← Назад» → `/?q=плов`;
  - новый рецепт: FAB → сохранить → карточка нового рецепта → «← Назад» → список (`/?q=плов`);
  - карточка по прямой ссылке в новой вкладке → «← Назад» → `/`;
  - карточка продукта → «← Назад» → `/products`;
  - фильтры: лист → «до 30 мин» → `?time=upTo30`, «Найдено: 2»; `?q=плов&freezable=true&time=upTo60` применяется; `?time=60` и `?time=zzz` отбрасываются (до правки `normalizeRecipesSearch` проходили);
  - `button h3` — 0, `h3 > button` — 2, высота кнопки 44px; нижний отступ страницы 88px;
  - консоль: 0 ошибок (`pageerror` и `console.error`); `.playwright-mcp` не создавался (скрипт вне репозитория).
- Phase stop condition: выполнено по пунктам «Проверки» и дополнению.
- **Не проверено:** вид на iPhone/в PWA; поведение `history.back()` в установленном PWA на iOS (там нет кнопки «назад», но стек истории роутера работает так же — вживую не смотрено); safe-area (в headless = 0); лист фильтров глазами (только поведение через DOM); перекрытие FAB последней карточкой визуально (проверено числом отступа, не скриншотом); гонка быстрого набора с запаздывающим адресом (при `replace`-навигации на практике не воспроизвелась, но формально ввод может быть на мгновение перезаписан адресом).

## Known issues / follow-ups
- Если пользователь открыл редактор прямой ссылкой, а потом пошёл по другим экранам и вернулся в редактор, `canGoBack` истинно, и после сохранения «шаг назад» приведёт не на карточку рецепта. Это следствие выбранного владельцем решения (история вместо запоминания); в штатных путях (карточка → редактор) работает как задумано.
- `getNutritionOverrides` по-прежнему в двух местах (общий и вариант с `null` в `RecipeEditorPage/_helpers.ts`) — вне фазы.
- Живая проверка выполнена скриптом, а не руками; `src/utils/helpers/nutrients.ts` по-прежнему не проходит `prettier --check` без моих правок (прежний дрейф).
