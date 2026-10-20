# План: Книга рецептов, версия 1

slug: `recipe-book-v1`
Дата: 2026-08-02
Решения по стеку и продукту: `../../decisions.md` (источник истины, при расхождении приоритет у него)
Исходное ТЗ: `../../recipe-app-v1-prompt.md`

## Краткое содержание

Личное mobile-first веб-приложение на двух пользователей: справочник продуктов с двухуровневой структурой (продукт → варианты покупки с КБЖУ), рецепты с автоматическим расчётом КБЖУ, поиск по названию и по ингредиентам, журнал готовки. Фундамент под v2 — планирование меню на две недели и список покупок.

После выполнения плана: приложение установлено на телефоны как PWA, справочник наполняется реальными покупками, рецепты можно заводить и редактировать без выхода из экрана, КБЖУ считается на лету и пересчитывается при смене активного варианта продукта, журнал готовки копит статистику, вся база выгружается в JSON.

## Подход

Согласованное направление (детали и отвергнутые альтернативы — в `decisions.md`):

1. **Supabase как тупое хранилище с целостностью.** Своего серверного кода нет. Вся бизнес-логика на клиенте.
2. **Весь датасет грузится в клиент целиком.** Объём базы — единицы мегабайт даже через годы. Поиск, фильтры, расчёты — в памяти, без серверных endpoint'ов и пагинации.
3. **Расчёт КБЖУ — изолированный модуль чистых функций** без React и без обращений к сети. Тестируется юнит-тестами до всякого UI, переиспользуется в v2 при планировании и потенциально на сервере.
4. **Удаления нет, только архивирование.** Ссылочная целостность никогда не нарушается, история не рвётся.
5. **История не переписывается.** Текущее КБЖУ рецепта живёт от активных вариантов, а записи журнала хранят снапшот на момент готовки.

## Стек

| Слой | Выбор |
|---|---|
| Сборка | Vite + React 19 + TypeScript strict |
| Стили | styled-components (свои экраны) + Mantine 9 (тяжёлые компоненты) |
| Роутинг | TanStack Router, **code-based** — явное дерево роутов, без кодогенерации |
| Данные | TanStack Query v5 + `persistQueryClient` в IndexedDB |
| Валидация | zod |
| DnD | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Формы | свой хук, без библиотеки |
| Бэкенд | Supabase (Postgres + Auth + Storage) |
| Тесты | Vitest (модуль расчёта) |
| Хостинг | Cloudflare Pages, деплой из гита |

---

## Схема базы данных

Ниже — итоговое состояние схемы. Фактически собрано четырьмя миграциями (`init`, `reference_data`, `policies_dish_categories_cleanup`, `pinned_variant_integrity`) — историю правок см. в `EXECUTION.md`. Отличия от схемы в ТЗ перечислены в `decisions.md §4`.

```sql
create extension if not exists "pgcrypto";

-- ── Справочники категорий ──────────────────────────────────────────

create table product_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  integer not null default 0,   -- = порядок отделов в магазине, задел под список покупок
  created_at  timestamptz not null default now()
);

create table dish_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Продукты и варианты ────────────────────────────────────────────

create table products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  category_id       uuid not null references product_categories(id) on delete restrict,
  active_variant_id uuid,                    -- FK добавляется ниже, после product_variants
  note              text,
  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table product_variants (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  name           text,                       -- null у единственного варианта
  kcal_100       numeric(7,2) check (kcal_100    >= 0),
  protein_100    numeric(6,2) check (protein_100 >= 0),
  fat_100        numeric(6,2) check (fat_100     >= 0),
  carbs_100      numeric(6,2) check (carbs_100   >= 0),
  is_approximate boolean not null default false,
  source         text not null default 'manual'
                 check (source in ('seed', 'manual', 'label', 'llm')),
  note           text,
  archived_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint uq_variant_product unique (id, product_id)
);

-- Составной FK гарантирует, что активный вариант принадлежит именно этому продукту.
-- Работает потому, что products.id = product_variants.product_id.
alter table products
  add constraint fk_active_variant
  foreign key (active_variant_id, id)
  references product_variants(id, product_id)
  on delete restrict
  deferrable initially deferred;

-- ── Рецепты ────────────────────────────────────────────────────────

create table recipes (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  servings_base       integer not null default 1 check (servings_base > 0),
  yield_grams         numeric(8,1) check (yield_grams > 0),
  cook_time_min       integer check (cook_time_min > 0),
  photo_path          text,                  -- путь в бакете recipe-photos
  notes               text,
  video_urls          text[] not null default '{}',
  freezable           boolean not null default false,
  freezer_days        integer check (freezer_days >= 0),
  fridge_days         integer check (fridge_days  >= 0),
  kcal_100_override    numeric(7,2) check (kcal_100_override    >= 0),
  protein_100_override numeric(6,2) check (protein_100_override >= 0),
  fat_100_override     numeric(6,2) check (fat_100_override     >= 0),
  carbs_100_override   numeric(6,2) check (carbs_100_override   >= 0),
  archived_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table recipe_steps (
  id         uuid primary key default gen_random_uuid(),
  recipe_id  uuid not null references recipes(id) on delete cascade,
  sort_order integer not null,
  text       text not null
);

-- Категории блюда — много-ко-многим: блины это и завтрак, и десерт.
-- Составной первичный ключ запрещает дубли и даёт индекс с ведущим recipe_id,
-- то есть выборка «категории этого рецепта» уже покрыта. Обратное направление
-- («рецепты этой категории», для группировки на главном экране) требует своего
-- индекса — составной индекс работает только слева направо.
create table recipe_dish_categories (
  recipe_id        uuid not null references recipes(id)         on delete cascade,
  dish_category_id uuid not null references dish_categories(id) on delete restrict,
  primary key (recipe_id, dish_category_id)
);

create table recipe_ingredients (
  id                uuid primary key default gen_random_uuid(),
  recipe_id         uuid not null references recipes(id) on delete cascade,
  product_id        uuid not null references products(id) on delete restrict,
  pinned_variant_id uuid,   -- составной FK ниже: вариант обязан принадлежать этому же продукту
  amount_grams      numeric(8,1) not null check (amount_grams > 0),
  is_optional       boolean not null default false,
  note              text,
  sort_order        integer not null
);

-- Тот же приём, что у products.active_variant_id: ссылка парой (продукт,
-- вариант) не даёт закрепить за ингредиентом вариант другого продукта.
-- Отсрочка не нужна — круговой ссылки здесь нет.
alter table product_variants
  add constraint uq_variant_product_reversed unique (product_id, id);

alter table recipe_ingredients
  add constraint fk_pinned_variant
  foreign key (product_id, pinned_variant_id)
  references product_variants(product_id, id)
  on delete restrict;

-- ── Журнал готовки ─────────────────────────────────────────────────

create table cook_logs (
  id                 uuid primary key default gen_random_uuid(),
  recipe_id          uuid not null references recipes(id) on delete cascade,
  cooked_at          date not null default current_date,
  multiplier         numeric(4,2) not null default 1 check (multiplier > 0),
  actual_yield_grams numeric(8,1) check (actual_yield_grams > 0),
  containers         integer check (containers > 0),
  finished_at        date,
  rating             integer check (rating between 1 and 5),
  note               text,
  snapshot           jsonb not null,          -- см. INutritionSnapshot
  created_at         timestamptz not null default now(),
  constraint chk_finished_after_cooked check (finished_at is null or finished_at >= cooked_at)
);

-- ── Индексы ────────────────────────────────────────────────────────

create index idx_products_category     on products(category_id);
create index idx_variants_product      on product_variants(product_id);
create index idx_ingredients_recipe    on recipe_ingredients(recipe_id);
create index idx_ingredients_product   on recipe_ingredients(product_id);
create index idx_steps_recipe          on recipe_steps(recipe_id);
create index idx_rdc_category          on recipe_dish_categories(dish_category_id);
create index idx_cook_logs_recipe      on cook_logs(recipe_id, cooked_at desc);

-- ── updated_at ─────────────────────────────────────────────────────
-- Триггерная функция touch_updated_at() на products, product_variants, recipes.

-- ── Доступ: гранты + RLS ───────────────────────────────────────────
-- Запрос проходит ДВЕ независимые проверки, в этом порядке:
--   1) grant  — имеет ли роль право обращаться к таблице (иначе 42501);
--   2) политика RLS — какие строки видны.
-- Забыть можно любую, и симптомы разные: без политики — пустой список без
-- ошибки, без гранта — явная 42501. Нужны обе, на КАЖДОЙ из 9 таблиц.
--
-- Политика: for all to authenticated using (true) with check (true).
-- Разграничения по владельцу нет — база общая семейная. Роли anon — ничего.
--
-- Гранты избирательные: право DELETE НЕ выдано на products, product_variants,
-- recipes и таблицы категорий — так инвариант «удалений нет, только
-- archived_at» становится невыполнимым действием, а не соглашением. DELETE
-- выдан там, где строка живёт внутри родителя и архивировать нечего:
-- recipe_steps, recipe_ingredients, recipe_dish_categories, cook_logs.
--
-- alter default privileges НЕ используется намеренно: новая таблица должна
-- падать с внятной 42501, а не получать права молча.
```

### Ключевые решения по схеме

- **КБЖУ у варианта nullable.** Позволяет завести продукт быстро («потом заполню») — а это прямо тот сценарий, ради которого делается инлайн-создание. Продукт считается «с неполным КБЖУ», если у него нет активного варианта **или** у активного варианта null в любом из четырёх полей. Такие продукты попадают в предупреждение в карточке рецепта.
- **`sort_order` без unique-констрейнта.** При переупорядочивании переписываем весь список строк одним upsert'ом — при десятке шагов это дешевле, чем возня с отложенными констрейнтами.
- **Снапшот в `cook_logs` — jsonb, а не нормализованные таблицы.** Это замороженный документ, который никогда не участвует в реляционных запросах, только читается целиком.
- **Составной FK на активный вариант** вместо триггера — БД сама не даст назначить активным вариант чужого продукта. **Тем же приёмом закрыт `pinned_variant_id`** у ингредиента: закрепить за огурцами вариант сливочного масла нельзя. Для этого на вариантах два похожих уникальных ограничения с разным порядком столбцов — `(id, product_id)` для ссылки с продукта и `(product_id, id)` для ссылки с ингредиента; внешний ключ требует, чтобы ведущим был тот столбец, по которому он ищет.
- **Полей `barcode` / `external_id` нет.** Заводились под сканер штрихкодов, но проверка Open Food Facts на реальных вьетнамских упаковках провалилась (`decisions.md §6.5`), внешних источников не будет, а поле, к которому нет источника, — мёртвый груз.

### Storage

Бакет `recipe-photos`, **публичный**. Путь `${recipeId}/cover.webp`.

Публичный, потому что: URL стабильный и его кэширует service worker (фото видно офлайн), тогда как signed URL протухает и офлайн ломается. Риск нулевой — это фото еды по адресу со случайным UUID.

### Стартовые данные

Предзаполняются **только категории блюд**: завтраки, обеды, ужины, супы, выпечка, десерты, заготовки. Лежат в **миграции** `<timestamp>_reference_data.sql`, а не в `supabase/seed.sql` — `db push` seed-файл не выполняет, он применяется только при локальном `db reset`, и в проде база осталась бы пустой.

**Справочник продуктов и категории продуктов не предзаполняются** (решение от 2026-08-18). Заполняется вручную тем, что реально покупается в местном магазине: усреднённый справочник всё равно пришлось бы заменять на реальные покупки, а до тех пор он висел бы мусором и путал — непонятно, проверенные это цифры или ещё нет.

**Следствие для Фаз 6–7:** на старте `product_categories` и `products` **пустые**. Экраны обязаны показывать внятное пустое состояние, а не ломаться и не подразумевать, что справочник заполнен. Свои категории и продукты владелец добавляет напрямую в базе (`phase-1-tutorial.md`, часть 4), пока не появится экран управления справочником.

---

## Доменные типы и zod-схемы

Живут в `src/domain/`. Одна схема — три роли: валидация форм, валидация импорта JSON, позже schema для structured output локальной LLM.

```typescript
// src/domain/nutrition/_types.ts
export interface INutrients {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

/** Ингредиент с уже разрешённым вариантом и его КБЖУ. */
export interface IResolvedIngredient {
  ingredientId: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  amountGrams: number;
  isOptional: boolean;
  isPinned: boolean;
  /** null, если у варианта не заполнено КБЖУ или активного варианта нет */
  nutrientsPer100: INutrients | null;
}

export type TNutritionBasis = "yield" | "rawWeight";

export interface IRecipeNutrition {
  total: INutrients;
  per100g: INutrients;
  perServing: INutrients;
  basis: TNutritionBasis;
  rawWeightGrams: number;
  yieldGrams: number | null;
  /** Поля, значение которых взято из *_override, а не посчитано */
  overriddenFields: (keyof INutrients)[];
  /** Продукты без КБЖУ — источник предупреждения в карточке рецепта */
  incompleteProducts: { productId: string; productName: string }[];
}

/** Замораживается в cook_logs.snapshot */
export interface INutritionSnapshot {
  version: 1;
  nutrition: IRecipeNutrition;
  servingsBase: number;
  ingredients: Pick<
    IResolvedIngredient,
    "productId" | "productName" | "variantId" | "variantName" | "amountGrams" | "isOptional"
  >[];
}
```

---

## Модуль расчёта КБЖУ

`src/domain/nutrition/` — чистые функции, ноль импортов из React, Supabase и Mantine. Единственный источник арифметики в приложении.

