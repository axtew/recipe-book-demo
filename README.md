# Книга рецептов

Личное mobile-first PWA-приложение: справочник продуктов, рецепты с расчётом КБЖУ, поиск, журнал готовки.

Продуктовые и архитектурные решения — `decisions.md`, план реализации — `plans/recipe-book-v1/plan.md`, конвенции кода — `.github/copilot-instructions.md`.

## Запуск

```bash
pnpm install
npx supabase start      # локальная база; нужен запущенный Docker
pnpm dev                # смотрит в локальную базу (.env.development)
```

## Команды

```bash
pnpm dev          # дев-сервер
pnpm build        # прод-сборка (tsc -b && vite build)
pnpm preview      # локальный просмотр собранного билда
pnpm lint         # ESLint
pnpm prettier     # форматирование
pnpm test         # vitest
pnpm db:reset     # пересоздать локальную БД из миграций + seed (требует Supabase CLI и Docker)
pnpm db:types     # перегенерировать src/types/database.types.ts из локальной схемы
```

## База данных

Схема, миграции и генерация типов — зона владельца проекта (`CLAUDE.md` → «Разделение работ»). После любой правки схемы типы перегенерируются командой `pnpm db:types` — руками `src/types/database.types.ts` не редактируется.
