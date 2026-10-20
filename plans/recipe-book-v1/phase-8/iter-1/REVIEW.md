MODE: review
STATUS: NEEDS_CHANGES
Issue source: code

<!-- Ревьюер не смог записать файл сам (у него нет инструмента Write); текст перенесён оркестратором из его отчёта без изменений по существу. -->

## Summary
Проверена вся Фаза 8: две миграции, схемы, типы, сервис и мутации, `RecipeEditorPage`, `useRecipeDraft`, `image.ts`, маршруты и словарь. Миграции и слой данных сделаны аккуратно и соответствуют плану. `pnpm lint` (exit 0), `pnpm test --run` (32/32), `pnpm build` (exit 0) подтверждают отчёт разработчика. Найден один функциональный дефект в автосохранении черновика, нарушение iOS-правила про 16px и два мелких замечания по конвенциям.

## Issues

### Code issues

#### Correctness
- [code] `src/pages/RecipeEditorPage/_useRecipeEditor.ts:73-75`, `_helpers.ts:8-24, 81-104, 181-183` — `areDraftsEqual` сравнивает через `JSON.stringify`, а порядок ключей у сравниваемых объектов разный. `draft` собирается через `fieldsToDraftPart(...)` (`name, servingsBase, yieldGrams, cookTimeMin, freezable, freezerDays, fridgeDays, notes`, затем `photoPath, videoUrls, …`), а `initialDraft` из `createEmptyDraft` / `recipeToDraft` / `recipeDraftSchema` — в порядке `…, cookTimeMin, photoPath, notes, freezable, freezerDays, fridgeDays, …`. Проверено в `node` на сокращённом примере: строки не совпадают, `areDraftsEqual` всегда `false`. Следствие: открытие `/recipes/new` или `/recipes/<id>/edit` без единой правки пишет черновик в localStorage через 500 мс или при unmount/`pagehide`, и при следующем заходе пользователь видит «Есть несохранённый черновик» для нетронутой формы. Комментарий к `areDraftsEqual` описывает свойство, которого у кода нет. Исправить: сравнение, не зависящее от порядка ключей, либо сборка `draft` и `initialDraft` одной функцией. В проверку добавить «открыл и ушёл — ключа в localStorage нет».

#### iOS / Styling
- [code] `_internal/RecipeForm/_RecipeForm.tsx:54,66,78`, `_internal/IngredientRow/_IngredientRow.tsx:61`, `_internal/StorageFields/_StorageFields.tsx:37,47`, обёртка `_styles.ts:89-93` — `SNumberInput` не получает `size`, остаётся Mantine-дефолт `sm` со шрифтом 14px; `mantineTheme` размеры не переопределяет. Safari на iOS зумит страницу при фокусе на поле со шрифтом меньше 16px. Прецедент: `VariantFormSheet` и `ProductFormSheet` передают `size="md"`. Передать `size="md"`; обёртку с `min-height: 44px` оставить (`md` даёт 42px). Затронуты поля времени, порций, выхода, граммов ингредиента и сроков хранения.

#### Placement / Types
- [code] `_RecipeEditorPage.tsx:15` — `type TDraftChoice` объявлен в TSX, хотя у страницы есть `_types.ts`. Раз `_types.ts` существует, все локальные типы компонента живут в нём.
- [code] `_useRecipeEditor.ts:43-47,95` и `_internal/DishCategoryField/_DishCategoryField.tsx:17-34` — `toggleDishCategory` нужен одному потомку (`DishCategoryField`), но объявлен в фича-хуке и пробрасывается через `RecipeForm`. По конвенции (Placement → «Handlers obey it too») обработчик живёт в потомке; функциональное обновление сохранится, если передать в `DishCategoryField` сеттер состояния. Приоритет низкий.

## Notes

**Проверено и принято.** `save_recipe`: `security invoker`, `set search_path = ''`, все объекты с `public.`; `revoke`/`grant` с сигнатурой, совпадающей с объявлением (18 типов); один путь на создание и правку; `sort_order = idx - 1` из `with ordinality`; `DELETE` только по дочерним таблицам; `archived_at` и `created_at` при `on conflict` не затираются. Вторая миграция (`select` на `storage.objects` для `recipe-photos`, `to authenticated`) минимальна и обоснована: upsert идёт через `insert … on conflict`, которому нужен select.

**Именованные отклонения.** (1) Собственный debounce вместо `saveOnChange` оправдан: списки в `useForm` не живут; утверждение в «Дополнениях 7.5» было неточным. (2) Собственный `handleSubmit` вместо `form.onSubmit` оправдан FIXME про `isDirty`: перестановка строк не меняет скалярные поля. Этот FIXME теперь реально мешает вызову — владельцу решить, чинить ли хук. (3) `on conflict (id)` оправдан: id фото известен до сохранения, повторная отправка идемпотентна. (4) Файлы вне списка — внутренности экрана, размещены по лестнице верно.

**Инварианты.** Арифметика КБЖУ только через `calculateNutrition` / `resolveIngredients`; молчаливых нулей нет; округление в `NutrientsRow`; удалений из приложения нет; `satisfies` на месте; форма `IRecipe` не менялась, `CACHE_BUSTER` поднимать не нужно. Экспорты с импортёрами, комментарии без следов пайплайна, i18n по правилам.

**Наблюдения без блокировки.**
- `src/domain/schemas/_recipes.ts`: `videoUrls: z.array(z.url())` пропускает любую схему, включая `javascript:`. Когда в Фазе 9 ссылки станут `href`, протокол ограничить до `http(s)`.
- `_types.ts:29-35`: `TRecipeFields` через условный mapped-тип; `interface` из восьми полей читался бы проще. `TUpdateField` дублирует сигнатуру `updateFieldValue` из `useForm`.
- `ingredient.unnamedVariant` и `ingredient.sheet.unnamedVariant` — одинаковое значение.
- `useRecipePhotoUrl` в `recipes.queries.ts` — `useMemo` над чистой функцией, а не запрос.
- Enter в поле «Название» отправляет форму; на iOS «Готово» сохранит рецепт.
- `crypto.randomUUID()` недоступен на небезопасном origin: dev-сервер с iPhone по `http://<IP>` не откроется; на проде по HTTPS проблемы нет.
- `PhotoField` оставляет `console.error` в `catch` — прецедент есть.
- Подмены проверки названы честно: `pnpm test --run`, остановка PostgREST вместо DevTools → Offline, синтетические события. Реальные жесты, камера и клавиатура iOS — на проверку владельцу.
