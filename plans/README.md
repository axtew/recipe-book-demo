# Планы

Проект разрабатывается через агентный пайплайн: план → фаза (developer) → статическое ревью → ревью владельца → коммит.
Здесь — все его артефакты, чтобы процесс можно было проследить.

| Задача | Статус | Обсуждение | План | Журнал |
|---|---|---|---|---|
| `recipe-book-v1` — первая версия приложения | выполнено: обязательные фазы 1–12; фаза 13 (этикетка по фото) условная, после v1 | — | [plan.md](recipe-book-v1/plan.md) (схема БД, доменные типы, контракт модуля расчёта, карта экранов, фазы) | [EXECUTION.md](recipe-book-v1/EXECUTION.md) |
| `publication` — публичная версия и демо-стенд | в работе: фаза P1 (документация), затем P2–P5 | `publication/brainstorm.md` (только в рабочем репозитории) | `publication/plan.md` (только в рабочем репозитории) | `publication/EXECUTION.md` (только в рабочем репозитории) |

Идеи сверх плана — в [BACKLOG.md](../BACKLOG.md). Принятые решения — [docs/decisions/](../docs/decisions/README.md).

## Как устроена разработка

1. **План.** Владелец и оркестратор обсуждают подход (`brainstorm.md`), затем пишется `plan.md` с фазами и критериями приёмки («Проверка» у каждой фазы).
   Решения по ходу работы дописываются в раздел «Дополнения» плана.
2. **Фаза.** Исполнитель (developer-агент) выполняет одну фазу плана, снимает baseline `lint`/`build`, пишет код и отчёт `DEV-REPORT.md`.
3. **Статическое ревью.** Reviewer-агент читает диф и отчёт и пишет `REVIEW.md` со статусом (`APPROVED` / `NEEDS_CHANGES`) и источником замечаний (`code` / `plan` / `both`).
   При `NEEDS_CHANGES` владелец выбирает: поправить план, переделать план или пропустить замечание; исполнитель идёт на следующую итерацию.
4. **Ревью владельца.** Владелец смотрит изменения в рабочем дереве.
5. **Коммит.** Коммитит владелец, не агенты. Формат сообщений — по существующей конвенции репозитория; следов инструментов в git нет.

### Протокол фазы

По умолчанию одна сессия — одна фаза.

**В обычной сессии** владелец может явно попросить несколько фаз подряд («сделай фазы 2–3») — тогда они выполняются последовательно, но правила ниже применяются к **каждой** отдельно: свой список файлов, свой прогон раздела «Проверка», своя запись в `EXECUTION.md`. Итог по каждой фазе — отдельным блоком, не одним общим «готово».

**Через скилл `frontend-run`** — строго одна фаза за вызов, это заложено в самом скилле. Несколько фаз = несколько вызовов.

**Первая же непройденная проверка останавливает всю цепочку.** Не переходить к следующей фазе, чтобы «починить потом»: следующая будет строиться на сломанном основании, и разбирать придётся два слоя вместо одного.

1. Прочитать [решения](../docs/decisions/README.md) и раздел нужной фазы в плане целиком.
2. Делать **только эту фазу**. Файлы, не перечисленные в её списке, не трогать. Заметил нужную правку за пределами фазы — сказать об этом, а не делать молча.
3. В конце пройти по пунктам раздела **«Проверка»** этой фазы и отчитаться по каждому: выполнено или нет, с фактическим выводом команд. Не отчитываться об успехе там, где не проверял.
4. **Не коммитить.** Изменения остаются в рабочем дереве — их смотрит и коммитит владелец проекта.

Если план расходится с реальностью (не существует того, на что он ссылается; шаг противоречит другому решению; выясняется, что задумка не работает) — **остановиться и спросить**. Не изобретать обходной путь молча: план правится осознанно, через дополнение в разделе «Дополнения».

Профиль пайплайна для агентов — [`docs/agents/pipeline-profile.md`](../docs/agents/pipeline-profile.md).

## Раскладка артефактов

```
plans/<задача>/
  plan.md                         фазы, критерии приёмки, раздел «Дополнения»
  brainstorm.md                   разбор подхода (если был)
  EXECUTION.md                    журнал прогона: одна запись на фазу
  baseline/                       логи lint и build до правок (README.md — что уже было красным)
  <фаза>/iter-<N>/                отчёты итерации: DEV-REPORT.md, REVIEW.md
```

