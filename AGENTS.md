# Книга рецептов — инструкции для агентов

Личное mobile-first PWA для двух человек: справочник продуктов, рецепты с расчётом КБЖУ, поиск, журнал готовки. Интерфейс на русском, единственный язык ([ADR 0002](docs/decisions/0002-russian-ui-with-i18n.md)). Исходное ТЗ — [`docs/task.md`](docs/task.md).

## Перед работой

1. [`STATUS.md`](STATUS.md) — где мы сейчас: закрытые фазы, следующий шаг, открытые вопросы. Начинать с него.
2. [`docs/decisions/`](docs/decisions/README.md) — принятые решения (ADR): стек, модель данных, границы продукта. При расхождении с чем угодно приоритет у них.
3. [`plans/README.md`](plans/README.md) — как устроена разработка и протокол фазы; план нужной задачи — `plans/<задача>/plan.md` (для v1 — [`plans/recipe-book-v1/plan.md`](plans/recipe-book-v1/plan.md): схема БД, доменные типы, контракт модуля расчёта, карта экранов, фазы).
4. Файлы из таблицы ниже — по тому, что трогает задача.

Справочно: [`DEPLOY.md`](DEPLOY.md) — деплой, переменные окружения, порядок работы с миграциями в проде, чек-лист релиза. [`BACKLOG.md`](BACKLOG.md) — идеи по развитию и техдолг.

## Что читать под задачу

| Задача трогает | Читать |
|---|---|
| любой код в `src/` | [`conventions/code-style.md`](docs/agents/conventions/code-style.md), [`conventions/structure.md`](docs/agents/conventions/structure.md), [`conventions/typing.md`](docs/agents/conventions/typing.md), [`conventions/stack.md`](docs/agents/conventions/stack.md) |
| компоненты, страницы, лейауты | + [`conventions/components.md`](docs/agents/conventions/components.md), [`conventions/styling.md`](docs/agents/conventions/styling.md) |
| пользовательские тексты, `public/dictionaries/` | + [`conventions/i18n.md`](docs/agents/conventions/i18n.md) |
| `src/routes/`, навигацию, guard авторизации | + [`conventions/routing.md`](docs/agents/conventions/routing.md) |
| `src/api/`, `src/domain/`, миграции, `supabase/`, кэш | + [`conventions/data.md`](docs/agents/conventions/data.md), [`architecture.md`](docs/agents/architecture.md) |
| тесты | + [`conventions/testing.md`](docs/agents/conventions/testing.md) |
| живую проверку (Docker, локальный Supabase, дев-пользователь) | [`local-environment.md`](docs/agents/local-environment.md) |
| откуда на экране берутся данные, кэш, PWA | [`architecture.md`](docs/agents/architecture.md) |
| план, ревью, фазу пайплайна | [`pipeline-profile.md`](docs/agents/pipeline-profile.md), [`plans/README.md`](plans/README.md) + всё, что трогает фаза |
| деплой, релиз | [`DEPLOY.md`](DEPLOY.md) |

## Команды

```
pnpm dev            # дев-сервер против локального Supabase
pnpm dev:prod       # дев-сервер против облака — только смотреть
pnpm build          # прод-сборка (vite build && tsc -b)
pnpm preview        # локальный просмотр собранного билда
pnpm lint           # линт
pnpm prettier       # форматирование всего репозитория
pnpm format         # форматирование src/
pnpm test           # vitest
pnpm db:reset       # пересоздать локальную БД из миграций + seed
pnpm db:types       # перегенерировать src/types/database.types.ts
```

Готово = `pnpm lint` и `pnpm build` проходят; если есть тесты, проходит и `pnpm test`. После правки схемы БД **всегда** перегенерировать типы — руками `database.types.ts` не редактировать.

## Жёсткие инварианты

Нарушение любого из них — дефект, даже если код работает; ревьюер квалифицирует каждое как `Issue source: code`.