```typescript
resolveIngredients(recipeIngredients, products, variants): IResolvedIngredient[]
calculateNutrition(resolved, params: {
  servingsBase: number;
  yieldGrams: number | null;
  overrides: Partial<INutrients>;
}): IRecipeNutrition
buildSnapshot(nutrition, resolved, servingsBase): INutritionSnapshot
scaleAmount(grams: number, multiplier: number): number
```

Правила, которые обязаны быть покрыты тестами:

1. Вариант берётся из `pinned_variant_id`, иначе активный вариант продукта, иначе `nutrientsPer100 = null`.
2. `is_optional === true` — ингредиент **не** участвует ни в КБЖУ, ни в весе сырья.
3. `rawWeightGrams` = сумма `amount_grams` неопциональных ингредиентов.
4. Делитель для `per100g`: `yieldGrams`, если задан и > 0; иначе `rawWeightGrams`. Поле `basis` сообщает UI, какая ветка сработала, — по нему рисуется подсказка про уварку.
5. `perServing = total / servingsBase`.
6. Ингредиент с `nutrientsPer100 === null` даёт вклад 0, но продукт попадает в `incompleteProducts`. **Молчаливых нулей быть не должно** — UI обязан показать предупреждение.
7. Override действует **на уровне «на 100 г», по каждому полю отдельно**. Если хоть один override задан: `total = effectivePer100 * basisWeight / 100`, `perServing = total / servingsBase`, а имена переопределённых полей уходят в `overriddenFields`. Если ни одного — обычная сумма.
8. Краевые случаи: `rawWeightGrams === 0` (нет ингредиентов) → все нутриенты нули, деления не происходит; `servingsBase` по схеме всегда > 0.
9. Округление внутри модуля **не делается** — возвращаются сырые числа. Округляет только UI: ккал до целых, БЖУ до одного знака.

---

## Экраны и навигация

Нижний таб-бар из четырёх вкладок, всегда виден на основных экранах.

| Роут | Экран | Содержимое |
|---|---|---|
| `/login` | Вход | Email + пароль. Регистрации нет, аккаунт заводится в дашборде Supabase |
| `/` | **Рецепты** (главный) | Группировка по категориям блюд со сворачиванием, поиск, фильтры, FAB «＋» |
| `/recipes/new` | Новый рецепт | Тот же редактор, что и edit |
| `/recipes/$recipeId` | Карточка рецепта | Просмотр + кнопка «Записать готовку» |
| `/recipes/$recipeId/edit` | Редактирование | Редактор |
| `/products` | **Продукты** | Список по категориям продуктов, поиск, «＋» |
| `/products/$productId` | Карточка продукта | Варианты, переключение активного, где используется |
| `/log` | **Журнал** | Лента записей по датам, отметка «доели» |
| `/settings` | **Настройки** | Экспорт/импорт JSON, управление категориями, выход |

Модалки (не роуты, локальное состояние): создание продукта, добавление варианта, быстрая запись готовки, подтверждение архивирования. Все — `Drawer` Mantine с `position="bottom"`.

### 1. Список рецептов

Карточка: фото или плейсхолдер, название, время готовки, ккал на 100 г, снежинка если `freezable`. Группы категорий сворачиваются, состояние свёрнутости живёт в localStorage.

**Категорий у рецепта может быть несколько или ни одной** (связь много-ко-многим). Рецепт показывается **в каждой** своей группе — это нормально и полезно: заглянула в «Завтраки», нашла блины. Рецепт без категорий попадает в группу **«Без категории»** в конце списка. Счётчики «всего рецептов» из-за этого считаются по уникальным рецептам, а не суммированием по группам.

Поиск сверху ищет **и по названию рецепта, и по названиям продуктов в его составе** — сценарий «что приготовить из того, что есть». Нормализация: lowercase + `ё` → `е` с обеих сторон сравнения, иначе «гречка» не найдёт «Гречка» и «мёд» не найдёт «мед».

Фильтры: только замораживаемые; время готовки (≤15 / ≤30 / ≤60 / >60 мин). Состояние фильтров и поиска — в search-params роута (типизированы TanStack Router), чтобы «назад» из карточки возвращал к тем же результатам.

### 2. Карточка рецепта

Порядок блоков строго по ТЗ: фото → название, категория, время → КБЖУ (крупно на 100 г, мельче на порцию и на всё блюдо) → блок хранения (только если `freezable`) → ингредиенты → шаги → видео → заметки → кнопка «Записать готовку».

Особые состояния:

- Есть продукты без КБЖУ → предупреждающий блок **над** цифрами со списком названий, каждое — ссылка на `/products/$productId`.
- `yield_grams` не задан → ненавязчивая подсказка «расчёт по весу сырья, уварка не учтена» рядом с цифрой на 100 г.
- Есть override → цифра помечена как введённая вручную + кнопка «пересчитать», сбрасывающая соответствующие `*_override` в null.
- У ингредиента продукт с более чем одним вариантом → под названием мелким шрифтом имя используемого варианта; если вариант запинен — рядом иконка «закреплён».
- Внизу — статистика из журнала: сколько раз готовила, когда в последний раз, средний фактический выход, среднее число дней от `cooked_at` до `finished_at`.

### 3. Редактор рецепта

Критический экран. Порядок полей: название → категория → время → порции → выход в граммах → фото → ингредиенты → шаги → морозилка (свитч, при включении раскрываются сроки) → видео → заметки.

- **Строка ингредиента**: Combobox поиска продукта + числовое поле граммов + меню (сделать опциональным, закрепить вариант, заметка, удалить). Ничего больше.
- Combobox не нашёл продукт → в выпадающем списке пункт **«Создать „{запрос}“»**, открывающий bottom sheet: название (предзаполнено запросом), категория, КБЖУ на 100 г (можно оставить пустым). Сохранил → продукт создан, подставлен в строку, фокус на поле граммов. Экран рецепта не покидается ни на секунду.
- У продукта уже есть варианты → в том же меню «добавить вариант», такая же модалка.
- **КБЖУ пересчитывается на лету**, липкая плашка снизу над таб-баром: ккал на 100 г и на порцию.
- **Автосохранение черновика** в localStorage под ключом `recipe-draft:${recipeId ?? "new"}`, debounce 500 мс. При открытии редактора с существующим черновиком — «Восстановить черновик?» / «Начать заново». После успешного сохранения черновик удаляется.
- Ингредиенты и шаги переупорядочиваются перетаскиванием за ручку (dnd-kit), `sort_order` переписывается целиком при сохранении.
- Фото: `FileInput` из Mantine → сжатие `browser-image-compression` до ~1200 px по длинной стороне и WebP → загрузка в Storage. Показывается превью с кнопкой замены/удаления.

### 4. Справочник продуктов

Список сгруппирован по категориям продуктов (порядок — `sort_order`). Карточка продукта:

- если вариант один — выглядит как простой продукт, вложенность не показывается;
- если больше одного — список вариантов, у активного отметка, переключение в один тап, у каждого КБЖУ и дата добавления, у усреднённых (`is_approximate`) — пометка «усреднённое, стоит заменить»;
- список рецептов, где продукт используется, со ссылками;
- архивирование продукта: если он используется в рецептах — предупреждение со списком рецептов, но операция разрешена (продукт остаётся в рецептах, просто пропадает из выбора). Архивирование активного варианта запрещено, пока он активный.

### 5. Журнал готовки

Быстрое добавление из карточки рецепта — bottom sheet: дата (по умолчанию сегодня), множитель кнопками ×1 ×2 ×3 ×4 + произвольное значение, фактический выход в граммах, число контейнеров, оценка звёздами, заметка. Всё опционально кроме даты и множителя, сохранение в два тапа.

При сохранении в `snapshot` пишется `INutritionSnapshot`, посчитанный на текущий момент.

Экран `/log` — лента по убыванию `cooked_at`, сгруппированная по месяцам. У записей без `finished_at` — кнопка «доели», ставящая сегодняшнюю дату (с возможностью выбрать другую).

---

## Структура проекта

Конвенции перенесены из `Carbon-spa` и живут в `.github/copilot-instructions.md` (собирается из `.github/instructions/`). Здесь — только раскладка папок этого проекта.

```
supabase/
  migrations/           миграции; владелец, агенты не трогают
src/
  api/
    supabase.ts         клиент
    services/           запросы к PostgREST, по файлу на домен; владелец
    queries/            хуки TanStack Query + ключи кэша
    mutations/          хуки мутаций с инвалидацией
  types/                глобальные типы, по файлу на домен или предмет
    database.types.ts   генерируется из схемы, руками не редактируется
    products.types.ts   IProduct, IProductVariant, IProductCategory
    recipes.types.ts    IRecipe, IRecipeIngredient, IRecipeStep, IDishCategory
    cookLogs.types.ts   ICookLog
    common.types.ts
    i18n.types.ts       интерфейс I18n — и ничего больше
  domain/
    nutrition/          чистый модуль расчёта + его внутренние типы
    schemas/            zod-схемы сущностей
    stats/              агрегаты по журналу готовки
    backup/             сериализация и валидация JSON-бэкапа
  components/           общие компоненты; вложенные части в _internal/
  pages/                экраны PageNamePage/; подкомпоненты в _internal/
  routes/
    AppRouter.tsx       дерево роутов целиком + инстанс роутера
    _paths.ts           routerPaths: пути одним объектом
    _routes.tsx         commonRoutes / protectedRoutes рядом с единственным потребителем
    layouts/AppLayout/  обёртка залогиненной части: колонка 600px, safe-area, таб-бар
  constants/            значения, общие для нескольких модулей (сроки кэширования)
  context/              I18nContext и useI18nSelector
  hooks/                общие хуки, в т.ч. useForm
  utils/                хелперы: форматирование, нормализация строк, сжатие фото
  theme/                тема styled-components + провайдер темы Mantine
  app/                  провайдеры, queryClient, точка входа
public/
  dictionaries/ru.json  единственный словарь; входит в precache service worker'а
wrangler.jsonc          конфиг Workers; SPA-fallback задан not_found_handling
```

Три вещи, в которых легко ошибиться:

- **Типы сущностей — в `src/types/`, по файлу на домен**, а не в `src/domain/`. Группируем по домену, к которому относится понятие, а не по происхождению: признак «пришло из API» у типа не держится, домен держится. В `domain/nutrition/` остаются только внутренние типы модуля расчёта (`INutrients`, `IRecipeNutrition`, `INutritionSnapshot`): за его пределами они почти не нужны.
- **Роут не содержит вёрстки.** `src/routes/` — пути, типизированные params/search, загрузка, guard и рендер страницы. Экран целиком живёт в `src/pages/`. Layout залогиненной части лежит в `src/routes/layouts/`, а не в `src/components/`: это часть роутинга, а не переиспользуемый компонент.
- **Подкомпоненты страницы — в `_internal/`**, вложенные части компонента — в `_internal/`. Это два разных уровня, как в Carbon-spa.

## Фазы реализации

Порядок соответствует требованию ТЗ идти слоями с рабочим состоянием после каждого. Бюджет: создание файла = 1, правка = 1–2.

### Кто что выполняет

Всё, что касается базы данных и границы с ней, **делает владелец проекта вручную** — это осознанное решение, а не недоработка плана. Полный список таких работ, порядок и статусы — `backend-track.md`.

| Фаза | Исполняет | Ждёт |
|---|---|---|
| 1 — База данных | 🔒 **владелец** | — |
| 2 — Каркас приложения | агент | `B4` (ключи для `.env`) |
| 3 — Auth и навигация | агент | `B1` (аккаунты) |
| 3.5 — Приведение каркаса в порядок | агент | Фазу 3 |
| 4 — Модуль расчёта КБЖУ | агент | ничего, можно параллельно с любой фазой |
| 5 — Слой данных | 🔒 репозитории — владелец, хуки Query — агент | `B4` |
| 6–12 | агент | `B6` (репозитории) |
| 13 — Этикетка по фото | 🔒 Edge Function — владелец, UI — агент | `B8` |

**Словарь.** Каждая фаза с видимым интерфейсом (6–13) дополнительно правит `public/dictionaries/ru.json` — ни одной строки текста в JSX. В списках файлов по фазам это отдельно не повторяется.

**Правило для исполнителя.** Не создавать и не редактировать `supabase/**`, `.env`, `src/types/database.types.ts`, `src/api/repositories/**`. Понадобилось изменение схемы — **остановиться и сообщить**, не обходить и не подставлять заглушку. Порядок действий владельца в таком случае — `backend-track.md`, шаг `B7`.

### Фаза 1 — База данных 🔒 владелец

**Выполняет владелец вручную.** Исполнителю эту фазу не брать. Пошаговый разбор — `phase-1-tutorial.md`, чек-лист — `backend-track.md`, шаги `B1`–`B4`.

**Цель.** Схема, RLS, бакет, стартовые данные, сгенерированные TS-типы.

**Бюджет.** Операций: 5. Категории: `db`, `config`.

**Файлы**

- `supabase/migrations/<timestamp>_init.sql` — вся схема выше + триггер `touch_updated_at` + RLS-политики + бакет `recipe-photos`
- `supabase/migrations/<timestamp>_reference_data.sql` — категории и ~60 продуктов (миграцией, не seed-файлом — см. «Стартовые данные»)

Имена файлов генерирует `supabase migration new <имя>`, префикс — дата-время создания; он же задаёт порядок применения. Руками файлы миграций не создавать.

Разбор этой фазы с объяснением каждой конструкции — `phase-1-tutorial.md` (писался для прохождения вручную, но как справка по «почему схема такая» годится и исполнителю).
- `supabase/config.toml` — локальная конфигурация CLI
- `src/types/database.types.ts` — генерация через `supabase gen types typescript`
- `package.json` — **создаётся здесь**, минимальный: `supabase` в `devDependencies` + скрипты `db:reset`, `db:types`. Фаза 2 добавляет Vite и остальное в **этот** файл, а не скаффолдит проект с нуля поверх него