## Старое имя → новое

Артефакты `recipe-book-v1/` — записи о том, как было, и не правятся; их ссылки на прежние файлы читаются по таблицам ниже.

| Было | Стало |
|---|---|
| `CLAUDE.md` | [`AGENTS.md`](../AGENTS.md); `CLAUDE.md` теперь одна строка `@AGENTS.md` |
| `.github/copilot-instructions.md` (собирался из `.github/instructions/`) | [`docs/agents/conventions/`](../docs/agents/conventions/) по темам; генерация отменена |
| `.github/instructions/00-project.md`, `30-conventions-generic.md`, `40-conventions-project.md` | то же (разделы — в таблице ниже) |
| `.github/pipeline-profile.md` | [`docs/agents/pipeline-profile.md`](../docs/agents/pipeline-profile.md) |
| `.github/upstream-conventions-inbox.md` | удалён: очередь входящих правил из общего источника, в ней ничего не ожидало (`Pending: none`) |
| `decisions.md` | [`docs/decisions/`](../docs/decisions/README.md) — ADR (разделы — в таблице ниже) |
| `recipe-app-v1-prompt.md` | [`docs/task.md`](../docs/task.md) |
| `docs/how-it-works.md` | [`docs/agents/architecture.md`](../docs/agents/architecture.md) |

### `CLAUDE.md` и `.github/copilot-instructions.md` — разделы

| Раздел | Куда перенесён |
|---|---|
| CLAUDE.md → «Обязательное чтение перед любой работой» и «Справочно» | [`AGENTS.md`](../AGENTS.md) → «Перед работой» |
| CLAUDE.md → «Разделение работ» | [`AGENTS.md`](../AGENTS.md) → «Правила работы»; полный текст — [`conventions/data.md`](../docs/agents/conventions/data.md) → «Миграции и разделение работ»; решение — [ADR 0026](../docs/decisions/0026-work-split-lifted.md) |
| CLAUDE.md → «Локальное окружение» | [`docs/agents/local-environment.md`](../docs/agents/local-environment.md) |
| CLAUDE.md → «Как выполнять фазу» | «Протокол фазы» выше; кратко — [`AGENTS.md`](../AGENTS.md) → «Правила работы» |
| CLAUDE.md → «Жёсткие инварианты» | [`AGENTS.md`](../AGENTS.md) → «Жёсткие инварианты» |
| CLAUDE.md → «Конвенции кода» | заменён таблицей «Что читать под задачу» в [`AGENTS.md`](../AGENTS.md) |
| CLAUDE.md → «Команды», «Чего в проекте нет» | [`AGENTS.md`](../AGENTS.md) → «Команды», «Чего в проекте нет» |
| copilot-instructions → «Project Overview» | [`AGENTS.md`](../AGENTS.md) (шапка) |
| copilot-instructions → «Build & environment» | [`AGENTS.md`](../AGENTS.md) → «Команды»; [`conventions/testing.md`](../docs/agents/conventions/testing.md) |
| copilot-instructions → «Hard invariants» | [`AGENTS.md`](../AGENTS.md) → «Жёсткие инварианты» |
| «File naming», «Placement», «Export discipline», «Component size» | [`conventions/structure.md`](../docs/agents/conventions/structure.md) |
| «Equality», «Comments & docs language», «Comments — when, and what goes first» | [`conventions/code-style.md`](../docs/agents/conventions/code-style.md) |
| «Strong typing» | [`conventions/typing.md`](../docs/agents/conventions/typing.md) |
| «Loading states», «Compound components», «Extend the existing family» | [`conventions/components.md`](../docs/agents/conventions/components.md) |
| «Styling», «Styling — project specifics» | [`conventions/styling.md`](../docs/agents/conventions/styling.md) |
| «i18n — every locale always», «i18n — project specifics» | [`conventions/i18n.md`](../docs/agents/conventions/i18n.md) |
| «Data access — the only path to the backend», «Domain module purity» | [`conventions/data.md`](../docs/agents/conventions/data.md) |
| «Stack is fixed» | [`conventions/stack.md`](../docs/agents/conventions/stack.md) |
| «Routes and pages are different layers» | [`conventions/routing.md`](../docs/agents/conventions/routing.md) |

