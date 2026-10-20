MODE: review
STATUS: APPROVED
Issue source: none

## Summary
Итерация 2 закрыла все пять замечаний ревью итерации 1. Регрессий в остальной части фазы не найдено. Перепроверено лично: `pnpm lint` чисто, `pnpm build` успешно (только прежнее предупреждение о размере чанка, PWA precache 9 записей), `pnpm test` 6 файлов, 56/56.

## Проверка по пунктам итерации 2
1. **BackLink** — `src/components/BackLink/_styles.ts:19` (`createLink(styled.a)`), баррель `index.ts` отдаёт один символ. Типизация `params` сохранена: `_RecipeEditorPage.tsx` передаёт `params={{ recipeId: recipe.id }}` на `routerPaths.recipeCard`, `pnpm build` (tsc) проходит; остальные вызовы без params. `min-height: 44px` на месте. Три копии `SBack` удалены (grep по `SBack` в `src` пуст), импорты `Link` из `_styles.ts` ProductPage и редактора убраны. `align-self: flex-start`: в редакторе он был и раньше; в карточке (`STopBar`, строка с `SEditLink`, оба 44px) на вид не влияет; на ProductPage (`SPage` — column-flex) ссылка перестала растягиваться на всю ширину колонки, высота тап-цели прежние 44px, ширина теперь по тексту. Это сужение зоны касания до видимого текста, не регрессия; на экране «продукт не найден» то же.
2. **`toDayNumber`** — без `export` (`CookStats/_helpers.ts:18`), внешних ссылок нет. Тесты идут через `calculateCookStats` (`daysBetween`): месяц, конец месяца/года, високосный 2028 против 2027, целый год 365/366 — границы покрыты не слабее прежнего.
3. **`formatDecimal`** — `src/utils/helpers/nutrients.ts:20`, ровно два потребителя (`CookStats`, `IngredientsBlock`), локальные `Intl.NumberFormat` и `IngredientsBlock/_helpers.ts` удалены. Это не нутриентная арифметика: чистое форматирование, вход — готовое число, ничего не вычисляется; округление остаётся только на показе (`Math.round` среднего выхода в `_CookStats.tsx:44` — тоже слой показа, домен сырой).
4. **VideoBlock** — `getVideoLinks` пропускает всё кроме `http:`/`https:` и нечитаемые адреса (`try/catch` вокруг `new URL`), блок при пустом результате возвращает `null`. Тест `_helpers.test.ts` покрывает http/https + подпись, `javascript:`/`data:`/мусор, пустой список. Устаревший `getVideoLabel` удалён.
5. **`metaParts`** — в `_useRecipeCard.ts:60` под `useMemo`, зависимости полные; `_RecipePage.tsx` только делает `join`. Ветка в `IngredientsBlock` (`:45-47`) бросает ошибку с понятным сообщением, согласованно с `resolveIngredients`.

Остальное: экспорты новых символов имеют импортёров (`BackLink` — 3 экрана, `formatDecimal` — 2 места, `getVideoLinks` — VideoBlock, `formatKcal/formatMacro` — NutrientsRow и NutritionBlock). Комментарии новых/изменённых файлов проверены: цель в первой строке, без следов пайплайна, на русском. i18n, hex-литералов, `100vh` нет. Инварианты (арифметика КБЖУ только в домене, без `Date`, без молчаливых нулей, округление при показе) соблюдены. Кнопка «Готовила» — по решению владельца в Фазе 11, её отсутствие корректно.

## Notes
- `src/utils/helpers/nutrients.ts:1-6` — шапка файла говорит «Форматирование чисел КБЖУ», а `formatDecimal` форматирует граммы и дни, не КБЖУ. Мелочь: поправить формулировку шапки (или имя файла при появлении третьего ненутриентного форматтера).
- `src/components/BackLink/_styles.ts` — компонент без S-префикса живёт в `_styles.ts` без `_BackLink.tsx`. Есть прецедент (`TextInput/_styles.ts` отдаёт `STextInput` без tsx), но там имя с `S`; здесь публичное имя `BackLink`. Допустимо, на усмотрение владельца.
- `_RecipePage.tsx:98` и `_VideoBlock.tsx:19` — двойная проверка «есть ссылки»: внешняя по `videoUrls.length`, внутренняя по отфильтрованным. Безвредно; внешнюю можно убрать, но она дешёвая.
- Живьём не проверено (признано): ссылки «назад» на трёх экранах, вид на iPhone (в т.ч. ширина зоны касания `BackLink` на ProductPage), сохранение нового рецепта с редиректом на карточку, видео во внешних приложениях, фото на карточке.