**Настройка проекта в дашборде** (разово, до миграции)

- Регион **Singapore (`ap-southeast-1`)** — после создания не меняется, только пересозданием проекта.
- Authentication → Users → завести два аккаунта вручную, с авто-подтверждением почты.
- Authentication → Providers → Email → **выключить регистрацию новых пользователей**. Критично: RLS-политики дают доступ роли `authenticated` целиком, без разбора по владельцу, поэтому при открытой регистрации любой, кто узнал URL проекта, регистрируется и получает всю базу.

**Проверка.** `supabase db reset` проходит без ошибок; в таблицах ожидаемое число строк; у каждого продукта проставлен `active_variant_id`; попытка назначить активным вариант чужого продукта падает на констрейнте; запрос из-под анонимного ключа без авторизации возвращает пусто (RLS работает); попытка зарегистрировать нового пользователя через `signUp` отклоняется.

### Фаза 2 — Каркас приложения

**Цель.** Проект собирается и запускается, провайдеры на месте, PWA устанавливается.

**Бюджет.** Операций: 12. Категории: `config`, `ui`.

**Файлы**

- инициализация Vite + React + TS strict. `package.json` в Фазе 1 создан не был, поэтому скаффолдить можно свободно — но **дополнительно** добавить в него `supabase` в `devDependencies` и скрипты `db:reset` / `db:types` (см. «Дополнения»)
- `vite.config.ts` с алиасом `@/` и `vite-plugin-pwa`
- `src/app/providers.tsx` — QueryClient + persister в IndexedDB, MantineProvider, ThemeProvider styled-components
- `src/theme/` — палитра, типографика, брейкпоинты; одни и те же CSS-переменные скармливаются обеим системам стилей
- `src/api/supabase.ts` — клиент
- `src/utils/env.ts` — типизированный доступ к `import.meta.env`
- `public/manifest` + иконки, `.env.example`, `README.md`
- `public/_redirects` — строка `/*    /index.html   200`. Без неё Cloudflare Pages отдаёт 404 при прямом заходе на вложенный роут (`DEPLOY.md`)
- **ESLint + Prettier** — команды `pnpm lint` и `pnpm prettier` объявлены в `.github/pipeline-profile.md`, значит должны существовать. `eqeqeq: always` обязателен: конвенции запрещают `==` / `!=`, включая сравнение с `null`
- **Зависимости, которые ставит эта фаза** (список закрытый, ставить что-то сверх него — остановиться и спросить): `react`, `react-dom`, `@supabase/supabase-js`, `@tanstack/react-query`, `@tanstack/react-query-persist-client`, `@tanstack/query-async-storage-persister`, `idb-keyval`, `@mantine/core`, `@mantine/hooks`, `styled-components`; в `devDependencies` — `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `vite-plugin-pwa`, `eslint` с плагинами, `prettier`, `supabase`, `@types/*`
- **`src/utils/env.ts` — контракт чтения переменных.** `import.meta.env` Vite заменяет статическим объектом на этапе сборки, и ключ, которого не было в `.env`, в этом объекте **отсутствует**, а не равен пустой строке. Значит проверять надо и тип, и длину: `typeof value !== "string" || value.length === 0`. Проверка только на `value.length` падает с сырым `TypeError` вместо внятного сообщения — ровно в том случае, ради которого функция и написана: переменную забыли задать в настройках Cloudflare Pages
- **i18n-инфраструктура**: `public/dictionaries/ru.json`, `src/types/i18n.types.ts` (экспортирует только интерфейс `I18n`), `src/context/I18nContext` с `useI18nSelector`. Язык один, но тексты с самого начала живут в словаре — вытаскивать их из готового JSX потом дороже (`decisions.md §1`). Реализацию контекста и селектора можно перенести из `Carbon-spa`

**Экспорт без потребителя — названное исключение.** `src/api/supabase.ts` экспортирует клиент, у которого в этой фазе потребителей нет: первый появляется в Фазе 3 (`useAuth` обращается к `supabase.auth`), остальные — в Фазе 5. То же касается `queryClient` и темы. Это не спекулятивный экспорт, а инфраструктура, которую фаза-каркас обязана поставить по своему определению: ни одна сессия Фаз 2–4 не может дать потребителя в той же фазе. Правило `Export discipline` здесь не нарушено — исключение названо здесь, с указанием фазы-потребителя, и ревьюер проверяет обоснование, а не считает импортёров.

**Проверка.** `pnpm build` и `pnpm lint` чистые; приложение открывается; Lighthouse видит установочный манифест; на телефоне ставится на домашний экран и открывается в standalone; `useI18nSelector` отдаёт значение из `ru.json`, ни одной видимой строки в JSX не осталось.

**Про проверку `readEnvVar` отдельно.** Сквозной проверки «приложение не стартует без переменной» в этой фазе **не существует**: `src/utils/env.ts` импортируется только из `src/api/supabase.ts`, а у того в Фазе 2 импортёров нет вообще — ветка недостижима из `main.tsx`. Убрать переменную и открыть приложение — ничего не произойдёт, потому что бросающий код не выполняется.

Поэтому в этой фазе контракт проверяется **юнит-тестом** (`vitest` уже в зависимостях), три случая:

- ключа нет в `import.meta.env` → ошибка «Переменная окружения … не задана», **не** `TypeError`;
- ключ есть, значение пустая строка → та же ошибка;
- ключ есть со значением → возвращается значение.

Достаточно `vi.stubEnv` — поднимать SSR-сборку или отдельный харнесс не надо. Сквозная проверка перенесена в Фазу 3, где `useAuth` наконец импортирует клиент и ветка становится живой.

### Фаза 3 — Авторизация и навигация

**Цель.** Логин работает, четыре вкладки переключаются, незалогиненного редиректит.

**Бюджет.** Операций: 10. Категории: `routing`, `ui`.

**Файлы**

- `src/routes/` — файловые роуты (⚠️ **переделаны в Фазе 3.5 на code-based** — при чтении задним числом ориентироваться на неё)
- `src/components/AppLayout/` — контейнер `max-width: 600px` по центру, safe-area insets, `100dvh` (⚠️ **переехал в `src/routes/layouts/` в Фазе 3.5**)
- `src/components/TabBar/` — нижний таб-бар
- `src/pages/LoginPage/`
- `src/hooks/useAuth.hook.ts` — сессия Supabase, guard в `beforeLoad` корневого роута

**Проверка.** Приложение с убранной `VITE_SUPABASE_URL` не стартует и показывает «Переменная окружения … не задана» — здесь ветка наконец живая, `useAuth` импортирует клиент, а тот `env` (в Фазе 2 эта проверка была недостижима); без сессии любой роут ведёт на `/login`; после входа возврат на запрошенный роут; сессия переживает перезагрузку; таб-бар не перекрывается клавиатурой и системной полосой жестов на iOS.

### Фаза 3.5 — Приведение каркаса в порядок

**Цель.** Роутинг собран в одном месте и читается без знания соглашений библиотеки; типографика существует как компоненты, а не изобретается на каждом экране.

**Почему отдельной фазой.** Обе вещи должны встать **до Фазы 6**: с неё начинается вёрстка экранов, и каждый следующий экран будет либо переиспользовать типографику, либо плодить свою. Роутинг после Фазы 6 трогать дороже — на нём уже будут висеть экраны.

**Бюджет.** Операций: 13. Категории: `routing`, `ui`.

#### Роутинг: перевод на code-based

TanStack Router остаётся, меняется только режим. Типизация params и search сохраняется полностью — она идёт от определений роутов, а не от файловых соглашений.

**Что уходит:** `src/routeTree.gen.ts`, `src/routes/__root.tsx`, все файлы-роуты (`index.tsx`, `login.tsx`, `products.tsx`, `log.tsx`, `settings.tsx`), плагин `tanstackRouter` из `vite.config.ts`, `src/app/router.ts`.

**Что появляется:**

- `src/routes/_paths.ts` — объект `routerPaths` со всеми путями. Никаких строковых литералов путей в компонентах.
- `src/routes/_routes.tsx` — `commonRoutes` (логин) и `protectedRoutes` (остальное). Лежат рядом с единственным потребителем, а не в общих константах.
- `src/routes/AppRouter.tsx` — корневой роут, layout-роут защищённой части, сборка дерева, `createRouter`, декларация `Register` для типизации.
- `src/routes/layouts/AppLayout/` — переезжает из `src/components/AppLayout/`. Это часть роутинга, а не переиспользуемый компонент.

**Guard — через `beforeLoad` на layout-роуте защищённой части, а не компонентом `<ProtectedRoute>`.** Это осознанное отличие от Carbon-spa: там React Router и guard-компонент, здесь `beforeLoad` отрабатывает **до** рендера, поэтому нет вспышки защищённого экрана перед редиректом. Компонентная форма тут боролась бы с библиотекой.

Внутри `beforeLoad`: нет сессии — `redirect` на логин с сохранением `location.href` в search; на логине с сессией — `redirect` на главную. Ветвление по `pathname` в корневом роуте исчезает: логин лежит вне защищённого layout-роута.

**Разделение кода** в code-based режиме не автоматическое. В этой фазе его **не делаем** — приложение целиком весит немного, а `route.lazy()` добавит шума раньше, чем принесёт пользу. Вернуться к этому, если бандл начнёт мешать.

#### Типографика

`src/components/Typography/` по образцу `Carbon-spa/src/uikit/Typography`, но без сторибука:

- `_BaseText.ts` — общая основа со стилями из `theme`
- `Head/` — `H1`, `H2`, `H3`
- `Body/` — `B1`, `B2`, `B3`
- `Caption/` — `Caption1`, `Caption2`
- `Numbers/` — крупные цифры для блока КБЖУ

Пропсы как в Carbon-spa: `color` — ключ палитры `theme.palette.text`, `textAlign`. Значения размеров и начертаний берутся из уже существующего `src/theme/_typography.ts`, новых токенов не заводить.

**После этой фазы ни один экран не задаёт размер шрифта напрямую** — только через эти компоненты. Правило уходит в конвенции.

#### Мелкие правки оттуда же

- `getAuthSession()` — при ошибке от `getSession()` писать `console.warn` перед тем, как вернуть «нет сессии». Сейчас истёкший refresh-токен и обрыв сети выглядят одинаково и молча.
- `package.json` — скрипт `format` со скоупом (`prettier --write src`), профиль ссылается на скрипт, а не на голый бинарь. Сейчас команда форматирует весь репозиторий, на Фазе 2 об это спотыкались дважды.

**Файлы**

- удалить: `src/routeTree.gen.ts`, `src/routes/{__root,index,login,products,log,settings}.tsx`, `src/app/router.ts`
- создать: `src/routes/{_paths.ts,_routes.tsx,AppRouter.tsx}`, `src/routes/layouts/AppLayout/*`, `src/components/Typography/*`
- изменить: `vite.config.ts` (убрать плагин роутера), `src/main.tsx`, `src/hooks/useAuth.hook.ts`, `package.json`, `.github/pipeline-profile.md`
- изменить под типографику: `src/pages/LoginPage/**`, `src/components/RouteStub/**`, `src/components/TabBar/**` — всё, что сейчас задаёт `font-size` литералом, переводится на компоненты `Typography`. Это ровно те файлы, по которым проходит проверка «в `src/pages/**` и `src/components/**` не осталось объявлений `font-size`»
- удалить каталог `src/components/AppLayout/` после переезда

**Проверка**

- `pnpm lint`, `pnpm build`, `pnpm test` чистые; `routeTree.gen.ts` отсутствует, плагин из `vite.config.ts` убран.
- Незалогиненный на любом защищённом пути редиректится на `/login`, **без вспышки** защищённого экрана.
- Залогиненный на `/login` редиректится на главную.
- После входа возвращает на запрошенный путь (`redirect` в search).
- Четыре вкладки переключаются, таб-бар не показывается на логине.
- Прямой заход по адресу на каждый из пяти путей работает.
- Типографика: в `src/pages/**` и `src/components/**` не осталось объявлений `font-size` вне `src/components/Typography/` и `src/theme/`. **Единственное исключение — `font-size: 16px` на полях ввода:** ниже этого порога Safari на iOS зумит страницу при фокусе. Это ограничение платформы, а не размер из шкалы; строка остаётся с комментарием, объясняющим причину.
- `pnpm format` затрагивает только `src`.

**Visual Verification.** N/A — поведение проверяется списком выше вручную, отдельного визуального прохода в проекте нет.

### Фаза 4 — Модуль расчёта КБЖУ

**Цель.** Вся арифметика написана и покрыта тестами до появления UI.

**Бюджет.** Операций: 6. Категории: `domain`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `zod`. Больше ничего — модуль расчёта чистый.
- `src/domain/nutrition/{_types.ts,_resolve.ts,_calculate.ts,_snapshot.ts,index.ts}`
- `src/domain/nutrition/__tests__/calculate.test.ts`
- `src/domain/schemas/` — zod-схемы всех сущностей

**Проверка.** Тесты покрывают все девять правил из раздела «Модуль расчёта», включая: опциональный ингредиент исключён и из КБЖУ, и из веса сырья; при заданном `yield_grams` делитель — он, при отсутствии — вес сырья и `basis === "rawWeight"`; продукт без КБЖУ даёт вклад 0 и попадает в `incompleteProducts`; частичный override переопределяет только своё поле и отражается в `overriddenFields`; пустой список ингредиентов не роняет функцию делением на ноль. В модуле нет ни одного импорта из React, Supabase или Mantine.

### Фаза 5 — Слой данных 🔒 владелец целиком

**Выполняется владельцем полностью** (решение от 2026-09-08, `decisions.md §7.6`): и сервисы, и хуки TanStack Query. Исполнителю здесь делать нечего — фаза не запускается через пайплайн, она идёт шагом `B6` бэкенд-трека.

**Цель.** Весь датасет загружается одним заходом, кэшируется, переживает офлайн, инвалидируется при мутациях.

**Бюджет.** Операций: 8 (из них 4 на владельце). Категории: `services`, `state`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `@mantine/notifications` (тосты об ошибках мутаций). Больше ничего.
- 🔒 `src/types/{products,recipes,cookLogs}.types.ts` — интерфейсы сущностей — **владелец**, часть `B6`
- 🔒 `src/api/services/{products,recipes,cookLogs,categories}.service.ts` — **владелец**
- 🔒 `src/api/queries/` — ключи запросов и хуки `useProductsQuery`, `useRecipesQuery`, `useCookLogsQuery` — **владелец**
- 🔒 `src/api/mutations/` — базовый хук мутации с инвалидацией и тостом об ошибке — **владелец**
- `src/hooks/useAppData.hook.ts` — селекторы поверх загруженного датасета (продукты по id, рецепты по категориям, использование продукта)

**Проверка.** На старте ровно пять запросов (два справочника, продукты, рецепты, журнал), дальше сеть молчит при навигации; выключенная сеть при повторном открытии показывает данные из persisted-кэша; мутация обновляет все зависимые экраны без ручного refetch.

### Фаза 6 — Справочник продуктов

**Цель.** Первое видимое рабочее состояние: справочник живой и редактируемый. Продуктов на старте **нет** (предзаполнения не делаем), поэтому пустое состояние — не краевой случай, а то, что владелец увидит первым.

**Бюджет.** Операций: 12. Категории: `ui`, `services`.

**Файлы**

- `src/pages/ProductsPage/` — список по категориям, поиск
- `src/pages/ProductPage/` — карточка продукта, `_internal/{VariantList,UsedInRecipes}`
- `src/components/NutrientsRow/` — переиспользуемый блок «ккал / Б / Ж / У»
- `src/pages/ProductPage/_internal/ArchiveConfirm`

**Проверка.** Переключение активного варианта в один тап и оно сохраняется; продукт с одним вариантом не показывает вложенности; усреднённые варианты помечены; список «где используется» пуст (рецептов ещё нет) и не падает; архивированный продукт пропадает из списка.

### Фаза 7 — Выбор и инлайн-создание продукта

**Цель.** Готовый переиспользуемый узел, на котором держится редактор рецепта.

**Бюджет.** Операций: 7. Категории: `ui`.

**Файлы**

- `src/components/ProductPicker/` — Combobox Mantine поверх датасета в памяти, нормализация `ё`/`е`, пункт «Создать „{запрос}“»
- `src/components/ProductFormSheet/` — bottom sheet создания продукта
- `src/components/VariantFormSheet/` — bottom sheet создания варианта
- `src/api/services/products.service.ts` + `src/api/mutations/products.mutations.ts` — **только** однотабличная мутация «добавить вариант к существующему продукту», по образцу `archiveProduct`. Разрешено правилом об однотабличных мутациях

**Данные — что уже готово и что нельзя трогать.**

- **Создание продукта** — готовая мутация владельца `useCreateProductWithVariantMutation` (`src/api/mutations/products.mutations.ts`). Одним вызовом создаёт продукт и его первый вариант в одной транзакции (функция в базе через `rpc`). Вход — `{ product: IProductInput; variant: IProductVariantInput }`, формы ровно те, что выдают `productInputSchema` и `productVariantInputSchema` после валидации: пустые поля — `null`, переводить их никуда не надо. Результат — **id нового продукта**: по нему пикер возвращает созданный продукт выбранным. Сервис и функцию в базе не менять.
- Поле `source` у `productVariantInputSchema` при создании из формы — `"manual"`; функция в базе всё равно подставляет его сама.
- Название варианта и все четыре числа КБЖУ необязательны — продукт с пустым вариантом валиден и попадает в «неполное КБЖУ».

**Проверка.** Поиск мгновенный, без обращений к сети; создание продукта из пикера возвращает его выбранным и не размонтирует родительский экран; поле КБЖУ можно оставить пустым и продукт создастся; лист корректно открывается поверх другого листа и закрывается по свайпу вниз.

### Фаза 7.5 — Общий `useForm` и примитивы форм

**Цель.** Закрыть `FORM-1`: обещанный конвенциями `useForm` существует, три написанные формы переведены на него, а выбор из списка стал общим компонентом. Делается **до Фазы 8**: редактор рецепта — самая большая форма проекта, и написанный в старом стиле он закрепит россыпь `useState` навсегда.

**Бюджет.** Операций: 9. Категории: `state`, `ui`. Новых зависимостей фаза не ставит.

**Файлы**

- `src/hooks/useForm/{_useForm.hook.ts,_types.ts,_helpers.ts,index.ts}` — перенос хука из `Carbon-spa`
- `src/hooks/useLatest.hook.ts`, `src/utils/helpers/objectGetters.ts`, `src/types/common.types.ts` — зависимости хука, которых в проекте пока нет
- `src/pages/LoginPage/_useLoginForm.ts` — перевести на `useForm`
- `src/components/ProductFormSheet/{_useProductForm.ts,_types.ts}` — перевести на `useForm`
- `src/components/VariantFormSheet/{_useVariantForm.ts,_types.ts}` — перевести на `useForm`
- `src/components/Select/` — общий выпадающий список: нативный `<select>` со стилями проекта, перенести из `ProductFormSheet/_styles.ts`
- `src/components/ProductFormSheet/{_ProductFormSheet.tsx,_styles.ts}` — использовать общий `Select`
- `src/pages/ProductPage/_internal/ArchiveConfirm/_styles.ts` — перевести на общий `SBottomSheetDrawer`, убрать третью копию того же переопределения высоты

**Контракт `useForm`.** Хук **переносится из `Carbon-spa`** (`src/utils/hooks/useForm/`) целиком, а не проектируется заново: владелец хочет тот же привычный API и возможность унести его в следующий проект. Переносится всё, включая `isDirty`, пер-полевые ошибки, `required`, `validator`, `formatter` и автосохранение по таймеру.

Что приезжает вместе с хуком:

- `form` — состояние по полям: `value`, `prevValue`, `error`, `required`, `isDirty`, `validator`, `formatter`;
- `onChange` для полей с `name`, `updateFieldValue` для всего остального, `updateFieldError` — для ошибки, пришедшей с сервера;
- `disabled: !isValid || !isDirty` — кнопка отправки неактивна, пока форма невалидна или ничего не менялось;
- `isPending`, `onSubmit` с `preventDefault` и сбросом `prevValue` после успеха;
- `saveOnChange` — автосохранение с задержкой 500 мс. **Пригодится в Фазе 8**: черновик рецепта там как раз сохраняется с debounce 500 мс.

**Что нужно адаптировать при переносе** — перечислено, чтобы исполнитель не решал это сам:

1. **`TFieldType` расширить числом, и вместе с ним переписать проверку `required`.** В оригинале тип `string | boolean | null`, а у нас числовые поля КБЖУ. Проверка `required` в `isValid` сейчас опирается на `value.length === 0`: у числа `.length` нет, и обязательное числовое поле никогда не считалось бы пустым. Там же `required`-поле со значением `null` проходит как заполненное — условие `value !== null` исключает его из проверки. Правило после переноса: обязательное поле пусто, если оно `null` или пустая строка. `formatter` и `validator` остаются строковыми — `formatValue` и `validateValue` уже пропускают нестроковые значения нетронутыми.
2. **Перенести зависимости, которых здесь нет:** `useLatest` (в `src/hooks/`), типизированный `getEntries` (в `src/utils/helpers/`), `TSetState` (в `src/types/common.types.ts` — файл значится в структуре проекта и до сих пор не создан).
3. **`NodeJS.Timeout` → `ReturnType<typeof setTimeout>`** — код исполняется в браузере.
4. **`onChange` принимает не только `HTMLInputElement`** — у нас есть `<select>` и `textarea`.
5. **Раскладка по конвенциям этого проекта:** папка `src/hooks/useForm/` с `_useForm.hook.ts`, `_types.ts`, `_helpers.ts`, `index.ts`. Имена типов по правилу «`I` для интерфейсов, `T` для алиасов» — в оригинале `IUseFormReturn` объявлен через `type`.
6. **Добавить `resetOn`** — единственное настоящее дополнение к оригиналу. Значение, при смене которого форма возвращается к начальной: для листа это `isOpened`, для редактора рецепта в Фазе 8 — `recipeId`. Сравнение во время рендера, как сейчас скопировано в обоих листах; после фазы приём существует в одном месте. Это [рекомендация React](https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes) для подстройки состояния под смену пропа: React перезапускает только этот компонент, до коммита и до рендера детей, тогда как `useLayoutEffect` сделал бы лишний коммит и на кадр показал детям прошлые значения.
7. **Ожидаемые правки под линтер:** `!!fieldsChanged` и `!!submitHandler` избыточны, массивы зависимостей у `useCallback` могут не пройти `react-hooks`. Поведение при этом менять нельзя.
8. **Неудачная отправка не должна запирать форму.** В оригинале `onSubmit` делает `await submitHandler(...)` без `try/finally`, а потом безусловно `updatePrevValues()`. Отсюда два исхода, и оба плохие: если обработчик бросил — `isPending` навсегда `true`, а отклонение промиса остаётся необработанным; если обработчик сам поймал ошибку (так делают все три потребителя в `Carbon-spa`) — `prevValue` сбрасывается к текущим значениям, `isDirty` становится `false`, и **повторить отправку нельзя, пока не изменишь какое-нибудь поле**. При нестабильной связи повтор — обычный сценарий, а не краевой. Правка: обработчик на неудаче бросает (`mutateAsync` так и делает), хук ловит, `prevValue` обновляет **только при успехе**, `isPending` сбрасывает в `finally`, наружу не пробрасывает — сообщение об ошибке уже показывает общий `MutationCache`. Совместимо с оригинальными потребителями: кто ловит ошибку сам и возвращается нормально, для хука по-прежнему «успех».
9. **Ленивая инициализация:** `useState(() => initState(inputs))` вместо `useState(initState(inputs))` — сейчас `initState` пересчитывается на каждом рендере и выбрасывается. Поведение не меняется.

**Что в оригинале странно, но не меняется** — поведение остаётся прежним, но каждое место помечается комментарием `// FIXME:` прямо в коде хука, чтобы известное ограничение было видно при чтении, а не только в плане. Комментарий по конвенции описывает то, что код **делает**, и условие, при котором это станет проблемой; без ссылок на фазы, план и эту задачу. Исполнитель не «улучшает» эти места по своей инициативе:

- у поля свой `isDirty`, а общий `isDirty` считается иначе — сравнением `value` с `prevValue`; `updateFieldError` сбрасывает полевой, но не общий;
- `validator` получает значение до `formatter`, а в состояние записывается после;
- нетронутую форму отправить нельзя: `onSubmit` выходит, если `!isDirty`;
- при `saveOnChange` правки, сделанные, пока идёт сохранение, после него помечаются сохранёнными. Для Фазы 8 это неважно — черновик пишется в localStorage синхронно, — но важно, если когда-нибудь автосохранять в сеть.

Каждое из них — повод для правки, когда появится вызов, которому оно мешает. Проверка фазы: четыре комментария `FIXME` на месте, поведение этих мест не изменено.

**Как уживаются два уровня валидации.** Пер-полевой `validator` из хука — для дешёвых проверок на лету (обязательность, формат). Схемы zod остаются там, где они есть сейчас: в `submitHandler`, перед вызовом мутации. `ProductFormSheet` собирает из своих полей две схемы сразу — продукта и варианта, — и в хук это не переносится.

**`touched` не переносится, потому что его в оригинале нет.** Термин я употребил зря: `touched` — это из `react-hook-form` и `formik`, признак «пользователь трогал поле и ушёл с него», нужный, чтобы не показывать ошибку, пока человек ещё печатает первый символ. В хуке из `Carbon-spa` этого нет: ошибка считается сразу в `onChange` через `validator` поля. Заводить его сейчас — менять поведение, а не переносить.

**Проверка.** API хука совпадает с оригиналом из `Carbon-spa` — отличия только те, что перечислены в списке адаптаций. Поведение трёх форм не изменилось: вход работает, продукт создаётся с пустым КБЖУ и возвращается выбранным, вариант добавляется. Ни один хук формы не содержит собственного сравнения для сброса — оно только в `useForm`. `grep` по `styled.select` и по переопределению высоты `Drawer` даёт по одному совпадению на проект. `pnpm lint`, `pnpm build`, `pnpm test` чистые.

### Фаза 8 — Редактор рецепта

**Цель.** Экран, ради которого всё затевалось.

**Бюджет.** Операций: 14. Категории: `ui`, `state`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (последний нужен для `CSS.Transform` в перетаскиваемой строке), `browser-image-compression`.
- `src/pages/RecipeEditorPage/` + `_internal/{IngredientRow,IngredientList,StepList,StorageFields,VideoLinks,NutritionBar,PhotoField}`
- `src/hooks/useRecipeDraft.hook.ts` — автосохранение в localStorage
- `src/utils/image.ts` — сжатие перед загрузкой
- маршруты `/recipes/new` и `/recipes/$recipeId/edit` — добавить в `src/routes/_routes.tsx` и `_paths.ts`, отдельных файлов на роут нет
- `supabase/migrations/<timestamp>_save_recipe.sql` — функция `save_recipe`: создание и редактирование рецепта целиком одной транзакцией. В рабочем дереве лежит черновик владельца `20261003152020_save_recipe.sql` — его можно переписывать полностью; файл в облако не выкатывался
- `src/types/database.types.ts` — перегенерировать через `pnpm db:types` после применения миграции к локальной базе
- `src/types/recipes.types.ts` — `IRecipeInput` и вложенные типы шага и ингредиента
- `src/domain/schemas/_recipes.ts` — `satisfies z.ZodType<IRecipeInput>` на `recipeInputSchema`; `sortOrder` во вложенных схемах — см. ниже
- `src/api/services/recipes.service.ts` + `src/api/mutations/recipes.mutations.ts` — `saveRecipe` через `rpc` и `useSaveRecipeMutation` с инвалидацией ключа рецептов; `uploadRecipePhoto` в Storage

**Данные — как устроено сохранение.** Разбор с причинами — `owner-tasks-guide.md`, раздел «Мутации владельца для Фаз 7 и 8» → «Функция в базе», «Сохранить рецепт целиком», «Решения перед началом», «Загрузить фото». Коротко:

- **Одна функция на создание и редактирование:** `p_recipe_id uuid default null`; нет id — `insert` рецепта, есть — `update`. Дальше общий путь: удалить ингредиенты, шаги и связи категорий рецепта и вставить новый набор. Возвращает id рецепта. Права на `DELETE` у дочерних таблиц выданы, у самих рецептов — нет.
- **Скалярные поля — параметрами, массивы — тремя параметрами `jsonb`**, разбор через `jsonb_array_elements(...) with ordinality`.
- **`sort_order` берётся из порядка в массиве**, а не из поля: после перетаскивания клиенту не нужно перенумеровывать. Поле `sortOrder` из `recipeStepInputSchema` и `recipeIngredientInputSchema` убрать — два источника одного значения разойдутся.
- **Ограничения базы**, которые схема zod должна ловить раньше функции: `amount_grams > 0`, `servings_base > 0`, сроки хранения `>= 0`, закреплённый вариант принадлежит продукту ингредиента (составной ключ).
- **Фото** грузится в бакет `recipe-photos` **до** сохранения рецепта; в `recipes.photo_path` пишется путь внутри бакета, URL собирается через `getPublicUrl`. Отказ сохранения после загрузки оставляет файл-сироту — это безвредно; обратный порядок дал бы рецепт со ссылкой на несуществующий файл. Сжатие — `src/utils/image.ts` до загрузки.
- **Миграция применяется только к локальной базе** (`npx supabase migration up`). В облако её выкатывает владелец — в отчёте фазы прямо сказать, что `db push` нужен.

**Проверка.** Выключенная сеть в момент сохранения (DevTools → Offline) оставляет в локальной базе либо прежний рецепт целиком, либо новый целиком, без смеси. Рецепт из десяти ингредиентов и восьми шагов заводится без выхода с экрана; КБЖУ в липкой плашке обновляется по мере ввода; закрытие вкладки и повторное открытие предлагает восстановить черновик; перетаскивание работает и мышью, и пальцем, включая шаги разной высоты; фото с телефона грузится и сжимается; сохранение пишет корректные `sort_order`.

### Фаза 8.5 — Доводка редактора и общие поля ввода

**Цель.** Закрыть замечания ревью Фазы 8, которые владелец решил чинить сразу, и убрать пять копий одного поля ввода.

**Бюджет.** Операций: 8. Категории: `ui`, `state`. Новых зависимостей и миграций фаза не ставит.

**Файлы**

- `src/components/TextInput/`, `src/components/TextArea/` — общие поля, по образцу `src/components/Select/` (`_styles.ts` + `index.ts`, экспорт styled-компонента с префиксом `S`)
- `_styles.ts` и использующие `.tsx` в `src/components/ProductFormSheet/`, `src/components/VariantFormSheet/`, `src/pages/LoginPage/`, `src/pages/ProductsPage/`, `src/pages/RecipeEditorPage/` — перевести на общие поля
- `src/domain/schemas/_recipes.ts` + `public/dictionaries/ru.json` — ссылки на видео только http(s)
- `src/pages/RecipeEditorPage/` — `createId`, тест сравнения черновиков, Enter в однострочных полях
- `src/hooks/useRecipeDraft.hook.ts` + `src/pages/RecipeEditorPage/_useRecipeSave.ts` — черновик не пишется после успешного сохранения

**1. Общие `STextInput` и `STextArea`.** Сейчас один и тот же `styled.input` (44px, рамка, `font-size: 16px` с комментарием про зум Safari, фокус-обводка) скопирован пять раз: `SInput` в `ProductFormSheet`, `VariantFormSheet`, `LoginPage`, `RecipeEditorPage` и `SSearch` в `ProductsPage`. `STextarea` редактора — его многострочный вариант. Потребители в разных фичах, значит по лестнице размещения это `src/components/`. Комментарий про 16px переезжает вместе со стилем и остаётся в одном месте. Локальные отличия, если где-то они есть, расширяют общий компонент через `styled(STextInput)` у потребителя, а не возвращают копию. `SSelect`, чекбоксы и переключатели не трогать: это другие элементы.

**2. Ссылки на видео — только http(s).** `z.url()` принимает всё, что разбирает `new URL()`, включая `javascript:`, `data:` и `file:`. В Фазе 9 ссылки станут `href`. В `recipeInputSchema` заменить на `z.httpUrl()` (есть в установленной версии zod). Текст ошибки `videoUrls` в словаре уточнить: ссылка должна начинаться с `http://` или `https://`. `recipeDraftSchema` не трогать: черновик хранит сырой ввод, проверка — при сохранении. Тест: `javascript:alert(1)`, `data:text/html,x`, `ftp://x.ru` отклоняются, `https://youtu.be/abc` проходит.

**3. `createId` вместо `crypto.randomUUID()`.** `randomUUID` есть только в безопасном контексте (HTTPS или `localhost`). На дев-сервере, открытом с телефона по `http://<IP>`, редактор падает с `TypeError` при монтировании. `crypto.getRandomValues` доступен везде. Функция `createId()`: `randomUUID`, если он есть, иначе UUID v4 из `getRandomValues` (версия и вариант выставлены по RFC 4122). Все три вызова в редакторе переходят на неё. Размещение по лестнице: пока все вызовы внутри `RecipeEditorPage`, функция живёт там. Тест: при отсутствующем `randomUUID` результат проходит `z.uuid()` и два вызова дают разные значения.

**4. Тест `areDraftsEqual`.** На этой функции держится «нетронутая форма не пишет черновик». Файл теста рядом с `_helpers.ts`. Случаи:
- одинаковые черновики с разным порядком ключей, в том числе во вложенных объектах строк, → равны;
- переставлены две строки состава или шагов → не равны;
- `undefined` в поле и отсутствующее поле → равны;
- отличие в одном вложенном поле (граммы ингредиента) → не равны.

**5. Enter в однострочном поле редактора не отправляет форму.** В форме с кнопкой отправки Enter в текстовом поле запускает неявную отправку, а на iPhone это кнопка «Перейти» на клавиатуре. Набрав название и нажав её, человек сохранит недописанный рецепт и выйдет из редактора. Правило: Enter в однострочном поле редактора (`input`, включая числовые поля Mantine) снимает фокус с поля, клавиатура закрывается, отправки нет; у таких полей `enterKeyHint="done"`. `textarea` (шаги, заметки) ведут себя как раньше: Enter — перенос строки. Ловушка: листы создания продукта и варианта рендерятся порталом, но события клавиатуры всплывают по дереву React и дойдут до формы редактора. Обработчик на уровне формы обязан пропускать события, цель которых не лежит внутри формы в DOM (`event.currentTarget.contains(event.target)`), иначе Enter перестанет работать и в этих листах. Формы листов, `LoginPage` и прочие формы не меняются: там отправка по Enter ожидаема.

**6. Черновик не записывается после успешного сохранения.** После сохранения инвалидация приносит обновлённый рецепт, и `initialDraft` пересобирается. Если черновик отличается от нормализованной сервером формы (обрезанные пробелы в названии, отброшенные пустые строки), эффект автосохранения может поставить запись в очередь уже после `clearDraft()`, а размонтирование её допишет. При следующем открытии появится «Есть несохранённый черновик». Воспроизводится не всегда, зависит от порядка рендеров. Правка: у `useRecipeDraft` отдельная операция для успешного сохранения. Она удаляет ключ и переводит хук в состояние, в котором `saveDraft` и запись при уходе со страницы ничего не делают до размонтирования. `clearDraft` для «Начать заново» в `DraftPrompt` остаётся как есть: после него редактирование продолжается, и черновик должен писаться.

**Не трогать в этой фазе:** `FIXME` в `useForm` и `useRecipePhotoUrl` — это Фаза 8.6.

**Проверка.** `grep` по `font-size: 16px` находит только общие поля, `SSelect` и места, где поле не текстовое; `styled.input` с рамкой и 16px больше нигде не объявляется. Вход, создание продукта и варианта, поиск продуктов и редактор выглядят и работают как раньше. Новые тесты из пунктов 2–4 проходят. Ссылка `javascript:alert(1)` в редакторе даёт ошибку под кнопкой сохранения, рецепт не сохраняется. Enter в названии рецепта не сохраняет рецепт; Enter в поле названия в листе создания продукта по-прежнему создаёт продукт. После сохранения правки с пробелом в конце названия повторное открытие редактора не предлагает черновик. `pnpm lint`, `pnpm build`, `pnpm test` чистые.

### Фаза 8.6 — Отправка нетронутой формы и адрес фото в сущности

**Цель.** Два решения владельца по итогам ревью Фазы 8: `useForm` перестаёт молча глотать отправку, а адрес фото рецепта собирается в сервисе. Делается до Фазы 9: карточке и списку нужен готовый адрес фото, форме журнала (Фаза 11) — отправка значений по умолчанию.

**Бюджет.** Операций: 7. Категории: `state`, `data`. Новых зависимостей и миграций фаза не ставит.

**Файлы**

- `src/hooks/useForm/{_types.ts,_helpers.ts,_useForm.hook.ts}` — явный `prevValue` у поля
- `src/components/ProductFormSheet/`, `src/components/VariantFormSheet/`, `src/pages/LoginPage/` — хуки форм и кнопки отправки
- `src/types/recipes.types.ts`, `src/api/services/recipes.service.ts` — `photoUrl` в `IRecipe`
- `src/api/queries/recipes.queries.ts` — удалить `useRecipePhotoUrl`
- `src/pages/RecipeEditorPage/_internal/PhotoField/` — адрес из сущности
- `src/constants/caching.constants.ts` — `CACHE_BUSTER` → `"v3"`

**1. `useForm`: «нетронутая» значит «не отличается от сохранённого».** Защита от отправки неизменённой формы остаётся: в форме правки она нужна. Меняются две вещи.

- **Описание поля в `inputs` принимает необязательный `prevValue`** — значение, которое считается уже сохранённым. Не передан — как сейчас, `prevValue = value`. Форма создания, у которой значение по умолчанию — осмысленный ввод (дата «сегодня» в журнале, название продукта, подставленное из строки поиска пикера), передаёт `prevValue` пустым (`""` или `null` — по типу поля), и форма с первого рендера считается изменённой. Отдельного флага или нового параметра хука нет: вызовы в стиле `Carbon-spa` продолжают работать.
- **Ловушка:** `updatePrevValues` после успешной отправки тоже собирает состояние через `initState`. Там `prevValue` обязан стать текущим `value`, а не остаться явным пустым из `inputs`. Иначе после сохранения форма навсегда останется «изменённой». То же для сброса по `resetOn`: он возвращает к исходным `inputs`, вместе с их явным `prevValue`, и это правильно.
- **Кнопка отправки показывает защиту, а не глотает нажатие.** Сейчас кнопки всех трёх форм привязаны только к `isPending`, и нажатие на активную кнопку нетронутой или невалидной формы молча ничего не делает. Кнопки привязываются к `disabled` из хука (вместе с `isPending`). Проверить начальные значения каждой из трёх форм: где поле заполняется заранее, а форма — создание (`ProductFormSheet` с названием из поиска; `VariantFormSheet` — по факту), передать `prevValue`, иначе кнопка окажется неактивной до первой правки.
- **`FIXME` про нетронутую форму** переписать в обычный комментарий о том, что код делает теперь: отправка заблокирована, пока поля совпадают с `prevValue`; форма создания задаёт `prevValue` явно. Пример «повтор после сбоя сети» из старого комментария неверен — `prevValue` обновляется только при успехе, повтор уже работает. Остальные три `FIXME` хука не трогать.
- **С `saveOnChange`** явный `prevValue` запустит автосохранение сразу после монтирования. Сейчас `saveOnChange` никто не использует; поведение описать в комментарии к `prevValue` в `_types.ts`.
- Редактор рецепта остаётся на своём `handleSubmit`: его проверка охватывает списки, которых в `useForm` нет.

**2. `photoUrl` в `IRecipe`.** Сейчас в рецепте лежит только путь внутри бакета, а адрес из него собирает хук `useRecipePhotoUrl` в `src/api/queries/` — не запрос, а `useMemo` над склейкой строки. Знание «есть бакет, путь надо превратить в адрес» — сервисное, и в Фазах 9 и 10 оно понадобилось бы каждой карточке.

- `mapRecipe` в сервисе добавляет `photoUrl: string | null`, собранный через `getPublicUrl`. `photoPath` остаётся: редактор отправляет его в `save_recipe`.
- **К адресу дописывается версия — `?v=` от `updated_at` рецепта.** Замена обложки пишет файл по тому же пути, а Storage отдаёт его с `cache-control: max-age=3600`: новое фото до часа показывалось бы старым. `updated_at` у рецептов обновляет триггер `trg_recipes_updated`, в том числе в ветке `on conflict … do update` функции `save_recipe` — после сохранения адрес меняется. Колонку добавить в `select` сервиса, если её там нет; наружу `updatedAt` выводить, только если найдётся потребитель.
- `useRecipePhotoUrl` удалить. `getRecipePhotoUrl` остаётся неэкспортированной функцией сервиса, если вне его импортёров не останется.
- `PhotoField` берёт адрес сохранённого фото из рецепта. Выбранный в этой сессии файл по-прежнему показывается через data URL. Восстановленный черновик хранит либо путь фото рецепта, либо `null` (новый файл в черновик не попадает) — значит, адрес рецепта показывается, только когда путь в черновике совпадает с `recipe.photoPath`.
- Форма сущности в кэше изменилась — `CACHE_BUSTER` → `"v3"`.

**Проверка.**
- Лист создания продукта, открытый из пикера с названием из поиска, показывает активную кнопку сразу, а продукт создаётся после выбора категории без правки названия: категория обязательна и по умолчанию пуста.
- Лист правки, если есть, и любая форма без явного `prevValue` до первой правки показывает неактивную кнопку; после успешной отправки кнопка снова неактивна до следующей правки.
- Вход работает.
- `grep useRecipePhotoUrl src` пуст.
- Обложка рецепта видна в редакторе.
- Замена обложки с сохранением и повторное открытие редактора показывают новое фото сразу, а не через час: адрес отличается параметром `v`.
- После смены `CACHE_BUSTER` приложение открывается и загружает данные заново.
- `pnpm lint`, `pnpm build`, `pnpm test` чистые.

### Фаза 9 — Карточка рецепта

**Цель.** Просмотр со всеми состояниями КБЖУ.

**Бюджет.** Операций: 10. Категории: `ui`.

**Файлы**

- `src/pages/RecipePage/` + `_internal/{NutritionBlock,IncompleteWarning,StorageBlock,IngredientsBlock,StepsBlock,VideoBlock,CookStats}`
- крупные цифры КБЖУ — компонентами `Numbers` из `src/components/Typography/`, мелкие подписи — `Caption`. Своих размеров шрифта не заводить (Фаза 3.5)
- маршрут `/recipes/$recipeId` — добавить в `src/routes/_routes.tsx` и `_paths.ts`
- кнопка «Редактировать» в карточке → `/recipes/$recipeId/edit`
- `src/pages/RecipeEditorPage/_useRecipeSave.ts` — после сохранения вести на карточку сохранённого рецепта, а не на `/`; ссылка «назад» в редакторе правки — тоже на карточку

**Проверка.** Порядок блоков совпадает с ТЗ; продукт без КБЖУ даёт предупреждение со ссылкой, а не нули; рецепт без `yield_grams` показывает подсказку про уварку; блок хранения скрыт при `freezable = false`; override помечен и кнопка «пересчитать» его сбрасывает; имя варианта показано только у продуктов с несколькими вариантами; видео открывается во внешнем приложении.

### Фаза 10 — Список рецептов, поиск и фильтры

**Цель.** Главный экран.

**Бюджет.** Операций: 8. Категории: `ui`, `state`.

**Файлы**

- `src/pages/RecipesPage/` + `_internal/{RecipeCard,CategoryGroup,SearchBar,FiltersSheet}`
- FAB «＋» на главном экране → `/recipes/new` (карта экранов). До этой фазы в создание рецепта не ведёт ни одна кнопка
- `src/utils/search.ts` — нормализация и матчинг
- типизированные search-params главного роута — `validateSearch` в его определении в `src/routes/_routes.tsx`

**Проверка.** Запрос «курица» находит рецепт, где есть куриное филе, но нет слова «курица» в названии; `ё`/`е` не ломает поиск; свёрнутость категорий переживает перезагрузку; фильтр «только замораживаемые» и фильтр по времени комбинируются; возврат из карточки сохраняет поиск и фильтры; пустой результат показывает внятную заглушку.

### Фаза 11 — Журнал готовки

**Цель.** Сбор данных под v2 начинается.

**Бюджет.** Операций: 9. Категории: `ui`, `services`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `@mantine/dates` (DatePicker) и `dayjs` — он peer-зависимость `@mantine/dates`, без него компонент не заведётся.
- `src/components/CookLogSheet/` — быстрое добавление
- `src/pages/RecipePage/` — кнопка «Записать готовку» под блоком статистики, открывает `CookLogSheet` для этого рецепта. Текст кнопки без рода: приложением пользуются двое
- `src/pages/LogPage/` + `_internal/{LogEntry,MonthGroup}`
- `src/domain/stats/` — агрегаты по рецепту (сколько раз, когда последний, средний выход, среднее число дней)

**Проверка.** Запись создаётся в два тапа с дефолтами; в `snapshot` лежит валидный по zod `INutritionSnapshot`; смена активного варианта продукта **не** меняет цифры в уже существующей записи, но **меняет** текущее КБЖУ рецепта; «доели» проставляет дату; статистика в карточке рецепта считается корректно и не падает при единственной записи и при нулевых значениях.

### Фаза 11.5 — Общие кнопки и формы листов, обновление Mantine

**Цель.** Убрать копии стилей кнопок и разметки форм в листах до того, как Фаза 12 добавит ещё несколько, и выровнять версии пакетов Mantine.

**Бюджет.** Операций: 8. Категории: `ui`, `deps`. Миграций нет.

**Файлы**

- **Зависимости:** новых пакетов нет. Все `@mantine/*` (`core`, `hooks`, `dates`, `notifications`) обновляются до одной и той же последней версии 9.x и закрепляются на ней одинаково: сейчас `notifications@9.6.1` расходится с `core@9.5.2`. Разрешение владельца — 2026-10-20.
- `src/components/Button/` (имя уточняется по коду, если подходящее уже занято) — общая кнопка
- Общие части формы листа — место по лестнице размещения из конвенций
- Потребители: листы `ProductFormSheet`, `VariantFormSheet`, `CookLogSheet`, `FinishSheet`, `IngredientOptionsSheet`, `FiltersSheet`, `ArchiveConfirm`; кнопки в `LogEntry`, `CookLogAction`, `RecipeEditorPage`, `PhotoField`, `LoginPage`

**1. Общая кнопка.** Сейчас `SSubmit` / `SCancel` / `SSecondaryButton` / `SDangerButton` / `SButton` с одинаковыми стилями скопированы по листам и страницам. Нужна одна кнопка проекта с вариантами через значение пропа (`variant`: основная, второстепенная, опасная — по тому, какие варианты реально встречаются). Высота не меньше 44px, цвета только из темы, `disabled` выглядит одинаково везде. Исполнитель сначала составляет список копий (поиском, а не по этому списку) и в отчёте перечисляет, какие заменены, а какие оставлены и почему. Кнопка с другой ролью, например пунктирная «Добавить», не обязана влезать в общий компонент.

**2. Общая разметка формы листа.** `SForm` / `SField` / `SActions` повторяются в листах с формой. Если копии действительно совпадают, они выносятся в одно место. Делать составной компонент только при условиях из конвенций; иначе достаточно общих styled-компонентов.

**3. Высота полей Mantine.** `NumberInput` и `DatePickerInput` с `size="md"` дают около 42px — ниже 44px из инвариантов. Поднять до 44px в одном месте (тема Mantine или общий wrapper), а не в каждом потребителе.

**4. Обновление Mantine.** Прочитать changelog между текущими версиями и целевой, найти ломающие изменения для используемых компонентов (`Drawer`, `Combobox`, `NumberInput`, `Notifications`, `Skeleton`, `Rating`, `DatePicker` / `DatePickerInput`, `DatesProvider`) и поправить вызовы. `pnpm install` не должен выдавать предупреждений о peer-версиях Mantine.

**Проверка.**
- `pnpm list "@mantine/*"` показывает одну версию у всех пакетов. `pnpm install` не выдаёт предупреждений о peer-версиях Mantine.
- Поиск по `_styles.ts` больше не находит копий стилей основной и второстепенной кнопок вне общего компонента; исключения названы в отчёте.
- Живьём на локальном стеке открываются и отправляются все листы:
  - создание продукта и варианта;
  - параметры ингредиента;
  - фильтры;
  - архивация;
  - запись готовки;
  - «Другая дата».

  Работают вход, уведомления, календарь и звёзды.
- Высота кнопок и полей в листах не меньше 44px.
- `pnpm lint`, `pnpm build`, `pnpm test` чистые.

### Фаза 12 — Экспорт, импорт, настройки

**Цель.** Бэкап есть с первой версии, категории редактируются.

**Бюджет.** Операций: 8. Категории: `ui`, `services`.

**Файлы**

- `src/pages/SettingsPage/` + `_internal/{ExportBlock,ImportBlock,CategoriesEditor}`
- 🔒 `src/domain/backup/` — сериализация всей базы в JSON с версией схемы и валидация импорта через zod — **владелец** (шаг `B9`)

**Проверка.** Экспорт скачивает файл со всеми таблицами и полем `version`; импорт битого файла отклоняется с внятным сообщением и **ничего не пишет в базу**; импорт валидного файла на пустой базе восстанавливает состояние один в один; категории переименовываются и переупорядочиваются, `sort_order` сохраняется.

### Фаза 13 — КБЖУ по фото этикетки (после v1, условная)

**Цель.** Жена фотографирует таблицу пищевой ценности на упаковке — четыре поля КБЖУ заполняются сами, остаются редактируемыми.

Заменяет вычеркнутую фазу со сканером штрихкодов: Open Food Facts на реальных вьетнамских упаковках не работает (`decisions.md §6.5`). Распознавание этикетки от чужой базы не зависит вообще и дополнительно покрывает товары без штрихкода — развес, рынок, переупаковку.

**Условие запуска.** Делать **только если ручной ввод реально начал раздражать**. Четыре числа с этикетки набираются за ~20 секунд, а новые продукты после первого месяца появляются редко. Это удобство, а не необходимость, и до заполненной базы рецептов приоритет у него нулевой.

**Бюджет.** Операций: 6. Категории: `ui`, `services`.

**Файлы**

- `supabase/functions/read-label/` — Edge Function: принимает изображение, зовёт облачный vision-API, возвращает структурированный JSON. Ключ провайдера живёт здесь, в браузер не попадает
- `src/api/external/readLabel.ts` — вызов функции, zod-валидация ответа
- интеграция в `VariantFormSheet`: кнопка «сфотографировать этикетку», предзаполнение, `source = 'llm'`, `is_approximate = true` до подтверждения человеком

**Ключевые требования**

- Модель возвращает **строго structured output по zod-схеме**, а не свободный текст. Не распарсилось — честная ошибка, а не догадки.
- **Различать «на 100 г» и «на порцию».** На вьетнамских и азиатских упаковках порционная подача встречается часто, и молча принять её за 100 г — это тихо неверные цифры во всех рецептах с этим продуктом. Модель обязана вернуть, какая это была колонка; порционная — пересчитываем через указанный вес порции или просим ввести руками.
- Языки этикеток: вьетнамский, английский, русский, иногда корейский. Это ровно то, с чем OCR + регулярки не справятся, а vision-модель справится.
- Всё предзаполненное визуально помечено как непроверенное, пока человек не подтвердил.

**Проверка.** Десяток реальных упаковок из дома распознаётся с верными числами; порционная таблица не выдаётся за стограммовую; нечитаемое фото даёт понятную ошибку и не оставляет форму частично заполненной мусором; ключ провайдера отсутствует в бандле клиента; работает на iPhone из PWA с домашнего экрана — камера в standalone-режиме на iOS исторически проблемное место, проверять именно там, а не во вкладке Safari.

**Хостинг.** Облачный vision-API, **не локальная модель**. Обоснование — `decisions.md §3` и `§6`: объём порядка нескольких десятков снимков в месяц стоит центы, работает всегда и откуда угодно, не требует ни туннеля, ни бодрствующего ноутбука.

---

## Конвенции

Живут в `.github/copilot-instructions.md`, отдельно здесь не дублируются. Что важно помнить именно при выполнении этого плана:

- **Путь к данным:** компонент → хук TanStack Query → сервис → клиент Supabase. Прямой `supabase.from(...)` вне `src/api/repositories/` — дефект.
- **Типы сущностей** в `src/types/`, внутренние типы модуля расчёта — в `src/domain/nutrition/_types.ts`.
- **Роут тонкий**, экран в `src/pages/`; подкомпоненты страницы и части компонента — в `_internal/`.
- **Размер шрифта не задаётся в экранах.** Только компоненты из `src/components/Typography/`. Новый размер — сначала токен в `src/theme/_typography.ts`, потом компонент, и только потом использование.
- **Все видимые тексты — через словарь** `public/dictionaries/ru.json`, ни одной строки в JSX.
- **Округление только при отображении**; домен возвращает сырые числа.
- **`numeric` из PostgREST — строка** до границы репозитория.
- **Даты** `cooked_at` / `finished_at` — строки `YYYY-MM-DD`, без `Date`.
- **Mantine только для тяжёлых компонентов**, специфичность над ними — через `&&`, не `!important`.

## Подводные камни

- **Круговая ссылка products ↔ product_variants.** Создание продукта с первым вариантом — две вставки. Составной FK объявлен `deferrable initially deferred`, поэтому обе должны идти в одной транзакции; из клиента это `rpc`-функция либо порядок «вариант без продукта невозможен» → сначала продукт с `active_variant_id = null`, затем вариант, затем update продукта. ~~Второй путь проще, его и берём.~~ **Пересмотрено 2026-09-19: берём `rpc`** — три запроса это три транзакции, и отказ посередине оставляет продукт без вариантов, а повторное нажатие даёт дубль. См. `decisions.md §7.6`.
- **Mantine и styled-components в одном DOM.** Обе кладут стили в `<head>`, порядок вставки не гарантирован. Специфичность повышаем через `&&` в styled-обёртках над Mantine-компонентами, а не `!important`.
- **`100vh` на мобильном Safari** больше видимой области. Только `100dvh` и `env(safe-area-inset-bottom)` для таб-бара.
- **iOS PWA и localStorage.** Система может очистить хранилище у давно не открывавшегося PWA. Черновик рецепта — временные данные, это допустимо, но пользователя предупреждать не надо: критичные данные всегда в Supabase.
- **`ё` и `е`.** В русском поиске обязательна нормализация с обеих сторон, иначе «мёд» и «мед» разные строки.
- ~~**PostgREST возвращает `numeric` строкой.**~~ Опровергнуто 2026-09-08 проверкой на живых данных: приходит числом, сгенерированные типы верны. Урок оставлен в другой форме — тип из чужой документации сверяется с фактическим ответом. Если бы правда возвращалась строка, забыть привести значило бы получить `"120" + 30 = "12030"` в расчёте КБЖУ. Приведение делает репозиторий, домен принимает только числа.
- **Переупорядочивание при отсутствии unique на `sort_order`.** Обновлять весь список одним upsert'ом, а не по строкам, иначе промежуточные состояния дадут дубли порядка.
- **dnd-kit внутри скроллящегося контейнера** требует `touch-action: none` на ручке захвата, иначе на телефоне страница поедет вместе с элементом.
- **Международная связность из Вьетнама нестабильна** — подводные кабели (AAG, APG) рвутся по нескольку раз в год, и на дни деградирует весь зарубежный трафик. Persisted-кэш здесь не украшение: в такие дни чтение из кэша это единственное, что работает. Отсюда же приоритет региона Singapore — сингапурские маршруты страдают меньше прочих.

## Отложено сознательно

- Офлайн-запись (outbox-очередь мутаций). В v1 запись требует сети, чтение работает офлайн.
- Десктопный layout. Одна колонка `max-width: 600px`, отдельной вёрстки нет.
- Миллилитры и плотности. Только граммы.
- Всё из раздела «Что НЕ делаем в v1» исходного ТЗ.
- Задел под LLM и бытовые покупки — см. `decisions.md §6` и `§7`. В v1 соблюдаются только границы: zod-схемы на сущности, чистый модуль расчёта, `source` у варианта, репозитории отдельно от компонентов.

## Открытые вопросы

- **Домен** — пока `*.pages.dev`.
- **Телефоны** — iPhone или Android? Определяет, нужен ли `zxing-wasm` в Фазе 13 (в Safari на iOS нативного `BarcodeDetector` нет).

## Дополнения

### Фаза 12 — добавлено 2026-10-20

**Триггер:** обсуждение Фазы 12 с владельцем до запуска. План не задавал, что делать с фото и с импортом в непустую базу, а пометка 🔒 у `src/domain/backup/` устарела.

**Решения владельца:**
- **Модуль бэкапа пишет исполнитель.** Пометка «🔒 владелец (шаг `B9`)» снята вместе с разделением работ 2026-10-18 (`decisions.md §7.7`).
- **Фото в бэкап не входят.** В JSON попадают только таблицы. От фото рецепта остаётся путь в Storage, сами файлы не выгружаются. Если облако пропадёт целиком, рецепты восстановятся без обложек. Владелец это принял. Вариант с архивом ZIP вынесен в `BACKLOG.md` («Бэкап вместе с фото»).
- **Импорт только в пустую базу.** Перед записью импорт проверяет, что в базе нет пользовательских данных: продуктов, рецептов и записей журнала. Если они есть, импорт отказывает с понятным сообщением и ничего не пишет. Как считать стартовые категории, которые есть в любой свежей базе (`Стартовые данные`), исполнитель решает по схеме и называет в отчёте. Замена и слияние вынесены в `BACKLOG.md` («Импорт бэкапа в непустую базу»).

**Проверка дополняется:** импорт в базу, где уже есть хотя бы один продукт или рецепт, отклоняется с сообщением, и в базе ничего не меняется.

### Фаза 11.5 — добавлено 2026-10-20 (по итогам ревью итерации 1)

**Триггер:** итерация 1 одобрена, но остались мелочи, и владелец решил закрыть их в итерации 2 до Фазы 12.

**Сделано сверх плана в итерации 1, принято:** крестик закрытия `Drawer` увеличен с 28px до 44px в теме Mantine. Это тап-цель внутри листа, и проверка фазы требует 44px для элементов листов.

**Итерация 2:**
- **Стрелки `NumberInput`.** Они по 21px и бесполезны для граммов и ккал. Убрать во всех числовых полях одной настройкой в теме (`hideControls` по умолчанию), как в редакторе рецепта, где их уже нет. Явные `hideControls` у потребителей после этого лишние — убрать.
- **Ячейка дня в календаре `@mantine/dates`.** Сейчас 36px, поднять до 44px в теме. Месяц должен помещаться в ширину листа на экране 320px.
- **`IngredientOptionsSheet`** берёт `SField` из стилей редактора, хотя уже использует общую форму листа. Перевести на `SSheetField`. Копии `SField` в `LoginPage` и `RecipeEditorPage` остаются: это не листы.
- **Комментарии в `src/theme/_mantineTheme.ts`** начать с того, что делает переопределение, а значение Mantine по умолчанию указать после.

### Фаза 11 и Фаза 11.5 — добавлено 2026-10-20

**Триггер:** ревью итерации 1 Фазы 11.
- План клал `CookLogSheet` в общий `src/components/`, хотя потребитель у листа один — кнопка в карточке рецепта.
- Стили кнопок и разметка форм листов скопированы уже в нескольких местах.
- `@mantine/notifications` расходится по версии с `@mantine/core`.

**Решение владельца:**
- `CookLogSheet` живёт рядом с единственным потребителем, в `src/pages/RecipePage/_internal/`. В общий `src/components/` он поднимается, когда появится второй потребитель, например запись готовки из журнала. Перенос входит в итерацию 2 Фазы 11.
- Общие кнопки и формы листов, высота полей Mantine и обновление всех `@mantine/*` до одной версии вынесены в отдельную Фазу 11.5 сразу после Фазы 11.

### Фаза 10 — добавлено 2026-10-20

**Триггер:** ревью итерации 1. Проверка фазы требует «возврат из карточки сохраняет поиск и фильтры», а способ план не задавал. Исполнитель запоминал последний поиск в переменной модуля (`src/utils/lastRecipesSearch.ts`): скрытое глобальное состояние, которое не знает, откуда пришли, и вернуло бы на давний поиск при входе в карточку из журнала (Фаза 11).

**Решение владельца — «назад» по истории браузера.** Поиск и фильтры уже живут в search-params списка, поэтому шаг назад возвращает их без запоминания.

- **`BackLink`** (`src/components/BackLink/`): если в истории приложения есть куда вернуться (`useCanGoBack` роутера), делает `history.back()`; иначе — переход на запасной адрес из своих пропов (прямая ссылка, перезапуск PWA). Подпись — «← Назад» там, где экран открывается из разных мест (карточка рецепта, карточка продукта, редактор).
- **Сохранение в редакторе** (`src/pages/RecipeEditorPage/_useRecipeSave.ts`): правка существующего рецепта — шаг назад на карточку, с которой редактор открыт (если вернуться некуда — `navigate` на карточку с `replace`); новый рецепт — `navigate` на его карточку с `replace: true`. В истории не остаётся пар «карточка → редактор → карточка».
- `src/utils/lastRecipesSearch.ts` удаляется вместе с его эффектом в роуте.
- Файлы сверх списка фазы: `src/components/BackLink/`, `src/pages/RecipePage/`, `src/pages/RecipeEditorPage/`, `src/pages/ProductPage/` (потребители `BackLink`), словарь.

**Проверка дополняется:** список с поиском → карточка → «Назад» возвращает поиск и фильтры; список → карточка → «Редактировать» → сохранить → «Назад» ведёт на список, а не на прежнюю карточку; новый рецепт → сохранить → «Назад» — на список; карточка, открытая по прямой ссылке в новой вкладке, — «Назад» ведёт на запасной адрес; таб «Рецепты» при активном поиске сбрасывает и поле, и выдачу.

### Фаза 11 — добавлено 2026-10-20

**Триггер:** ревью Фазы 9 — кнопку записи готовки в карточке рецепта требуют карта экранов и порядок блоков, но ни одна фаза её не делала. В Фазе 9 её верно не сделали: лист `CookLogSheet` появляется только в Фазе 11, а кнопка без него была бы молчаливым no-op.

**Правка:** кнопка входит в Фазу 11, в список её файлов. Название — «Записать готовку» вместо «Готовила» из ТЗ: владелец попросил текст без привязки к роду, приложением пользуются двое.

### Фаза 8.5, Фазы 9 и 10 — добавлено 2026-10-20

**Триггер:** ревью Фазы 8 — замечания без блокировки. Владелец решил чинить их сразу (ссылки на видео — с прицелом на публичную демо-копию), а не копить.

**Правка:** заведена Фаза 8.5: общие `STextInput`/`STextArea`, `z.httpUrl()`, `createId`, тест сравнения черновиков, Enter в редакторе, защита черновика после сохранения. Входов в редактор не было ни в одной фазе: в Фазу 9 добавлены кнопка «Редактировать» и переход после сохранения на карточку, в Фазу 10 — FAB «＋» из карты экранов.

**Решено владельцем в тот же день — Фаза 8.6:** защита `isDirty` в `useForm` остаётся, но поле может задать `prevValue` явно (форма создания со значениями по умолчанию), а кнопки отправки показывают защиту через `disabled` вместо молчаливого игнора; адрес фото собирается в сервисе как `photoUrl` с версией от `updated_at`, `useRecipePhotoUrl` удаляется.

### Фаза 8 — добавлено 2026-10-18

**Триггер:** владелец снял разделение работ (`decisions.md §7.7`) — обучение вынесено за пределы проекта, приоритет — запуск.

**Правка:** мутации, которые раньше писал владелец перед Фазой 8 (сохранение рецепта целиком и загрузка фото), входят в саму фазу. В её список файлов добавлены миграция `save_recipe`, перегенерация типов, `IRecipeInput`, правка схем ввода рецепта, сервис и мутация. Проверка дополнена атомарностью сохранения.

### Фаза 7.5 — добавлена 2026-09-21

**Триггер:** ревью Фазы 7 владельцем — дефект `FORM-1`. Конвенции отсылают исполнителей к «the project's own hook» для форм, `decisions.md §2` его фиксирует, «Структура проекта» перечисляет в `src/hooks/`, а хука не существует: ни одна фаза его не создавала. Три формы написаны россыпью `useState`, каждая заново решает поля, ошибку, сброс при открытии и валидацию.

**Решение:** отдельная фаза 7.5 перед Фазой 8, пока формы ещё маленькие. Контракт `useForm` выводится из трёх существующих потребителей, а не придумывается заранее.

**Уточнено 2026-09-21:** хук не проектируется заново, а **переносится из `Carbon-spa` целиком** — с `isDirty`, пер-полевыми ошибками, `required`, `validator`, `formatter` и автосохранением по таймеру. Причина: владелец хочет привычный API и возможность унести хук в следующий проект. Автосохранение при этом закрывает требование Фазы 8 (черновик рецепта с debounce 500 мс), а не оказывается лишним. `touched` не переносится — его в оригинале нет.

**Заодно в ту же фазу:** нативный `<select>` переезжает в общий `src/components/Select/` — владелец предпочёл общий компонент правилу в конвенциях, потому что компонент исполнитель найдёт сам, а правило надо помнить. Плюс `ArchiveConfirm` переводится на общий `SBottomSheetDrawer`: ревьюер дважды отмечал третью копию одного переопределения высоты.

**Почему нативный `<select>`, а не компонент Mantine:** на iPhone он открывает системное колесо-пикер — крупное, с жестами и озвучкой. Для короткого статичного списка это лучше кастомного дропдауна и не стоит ни байта JS. `Combobox` из Mantine остаётся там, где нужен поиск по большому набору, — в `ProductPicker`.

### Фаза 7 — добавлено 2026-09-19

**Триггер:** ревью итерации 1 — пункт проверки «лист закрывается по свайпу вниз» недостижим выбранным примитивом: у Mantine `Drawer` нет жеста свайпа, а в Фазе 6 тот же примитив свайпа в проверке не требовал.

**Правка:** пункт проверки Фазы 7 читается как «лист корректно открывается поверх другого листа и закрывается тапом по фону, кнопкой и `Escape`». Свайп вниз из этой фазы убран; общий жест для всех листов записан в `BACKLOG.md` отдельным пунктом. Список файлов фазы не меняется.

### Фаза 2 — добавлено 2026-09-07

**Триггер:** дефект `CACHE-1`, найденный исполнителем Фазы 4 при чтении соседнего кода.

**Правка 1 — `maxAge`.** `persistOptions` передавался без него, а дефолт `persistQueryClientRestore` — 24 часа. Снапшот старше суток отбрасывался целиком, то есть офлайн-чтение, ради которого persist и заводился (`decisions.md §3`), не работало уже на третий день без сети. `gcTime` этого не заменяет: он про время жизни кэша **в памяти**, а не про срок годности снапшота на диске. Теперь оба берут одну константу `CACHE_MAX_AGE`, потому что заданные по отдельности они однажды разъедутся снова.

**Правка 2 — `buster`.** Строка-метка, записываемая в снапшот; при старте сравнивается на неравенство, несовпадение выбрасывает снапшот до гидрации. Защищает от сценария «выкатили версию с изменённой формой сущности, старый снапшот гидрировался в новый код, экран упал на отсутствующем поле».

📌 **Версионирует форму данных, а не приложение.** К версии сборки или хэшу не привязывать: выкатки идут на каждый пуш, и офлайн-кэш обнулялся бы каждый раз — то есть механизм ломал бы ровно то, ради чего существует.

📌 **Ничего не обнаруживается автоматически.** Забыл поднять — снапшот спокойно гидрируется, предупреждения не будет. Поэтому подъём привязан к событию, а не к памяти: пункт 5 в чек-листе `B7` (`backend-track.md`), который и так открывается при каждой правке схемы.

**Черновик рецепта это не затрагивает** — он в localStorage, пишется собственным хуком и `persistQueryClient` о нём не знает. Его защита — чтение через `safeParse` схемы в Фазе 8, там же, где пишется `useRecipeDraft`.

**Файлы:** `src/app/_queryClient.ts` (обе константы, сборка `persistOptions`), `src/app/App.tsx` (передача одним объектом). `queryPersister` перестал экспортироваться — за пределами файла он больше не нужен.

### Фаза 2, Фаза 3.5 — добавлено 2026-09-06

**Что изменилось.** `src/app/providers.tsx` переименован в `src/app/App.tsx`, компонент `AppProviders` — в `App`, `RouterProvider` переехал из `src/main.tsx` внутрь него. Прежние упоминания `providers.tsx` в списках файлов Фаз 2 и 3.5 читать как `App.tsx`.

**Почему.** Компонент перестал быть обёрткой с `children` и стал композицией приложения — имя `AppProviders` описывало не то, что файл делает. Заодно раскладка совпала с рабочим проектом `Carbon-spa` (`main.tsx` монтирует `<App />`, `App.tsx` собирает стопку), что было отдельной целью — см. `decisions.md §7.5`.

**Что при этом проверялось.** Аргумент «`AppProviders` переиспользуется в тестах» не подтвердился: тестов компонентов в плане нет ни в одной фазе, а когда они появятся, обёртка всё равно будет собираться отдельно — с одноразовым query-клиентом без персистера и с подсунутым словарём вместо `fetch`. Разбор — в `BACKLOG.md`, «Тесты за пределами модуля расчёта».

**Порядок импортов** теперь машинно проверяется: добавлен `eslint-plugin-simple-import-sort` с явными группами (побочные эффекты → внешние пакеты → алиас `@/` → относительные). До этого порядок держался только на аккуратности.

<!-- Журнал правок плана по ходу выполнения. Дописывать, не переписывать. -->

### Фаза 5 — добавлено 2026-08-31

**Триггер:** типы сущностей (`IProduct`, `IRecipe`, `ICookLog` и прочие) перечислены в разделе «Структура проекта», но **ни одна фаза их не создавала**. Репозитории обязаны возвращать их, то есть работа была бы заблокирована на пустом месте.

**Правка.** Типы отнесены к `B6` и создаются владельцем вместе с репозиториями, до них. Записано и в списке файлов Фазы 5, и в `backend-track.md`.

**Заодно зафиксировано соотношение с zod-схемами из Фазы 4:** они описывают разное — схема валидирует ввод (форма, импорт JSON), интерфейс описывает сущность целиком, с `id` и служебными метками времени. Выводить одно из другого не надо; чтобы не разъехались, схему проверяют против интерфейса через `satisfies z.ZodType<IProduct>`.

### Фазы 4, 5, 8, 11 — добавлено 2026-08-31

**Триггер:** правило «закрытый список зависимостей на фазу» было введено после Фазы 2, но список написан только для неё. Фаза 4 упёрлась бы в `zod` и по правилу остановилась бы спрашивать.

**Правка.** Списки дописаны во все фазы, где появляются новые пакеты: Фаза 4 — `zod`; Фаза 5 — `@mantine/notifications`; Фаза 8 — три пакета `@dnd-kit/*` и `browser-image-compression`; Фаза 11 — `@mantine/dates` с обязательным `dayjs`. В остальных фазах новых зависимостей нет, и это тоже означает «ставить нечего».

### Фаза 3.5 — добавлено 2026-08-31 (по итогам ревью)

**Триггер:** ревьюер показал, что раздел «Файлы» фазы противоречит её же разделу «Проверка».

**Суть.** Проверка требовала, чтобы в `src/pages/**` и `src/components/**` не осталось литеральных `font-size`, но в списке файлов не было `LoginPage`, `RouteStub` и `TabBar` — а именно они их и задавали. Выполнить фазу буквально по списку и одновременно пройти её проверку было невозможно. Исполнитель это заметил, раскрыл в отчёте и сделал правки по цели фазы — исполнение верное, дефект планировочный.

**Правка.** Три пути дописаны в «Файлы» отдельной строкой, с указанием, что они и есть предмет проверки на `font-size`.

**Урок на будущие фазы:** если проверка формулируется через «во всём каталоге не осталось X», список файлов обязан перечислять всё, что этот X сейчас содержит. Иначе фаза сама себе противоречит.

### Фаза 3.5 — добавлена 2026-08-31

**Триггер:** ревью каркаса владельцем после Фаз 2–3 плюс четыре замечания оркестратора.

**Решение по роутингу:** TanStack Router переводится из file-based в **code-based**. Типизация params и search сохраняется целиком — она идёт от определений роутов, а не от файловых соглашений. Уходит ровно то, что мешало читать проект: кодогенерация `routeTree.gen.ts`, соглашения `__root.tsx` / `_layout.tsx` и размазанность дерева по файлам. При девяти роутах автоматический code-splitting file-based режима экономит немного, а стоимость понимания платится постоянно.

Заодно закрываются три замечания оркестратора: вопрос «коммитить ли `routeTree.gen.ts`» исчезает вместе с файлом, ветвление по `pathname` в корневом роуте — вместе с корневым роутом, `AppLayout` переезжает в `src/routes/layouts/`.

**Решение по типографике:** компоненты `src/components/Typography/` по образцу `Carbon-spa/src/uikit/Typography`. Отдельный слой `uikit/` не заводим — конвенция «примитив это либо Mantine, либо компонент в `src/components/`» остаётся в силе. Сделать надо **до Фазы 6**, иначе каждый экран заведёт свои заголовки.

**Затронутые фазы:** в 8, 9 и 10 ссылки на файлы-роуты заменены на добавление маршрутов в `_routes.tsx` и `_paths.ts`; в 9 явно указано брать крупные цифры КБЖУ из `Typography/Numbers`. В описаниях Фаз 2 и 3 проставлены пометки, что их роутинг переделан здесь.

### Фаза 2 — добавлено 2026-08-31

**Триггер:** ревьюер показал, что добавленная накануне проверка невыполнима.

**Суть.** Формулировка «сборка с убранной переменной падает» неверна дважды: `vite build` прикладной код не выполняет, а главное — ветка `env.ts` ← `api/supabase.ts` в Фазе 2 недостижима из `main.tsx`, у клиента ещё нет импортёров. То есть при полностью корректном коде строгое прочтение проверки дало бы «успех» на пустом месте — хуже, чем исходная двусмысленность.

**Правка.** В Фазе 2 контракт проверяется юнит-тестом на `readEnvVar` (три случая, `vi.stubEnv`), сквозная проверка «приложение не стартует без переменной» перенесена в Фазу 3, где ветка становится живой. Импровизированный SSR-харнесс больше не нужен — он был единственным способом выполнить невыполнимое требование, а не срезанием угла.

### Фаза 2 — добавлено 2026-08-30

**Триггер:** три замечания ревьюера по итогам фазы.

**Правки:**

1. **Экспорт без потребителя.** `src/api/supabase.ts` создаётся в Фазе 2, первый импортёр появляется в Фазе 3. Названо исключением прямо в фазе — с указанием потребителя. Ревьюер прав, что дырка структурная, но его диагноз («потребитель только в Фазе 5, значит перенести туда») неточен: клиент нужен уже Фазе 3 для `supabase.auth`, переносить нельзя.
2. **Список зависимостей фазы.** Добавлен закрытый перечень пакетов, которые фаза ставит. Правило «новые зависимости только с разрешения» существовало, но требовало от исполнителя судить, что считается новым; теперь это сверка со списком, а не суждение.
3. **Контракт `readEnvVar`.** Проверять `typeof value !== "string" || value.length === 0`. Vite подставляет `import.meta.env` статическим объектом, и отсутствующего ключа в нём просто нет — проверка на одну длину падает с `TypeError`. В проверку фазы добавлен прогон сборки с намеренно убранной переменной.

### Фаза 1 → Фаза 2 — добавлено 2026-08-18

**Триггер:** Фаза 1 выполнена, но `package.json` в ней не создан.

**Правка:** пункт переезжает в Фазу 2. Её исполнитель создаёт `package.json` с нуля (скаффолдером Vite — конфликта с существующим файлом больше нет) и **дополнительно** добавляет туда `supabase` в `devDependencies` и скрипты `db:reset` / `db:types`. Формулировка про «не создавать проект заново поверх существующего package.json» в Фазе 2 больше не актуальна.

### Фаза 1 — добавлено 2026-08-18

**Триггер:** дефекты `RLS-1` и `GRANT-1` (подробности в `EXECUTION.md`).

**Правка:** в раздел «Схема базы данных» добавлен блок про гранты. Доступ к данным проходит две независимые проверки — грант, затем политика RLS; нужны обе, на каждой таблице. Право `DELETE` роли `authenticated` выдано избирательно, чтобы инвариант «удалений нет» стал невыполнимым действием, а не соглашением.

### Фаза 1 — добавлено 2026-08-18

**Триггер:** решение владельца заполнять справочник продуктов вручную.

**Правка:** предзаполняются только категории блюд. `product_categories` и `products` на старте **пустые** — Фазы 6–7 обязаны корректно показывать пустое состояние.

## Известные проблемы

<!-- Найденное во время выполнения и отложенное. -->

### FORM-1 — обещанного `useForm` нет, формы написаны вручную ✅ исправлено в Фазе 7.5

**Найдено:** 2026-09-21, при ревью Фазы 7 владельцем.

**Суть.** `decisions.md §2` фиксирует «свой `useForm`-подобный хук (по мотивам Carbon-spa)», раздел «Структура проекта» перечисляет его в `src/hooks/`, а конвенции прямо говорят исполнителям: «Forms — the project's own hook». Хука **не существует**: ни одна фаза его не создавала.

Следствие: три формы написаны россыпью `useState` — `LoginPage/_useLoginForm.ts`, `ProductFormSheet/_useProductForm.ts`, `VariantFormSheet/_useVariantForm.ts`. Каждая заново решает одно и то же: поля, `isPending`, ошибка, сброс при открытии, валидация схемой перед отправкой.

**Почему это дефект, а не мелочь.** Конвенция отсылает к тому, чего нет, — исполнитель следующей фазы либо напишет четвёртую копию, либо остановится. А следующая форма — редактор рецепта из Фазы 8, самая большая в проекте: массивы ингредиентов и шагов, перетаскивание, автосохранение черновика. Если её написать в том же стиле, хук уже не появится никогда.

**Исправление.** 📋 Заведена **Фаза 7.5** — `useForm` по трём существующим потребителям плюс общий `Select`. Делается до Фазы 8.

### CACHE-1 — persisted-кэш живёт сутки вместо недели ✅ исправлено

**Найдено:** 2026-09-07, по ходу Фазы 4. **Относится к Фазе 2** — `src/app/App.tsx`, настройка персистера TanStack Query. Исполнитель Фазы 4 файл не трогал верно: тот вне списка её файлов.

**Закрыто 2026-09-07** отдельной правкой вне фаз, вместе с `buster` — см. «Дополнения», запись от 2026-09-07.

**Суть.** `persistOptions` передаётся без `maxAge`:

```tsx
<PersistQueryClientProvider client={queryClient} persistOptions={{ persister: queryPersister }}>
```

У `persistQueryClientRestore` значение по умолчанию — **24 часа** (`maxAge = 864e5`, `@tanstack/query-persist-client-core/build/modern/persist.js`). Снапшот в IndexedDB старше суток отбрасывается целиком, и приложение открывается пустым.

`gcTime: 1000 * 60 * 60 * 24 * 7` в `src/app/_queryClient.ts` этого не отменяет: он задаёт время жизни кэша **в памяти**, а не срок годности персистированного снапшота. Это две независимые настройки, и вторая сейчас дефолтная.

**Почему дефект, а не мелочь.** `decisions.md §3` называет офлайн-чтение через persisted-кэш прямым ответом на нестабильную связность из Вьетнама: кабели AAG и APG рвутся по нескольку раз в год и деградируют на дни. Сценарий, ради которого механизм и заводился, сейчас не покрыт — на третий день без сети данных не будет. При этом комментарий в `_queryClient.ts` утверждает, что «кэш живёт неделю», то есть описывает свойство, которого у кода нет: это хуже самого дефекта, потому что переживёт его исправление.

**Исправление.** Одна строка — `maxAge` в `persistOptions`, согласованный с `gcTime`. Срок стоит задать константой в одном месте и использовать обоими, иначе они разъедутся снова. Комментарий в `_queryClient.ts` привести в соответствие.

**Рядом.** Второй незакрытый параметр того же персистера — `buster` (сброс кэша при выкатке версии с изменённой формой данных). Это не дефект, а задел; описан в `BACKLOG.md` → «Данные, пережившие свою версию приложения» и предложен как кандидат в пункт плана, пока приложение активно обновляется.
