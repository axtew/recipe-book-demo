Status: COMPLETED

## Phase goal
Редактор рецепта (`/recipes/new`, `/recipes/$recipeId/edit`) вместе с данными: функция `save_recipe` в базе, мутации сохранения и загрузки фото, перегенерированные типы. Подробный журнал с таблицей «Проверка» и отклонениями — в `plans/recipe-book-v1/EXECUTION.md`, раздел «Фаза 8».

## ВАЖНО для владельца
Обе миграции применены **только к локальной базе** (`npx supabase migration up`). Перед выкаткой фронта нужен `npx supabase db push`:
- `supabase/migrations/20261003152020_save_recipe.sql` — функция `save_recipe`;
- `supabase/migrations/20261018040024_recipe_photos_select_policy.sql` — политика `select` на бакет `recipe-photos` (без неё замена уже загруженной обложки падает с 403).
`.env*` не трогались, в облако ничего не писалось.

## What was implemented
- **База.** Черновик `save_recipe` переписан целиком (имя файла сохранено): `insert … on conflict (id) do update` + перезапись дочерних строк, массивы тремя `jsonb`, `sort_order` из позиции в массиве, `security invoker`, `revoke … from public, anon`, `grant … to authenticated`. Проверено на локальной базе: создание, редактирование, новый рецепт с заданным клиентом id; атомарность (отказ по `check` и по составному ключу оставляет прежнее состояние целиком); `anon` получает `42501` и через psql, и через REST.
- **Данные.** `IRecipeInput` и `IRecipeDraft`; `sortOrder` убран из вложенных схем, `recipeInputSchema` связана через `satisfies`, `recipeDraftSchema` для чтения черновика; `saveRecipe`, `uploadRecipePhoto`, `getRecipePhotoUrl`; `useSaveRecipeMutation` (инвалидация ключа рецептов), `useUploadRecipePhotoMutation`, `useRecipePhotoUrl`.
- **Экран.** `RecipeEditorPage` в порядке полей плана: название, категории блюда, время / порции / выход, фото, состав и шаги с перетаскиванием (dnd-kit, ручка с `touch-action: none`, вертикальная стратегия под шаги разной высоты), хранение, видео, заметки; липкая плашка КБЖУ над таб-баром; черновик в localStorage с вопросом «Восстановить / Начать заново»; инлайн-создание продукта и варианта через листы Фазы 7; фото сжимается до 1200 px / WebP.
- Скалярные поля — в `useForm`, списки — рядом (`useKeyedList`); отправка и автосохранение черновика — собственные (см. отклонения).

## UIKit wrappers
- `SNumberInput` (`styled(NumberInput)`, `RecipeEditorPage/_styles.ts`): поднимает высоту поля до 44px (тап-цель iOS) — размеры из шкалы Mantine ниже порога; пропсом это не выражается.
- `SBottomSheetDrawer` (существующий общий) используется в `IngredientOptionsSheet`, новых обёрток над ним нет.

## Files created
- `supabase/migrations/20261018040024_recipe_photos_select_policy.sql`
- `src/api/mutations/recipes.mutations.ts`
- `src/hooks/useRecipeDraft.hook.ts`
- `src/utils/image.ts`
- `src/pages/RecipeEditorPage/` — `index.ts`, `_RecipeEditorPage.tsx`, `_helpers.ts`, `_types.ts`, `_styles.ts`, `_useRecipeEditor.ts`, `_useRecipeSave.ts`, `_useRecipeNutrition.ts`, `_useKeyedList.ts`; `_internal/`: `RecipeForm`, `DraftPrompt`, `DishCategoryField`, `PhotoField`, `IngredientList`, `IngredientRow` (+ `_internal/IngredientOptionsSheet`), `StepList` (+ `_StepRow.tsx`), `StorageFields`, `VideoLinks`, `NutritionBar`, `SortableList` (+ `_SortableItem.tsx`), `RemoveButton`
- `plans/recipe-book-v1/phase-8/` — этот отчёт и baseline