- **Вся арифметика КБЖУ — только в `src/domain/nutrition/`.** Модуль не импортирует React, Supabase и Mantine. Округление — только при отображении ([`data.md`](docs/agents/conventions/data.md), [ADR 0017](docs/decisions/0017-nutrition-module-purity.md)).
- **Удалений нет.** Только `archived_at`; никаких `DELETE` из приложения ([ADR 0014](docs/decisions/0014-archiving-instead-of-deletes.md)).
- **Молчаливых нулей не бывает.** Продукт без КБЖУ — запись в `incompleteProducts` и видимое предупреждение в UI, а не ноль в сумме.
- **Сгенерированная форма строки не выходит за слой сервисов** (`src/api/services/`); числовые колонки сверяются с фактическим ответом ([`data.md`](docs/agents/conventions/data.md)).
- **Даты `cooked_at` / `finished_at`** — строки `YYYY-MM-DD`, никаких `Date` и часовых поясов.
- **Приоритет у iOS:** `100dvh`, `env(safe-area-inset-*)`, tap targets ≥44px ([`styling.md`](docs/agents/conventions/styling.md)).
- **Новые зависимости — только с разрешения.** Стек зафиксирован в [ADR 0003–0009](docs/decisions/README.md).
- **Данные загружаются в клиент целиком:** ни серверного поиска, ни пагинации, ни фильтрации на стороне БД ([ADR 0012](docs/decisions/0012-whole-dataset-in-client.md)).

## Правила работы

- **Облако — рабочая база семьи; тестовые данные туда не пишутся никогда.** Живая проверка — только на локальном стеке ([`local-environment.md`](docs/agents/local-environment.md)). Запрещены `npx supabase db push` и `npx supabase stop --no-backup`.
- **За владельцем:** `npx supabase db push` в облако, файлы `.env*`, дашборды Supabase и Cloudflare. Исполнитель пишет всё остальное, включая миграции, применяет их только к локальной базе и сообщает, что миграцию пора выкатить ([ADR 0026](docs/decisions/0026-work-split-lifted.md)).
- **Многошаговые записи — функцией в базе через `rpc`**, а не цепочкой запросов. **Применённую миграцию не редактировать** — только новая. **Новая таблица** — `enable row level security`, политика, `grant`. **Форма сущности в кэше изменилась** — поднять `CACHE_BUSTER`. **Схема ввода и интерфейс сущности** связаны через `satisfies z.ZodType<…>`. Подробности — [`data.md`](docs/agents/conventions/data.md).
- **Фаза:** одна сессия — одна фаза; делать только её; в конце пройти по пунктам «Проверка» и отчитаться по каждому; первая же непройденная проверка останавливает цепочку. Протокол — [`plans/README.md`](plans/README.md).
- **Расхождение плана с реальностью** (нет того, на что план ссылается; шаг противоречит другому решению; задумка не работает) — остановиться и спросить, не изобретать обходной путь молча. План правится через дополнение в разделе «Дополнения».
- **Коммиты делает владелец** после своего ревью; агенты не коммитят. Никаких следов инструментов в git: ни `Co-Authored-By`, ни ссылок на сессии, ни пометок «сгенерировано» в сообщениях коммитов, описаниях PR, названиях веток и тегов.
- **Идея на будущее** — в [`BACKLOG.md`](BACKLOG.md), а не в текущую задачу. Прежде чем предлагать «полезное», проверьте раздел «Отклонённое» там же.
- **Текст интерфейса не привязан к полу** — безличные, страдательные формы, множественное число ([`i18n.md`](docs/agents/conventions/i18n.md)).
- **Язык — русский** везде, включая комментарии, документацию и прозу в `plans/` ([ADR 0031](docs/decisions/0031-russian-language-of-repository.md)). Заголовки, статусы и ключи из шаблонов пайплайна не переводятся — их читают скиллы.

## Чего в проекте нет

Не предлагать и не добавлять по своей инициативе: SSR, серверный код помимо Supabase Edge Functions, мультипользовательность и роли, миллилитры и конверсии единиц, десктопный layout (одна колонка `max-width: 600px`), офлайн-запись. Обоснования — в [`docs/decisions/`](docs/decisions/README.md).
