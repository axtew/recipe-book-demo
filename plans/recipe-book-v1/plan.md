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
| `/recipes/$recipeId` | Карточка рецепта | Просмотр + кнопка «Готовила» |
| `/recipes/$recipeId/edit` | Редактирование | Редактор |
| `/products` | **Продукты** | Список по категориям продуктов, поиск, «＋» |
| `/products/$productId` | Карточка продукта | Варианты, переключение активного, где используется |
| `/log` | **Журнал** | Лента записей по датам, отметка «доели» |
| `/settings` | **Настройки** | Экспорт/импорт JSON, управление категориями, выход |

Модалки (не роуты, локальное состояние): создание продукта, добавление варианта, быстрая запись «Готовила», подтверждение архивирования. Все — `Drawer` Mantine с `position="bottom"`.

### 1. Список рецептов

Карточка: фото или плейсхолдер, название, время готовки, ккал на 100 г, снежинка если `freezable`. Группы категорий сворачиваются, состояние свёрнутости живёт в localStorage.

**Категорий у рецепта может быть несколько или ни одной** (связь много-ко-многим). Рецепт показывается **в каждой** своей группе — это нормально и полезно: заглянула в «Завтраки», нашла блины. Рецепт без категорий попадает в группу **«Без категории»** в конце списка. Счётчики «всего рецептов» из-за этого считаются по уникальным рецептам, а не суммированием по группам.

Поиск сверху ищет **и по названию рецепта, и по названиям продуктов в его составе** — сценарий «что приготовить из того, что есть». Нормализация: lowercase + `ё` → `е` с обеих сторон сравнения, иначе «гречка» не найдёт «Гречка» и «мёд» не найдёт «мед».

Фильтры: только замораживаемые; время готовки (≤15 / ≤30 / ≤60 / >60 мин). Состояние фильтров и поиска — в search-params роута (типизированы TanStack Router), чтобы «назад» из карточки возвращал к тем же результатам.

### 2. Карточка рецепта

Порядок блоков строго по ТЗ: фото → название, категория, время → КБЖУ (крупно на 100 г, мельче на порцию и на всё блюдо) → блок хранения (только если `freezable`) → ингредиенты → шаги → видео → заметки → кнопка «Готовила».

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
    repositories/       запросы к PostgREST, по файлу на домен; владелец
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
  context/              I18nContext и useI18nSelector
  hooks/                общие хуки, в т.ч. useForm
  utils/                хелперы: форматирование, нормализация строк, сжатие фото
  theme/                тема styled-components + провайдер темы Mantine
  app/                  провайдеры, queryClient, точка входа
public/
  dictionaries/ru.json  единственный словарь
  _redirects            SPA-fallback для Cloudflare Pages
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

### Фаза 5 — Слой данных 🔒 частично владелец

**Разделена.** Репозитории — запросы к базе, приведение типов на границе — пишет владелец (`backend-track.md`, шаг `B6`). Всё остальное — исполнитель. Фаза начинается после того, как `B6` закрыт.

**Цель.** Весь датасет загружается одним заходом, кэшируется, переживает офлайн, инвалидируется при мутациях.

**Бюджет.** Операций: 8 (из них 4 на владельце). Категории: `services`, `state`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `@mantine/notifications` (тосты об ошибках мутаций). Больше ничего.
- 🔒 `src/types/{products,recipes,cookLogs}.types.ts` — интерфейсы сущностей — **владелец**, часть `B6`
- 🔒 `src/api/repositories/{products,recipes,cookLogs,categories}.repository.ts` — **владелец**
- `src/api/queries/` — ключи запросов и хуки `useProductsQuery`, `useRecipesQuery`, `useCookLogsQuery`
- `src/api/mutations/` — базовый хук мутации с инвалидацией и тостом об ошибке
- `src/hooks/useAppData.hook.ts` — селекторы поверх загруженного датасета (продукты по id, рецепты по категориям, использование продукта)

**Проверка.** На старте ровно четыре запроса, дальше сеть молчит при навигации; выключенная сеть при повторном открытии показывает данные из persisted-кэша; мутация обновляет все зависимые экраны без ручного refetch.

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

**Проверка.** Поиск мгновенный, без обращений к сети; создание продукта из пикера возвращает его выбранным и не размонтирует родительский экран; поле КБЖУ можно оставить пустым и продукт создастся; лист корректно открывается поверх другого листа и закрывается по свайпу вниз.

### Фаза 8 — Редактор рецепта

**Цель.** Экран, ради которого всё затевалось.

**Бюджет.** Операций: 14. Категории: `ui`, `state`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (последний нужен для `CSS.Transform` в перетаскиваемой строке), `browser-image-compression`.
- `src/pages/RecipeEditorPage/` + `_internal/{IngredientRow,IngredientList,StepList,StorageFields,VideoLinks,NutritionBar,PhotoField}`
- `src/hooks/useRecipeDraft.hook.ts` — автосохранение в localStorage
- `src/utils/image.ts` — сжатие перед загрузкой
- маршруты `/recipes/new` и `/recipes/$recipeId/edit` — добавить в `src/routes/_routes.tsx` и `_paths.ts`, отдельных файлов на роут нет

**Проверка.** Рецепт из десяти ингредиентов и восьми шагов заводится без выхода с экрана; КБЖУ в липкой плашке обновляется по мере ввода; закрытие вкладки и повторное открытие предлагает восстановить черновик; перетаскивание работает и мышью, и пальцем, включая шаги разной высоты; фото с телефона грузится и сжимается; сохранение пишет корректные `sort_order`.

### Фаза 9 — Карточка рецепта

**Цель.** Просмотр со всеми состояниями КБЖУ.

