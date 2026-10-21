# Книга рецептов

Личное mobile-first PWA-приложение: справочник продуктов, рецепты с расчётом КБЖУ, поиск, журнал готовки.

Как пользоваться приложением — `docs/user-guide.md`. Продуктовые и архитектурные решения — `docs/decisions/`, план реализации — `plans/recipe-book-v1/plan.md`, как устроена разработка — `plans/README.md`, конвенции кода и правила для агентов — `AGENTS.md`.

## Запуск

```bash
pnpm install
npx supabase start      # локальная база; нужен запущенный Docker
pnpm dev                # смотрит в локальную базу (.env.development)
```

## Команды

```bash
pnpm dev          # дев-сервер
pnpm dev:prod     # дев-сервер против облака — только смотреть
pnpm build        # прод-сборка (vite build && tsc -b)
pnpm preview      # локальный просмотр собранного билда
pnpm lint         # ESLint
pnpm prettier     # форматирование всего репозитория
pnpm format       # форматирование src/
pnpm test         # vitest
pnpm db:reset     # пересоздать локальную БД из миграций + seed (требует Supabase CLI и Docker)
pnpm db:types     # перегенерировать src/types/database.types.ts из локальной схемы
```

## База данных

Миграции и слой данных пишут исполнители и применяют их к локальной базе; в облако (`npx supabase db push`) миграции выкатывает владелец, он же ведёт файлы `.env*` (`docs/agents/conventions/data.md` → «Миграции и разделение работ»). После любой правки схемы типы перегенерируются командой `pnpm db:types` — руками `src/types/database.types.ts` не редактируется.