## Files modified
- `supabase/migrations/20261003152020_save_recipe.sql` — переписан целиком
- `src/types/database.types.ts` — перегенерирован (`pnpm db:types`), +`save_recipe`
- `src/types/recipes.types.ts`, `src/types/i18n.types.ts`
- `src/domain/schemas/_recipes.ts`, `src/domain/schemas/index.ts`
- `src/api/services/recipes.service.ts`, `src/api/queries/recipes.queries.ts`
- `src/routes/_paths.ts`, `src/routes/_routes.tsx` (поверх правок владельца: дженерик-фабрики и `useParams` сохранены)
- `public/dictionaries/ru.json` (единственный словарь; раздел `recipeEditor`)
- `package.json`, `pnpm-lock.yaml` — четыре разрешённые зависимости
- `plans/recipe-book-v1/EXECUTION.md` — дописан раздел «Фаза 8»
- Не тронуты (чужие правки владельца): `.github/upstream-conventions-inbox.md`, `src/hooks/useForm/_useForm.hook.ts`.

## Verification
Команды: `pnpm format` (на `src`), `pnpm lint`, `pnpm build`, `pnpm test --run`; фаза других команд не называет. Подстановок нет (`pnpm test --run` вместо интерактивного `pnpm test`, чтобы не зависнуть на watch).
- Lint: exit 0, чисто (baseline тоже чистый).
- Build (`vite build && tsc -b`): exit 0; единственное предупреждение — размер чанка, было и в baseline.
- Test: 2 файла, 32/32.
- Exports: у каждого нового экспорта есть импортёр вне файла; провизионных нет. Исключение — три экспорта в `domain/schemas/index.ts` без импортёров, существовавшие до фазы (не тронуты).
- Stop condition фазы: выполнены все файлы из списка; живая проверка на локальном стеке — таблица в `EXECUTION.md` (атомарность, `anon`, 10 ингредиентов + 8 шагов, плашка, черновик, перетаскивание, фото, `sort_order`, редактирование, инлайн-создание продукта и варианта).
- Runtime/browser: проверка диагностическая и шла через DOM-события, а не реальные клики (инструмент не доставлял клики); перетаскивание — синтетические `PointerEvent` (mouse и touch); DevTools → Offline заменён остановкой контейнера PostgREST. Настоящий палец и камера iPhone, клавиатура iOS — не проверялись. Визуального ревьюера в проекте нет (`visual_verification: false`).
- Живые данные, созданные проверкой (рецепты, продукт «Новинка», файл в бакете), удалены; локальный стек оставлен запущенным; `.playwright-mcp` удалён.

## Known issues
Отклонения (подробно в `EXECUTION.md`):
1. Автосохранение черновика — собственный debounce в `useRecipeDraft`, не `saveOnChange`: поля `useForm` скалярные, списки в нём не живут, а `saveOnChange` стреляет только по `isValid && isDirty` скалярных полей.
2. Отправка формы — свой `handleSubmit`, не `form.onSubmit`: тот выходит при `!isDirty` (помеченный `FIXME`), а правка только порядка строк `isDirty` не меняет.
3. Вторая миграция (политика `select` на бакет фото) — найдено живой проверкой, в плане её нет.
4. `save_recipe` принимает id клиента заранее (`on conflict`), чтобы фото легло по пути с id до сохранения.
5. Меню строки состава — нижний лист, не выпадающее меню.
6. Редирект после сохранения — на `/` (карточки рецепта до Фазы 9 нет).
7. Файлы вне списка фазы — внутренности экрана (перечислены в `EXECUTION.md`).

Найдено и исправлено в фазе: отправка вложенного листа (создание продукта / варианта) всплывала до внешней формы и сохраняла рецепт — добавлена проверка `event.target === event.currentTarget`; быстрый повторный клик по категории терял предыдущий — переведено на функциональное обновление.

Вне фазы / на заметку:
- Точки входа в редактор в интерфейсе нет (кнопка «＋» — Фаза 10); открывается по адресу.
- Замена обложки по тому же пути может показываться из кэша до часа; убранное фото остаётся в бакете; выбранное в сессии фото в черновик не попадает.
- Третья копия стилей текстового поля (`ProductFormSheet`, `VariantFormSheet`, редактор) — повод для общего компонента при следующем потребителе.
- Планировщик: в плане для `save_recipe` описано ветвление insert/update — реализовано через `on conflict` по причине выше; список файлов фазы не включал компоненты-обёртки (`RecipeForm`, `DishCategoryField` и др.) — это не блокер.
- `STATUS.md` не тронут.
