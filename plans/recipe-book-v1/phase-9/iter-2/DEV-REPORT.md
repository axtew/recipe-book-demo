Status: COMPLETED

## Phase goal
Фаза 9, итерация 2: правки по ревью (пункты 1-5). Кнопка «Готовила» осталась в Фазе 11.

## What was implemented
1. `src/components/BackLink` — общая ссылка «назад» (`createLink` над `styled.a`, min-height 44px, цвет primary, без подчёркивания, `align-self: flex-start`). Карточка, редактор и ProductPage переключены, три копии `SBack` удалены. У ProductPage ссылка теперь не растягивается на всю ширину колонки (было `styled(Link)` без `align-self`); у карточки `align-self` в строке с кнопкой «Редактировать» на вид не влияет (обе по 44px).
2. `toDayNumber` без `export`; тесты разности дат идут через `calculateCookStats` (месяц, конец месяца/года, високосный, целый год).
3. `formatDecimal` в `src/utils/helpers/nutrients.ts`; `CookStats` и `IngredientsBlock` используют его, `IngredientsBlock/_helpers.ts` удалён.
4. `VideoBlock/_helpers.ts`: `getVideoLinks` (только http/https, мусор и чужие схемы пропускаются, без падения), `getVideoLabel` заменён; блок возвращает `null`, если ссылок не осталось. Тест `_helpers.test.ts`.
5. `metaParts` перенесён в `_useRecipeCard.ts`; в `IngredientsBlock` вместо `return null` — `throw` (как в `resolveIngredients`).

## Files created
- `src/components/BackLink/{index.ts,_styles.ts}`
- `src/pages/RecipePage/_internal/VideoBlock/_helpers.test.ts`
- (с итерации 1 остаются на месте все файлы `src/pages/RecipePage/**`, `src/utils/helpers/nutrients.ts`)

## Files modified
- `src/pages/RecipePage/{_RecipePage.tsx,_styles.ts,_useRecipeCard.ts}`
- `src/pages/RecipePage/_internal/{CookStats/_CookStats.tsx,CookStats/_helpers.ts,CookStats/_helpers.test.ts,IngredientsBlock/_IngredientsBlock.tsx,VideoBlock/_VideoBlock.tsx,VideoBlock/_helpers.ts}`
- `src/pages/RecipeEditorPage/{_RecipeEditorPage.tsx,_styles.ts}`, `src/pages/ProductPage/{_ProductPage.tsx,_styles.ts}`
- `src/utils/helpers/nutrients.ts`
- Удалён: `src/pages/RecipePage/_internal/IngredientsBlock/_helpers.ts`
- `plans/recipe-book-v1/EXECUTION.md` — заметка «Итерация 2» в записи Фазы 9
- (прочее с итерации 1 без изменений)

## Verification
- `pnpm lint` — чисто. `pnpm build` — exit 0. `pnpm test` — 56/56 (4 теста дат переписаны, +3 на видео). `pnpm format` прогнан.
- Exports: `BackLink` (3 экрана), `formatDecimal` (2 места), `getVideoLinks` (VideoBlock); `getVideoLabel`/`formatGrams`/`toDayNumber` — ссылок не осталось.
- Живая проверка ссылок «назад» на трёх экранах не выполнялась.

## Known issues / follow-ups
- Кнопка «Готовила» — Фаза 11.