### `decisions.md` — разделы

Ссылки вида `decisions.md §N` в старых отчётах читаются так:

| Раздел | ADR |
|---|---|
| §1 Продукт и рамки | [0001](../docs/decisions/0001-personal-app-for-two.md), [0002](../docs/decisions/0002-russian-ui-with-i18n.md) |
| §2 Стек — фронтенд | [0003](../docs/decisions/0003-spa-pwa-on-vite.md), [0004](../docs/decisions/0004-styled-components-and-mantine.md), [0005](../docs/decisions/0005-tanstack-query-persisted-cache.md), [0006](../docs/decisions/0006-tanstack-router-code-based.md), [0007](../docs/decisions/0007-zod-and-own-form-hook.md), [0008](../docs/decisions/0008-dnd-kit-for-sorting.md), [0009](../docs/decisions/0009-pnpm-package-manager.md) |
| §3 Стек — бэкенд и хостинг | [0010](../docs/decisions/0010-supabase-without-own-backend.md), [0011](../docs/decisions/0011-manual-accounts-signup-off.md), [0012](../docs/decisions/0012-whole-dataset-in-client.md), [0005](../docs/decisions/0005-tanstack-query-persisted-cache.md) (офлайн), [0013](../docs/decisions/0013-cloudflare-hosting.md) |
| §4 Модель данных | [0014](../docs/decisions/0014-archiving-instead-of-deletes.md), [0015](../docs/decisions/0015-grant-plus-rls.md), [0016](../docs/decisions/0016-variants-and-active-variant.md), [0017](../docs/decisions/0017-nutrition-module-purity.md), [0018](../docs/decisions/0018-cook-log-snapshot-and-dates.md), [0019](../docs/decisions/0019-dish-categories-many-to-many.md), [0020](../docs/decisions/0020-recipe-content-and-backup.md), [0025](../docs/decisions/0025-code-structure-and-conventions.md) (перенос конвенций) |
| §5 UX | [0021](../docs/decisions/0021-mobile-first-ux.md) |
| §6 Локальная LLM — задел | [0028](../docs/decisions/0028-local-llm-assistant-deferred.md) |
| §6.5 Внешние источники КБЖУ | [0027](../docs/decisions/0027-external-nutrition-sources.md) |
| §6.7 Вес блюда | [0020](../docs/decisions/0020-recipe-content-and-backup.md) |
| §6.8 Мультиарендность и открытая регистрация | [0029](../docs/decisions/0029-multi-tenancy-deferred.md) |
| §7 Бытовые покупки | [0030](../docs/decisions/0030-household-purchases-deferred.md) |
| §7.5 Архитектура репозитория | [0022](../docs/decisions/0022-data-access-path-and-services.md), [0025](../docs/decisions/0025-code-structure-and-conventions.md), [0006](../docs/decisions/0006-tanstack-router-code-based.md) |
| §7.6 Слой данных | [0022](../docs/decisions/0022-data-access-path-and-services.md), [0023](../docs/decisions/0023-rpc-for-multi-step-writes.md), [0024](../docs/decisions/0024-no-external-state-store.md), [0012](../docs/decisions/0012-whole-dataset-in-client.md), [0007](../docs/decisions/0007-zod-and-own-form-hook.md), [0026](../docs/decisions/0026-work-split-lifted.md) |
| §7.7 Разделение работ снято | [0026](../docs/decisions/0026-work-split-lifted.md) |
| §8 Р-1 / Р-2 / Р-3 / Р-4 / Р-5 | [0004](../docs/decisions/0004-styled-components-and-mantine.md) / [0008](../docs/decisions/0008-dnd-kit-for-sorting.md) / [0010](../docs/decisions/0010-supabase-without-own-backend.md) / [0001](../docs/decisions/0001-personal-app-for-two.md) / [0019](../docs/decisions/0019-dish-categories-many-to-many.md) |
| §9 Журнал изменений | не перенесён: даты и содержание записей — в самих ADR, остальное — история git |