**Бюджет.** Операций: 10. Категории: `ui`.

**Файлы**

- `src/pages/RecipePage/` + `_internal/{NutritionBlock,IncompleteWarning,StorageBlock,IngredientsBlock,StepsBlock,VideoBlock,CookStats}`
- крупные цифры КБЖУ — компонентами `Numbers` из `src/components/Typography/`, мелкие подписи — `Caption`. Своих размеров шрифта не заводить (Фаза 3.5)
- маршрут `/recipes/$recipeId` — добавить в `src/routes/_routes.tsx` и `_paths.ts`

**Проверка.** Порядок блоков совпадает с ТЗ; продукт без КБЖУ даёт предупреждение со ссылкой, а не нули; рецепт без `yield_grams` показывает подсказку про уварку; блок хранения скрыт при `freezable = false`; override помечен и кнопка «пересчитать» его сбрасывает; имя варианта показано только у продуктов с несколькими вариантами; видео открывается во внешнем приложении.

### Фаза 10 — Список рецептов, поиск и фильтры

**Цель.** Главный экран.

**Бюджет.** Операций: 8. Категории: `ui`, `state`.

**Файлы**

- `src/pages/RecipesPage/` + `_internal/{RecipeCard,CategoryGroup,SearchBar,FiltersSheet}`
- `src/utils/search.ts` — нормализация и матчинг
- типизированные search-params главного роута — `validateSearch` в его определении в `src/routes/_routes.tsx`

**Проверка.** Запрос «курица» находит рецепт, где есть куриное филе, но нет слова «курица» в названии; `ё`/`е` не ломает поиск; свёрнутость категорий переживает перезагрузку; фильтр «только замораживаемые» и фильтр по времени комбинируются; возврат из карточки сохраняет поиск и фильтры; пустой результат показывает внятную заглушку.

### Фаза 11 — Журнал готовки

**Цель.** Сбор данных под v2 начинается.

**Бюджет.** Операций: 9. Категории: `ui`, `services`.

**Файлы**

- **Зависимости, которые ставит эта фаза:** `@mantine/dates` (DatePicker) и `dayjs` — он peer-зависимость `@mantine/dates`, без него компонент не заведётся.
- `src/components/CookLogSheet/` — быстрое добавление
- `src/pages/LogPage/` + `_internal/{LogEntry,MonthGroup}`
- `src/domain/stats/` — агрегаты по рецепту (сколько раз, когда последний, средний выход, среднее число дней)

**Проверка.** Запись создаётся в два тапа с дефолтами; в `snapshot` лежит валидный по zod `INutritionSnapshot`; смена активного варианта продукта **не** меняет цифры в уже существующей записи, но **меняет** текущее КБЖУ рецепта; «доели» проставляет дату; статистика в карточке рецепта считается корректно и не падает при единственной записи и при нулевых значениях.

### Фаза 12 — Экспорт, импорт, настройки

**Цель.** Бэкап есть с первой версии, категории редактируются.

**Бюджет.** Операций: 8. Категории: `ui`, `services`.

**Файлы**

- `src/pages/SettingsPage/` + `_internal/{ExportBlock,ImportBlock,CategoriesEditor}`
- `src/domain/backup/` — сериализация всей базы в JSON с версией схемы и валидация импорта через zod

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

- **Путь к данным:** компонент → хук TanStack Query → репозиторий → клиент Supabase. Прямой `supabase.from(...)` вне `src/api/repositories/` — дефект.
- **Типы сущностей** в `src/types/`, внутренние типы модуля расчёта — в `src/domain/nutrition/_types.ts`.
- **Роут тонкий**, экран в `src/pages/`; подкомпоненты страницы и части компонента — в `_internal/`.
- **Размер шрифта не задаётся в экранах.** Только компоненты из `src/components/Typography/`. Новый размер — сначала токен в `src/theme/_typography.ts`, потом компонент, и только потом использование.
- **Все видимые тексты — через словарь** `public/dictionaries/ru.json`, ни одной строки в JSX.
- **Округление только при отображении**; домен возвращает сырые числа.
- **`numeric` из PostgREST — строка** до границы репозитория.
- **Даты** `cooked_at` / `finished_at` — строки `YYYY-MM-DD`, без `Date`.
- **Mantine только для тяжёлых компонентов**, специфичность над ними — через `&&`, не `!important`.

## Подводные камни

- **Круговая ссылка products ↔ product_variants.** Создание продукта с первым вариантом — две вставки. Составной FK объявлен `deferrable initially deferred`, поэтому обе должны идти в одной транзакции; из клиента это `rpc`-функция либо порядок «вариант без продукта невозможен» → сначала продукт с `active_variant_id = null`, затем вариант, затем update продукта. Второй путь проще, его и берём.
- **Mantine и styled-components в одном DOM.** Обе кладут стили в `<head>`, порядок вставки не гарантирован. Специфичность повышаем через `&&` в styled-обёртках над Mantine-компонентами, а не `!important`.
- **`100vh` на мобильном Safari** больше видимой области. Только `100dvh` и `env(safe-area-inset-bottom)` для таб-бара.
- **iOS PWA и localStorage.** Система может очистить хранилище у давно не открывавшегося PWA. Черновик рецепта — временные данные, это допустимо, но пользователя предупреждать не надо: критичные данные всегда в Supabase.
- **`ё` и `е`.** В русском поиске обязательна нормализация с обеих сторон, иначе «мёд» и «мед» разные строки.
- **PostgREST возвращает `numeric` строкой.** Забыть привести — получить `"120" + 30 = "12030"` в расчёте КБЖУ. Приведение делает репозиторий, домен принимает только числа.
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
