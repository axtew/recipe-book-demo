Status: COMPLETED

# Фаза 11 — итерация 2 (правки по ревью)

1. `CookLogSheet` перенесён в `src/pages/RecipePage/_internal/CookLogAction/_internal/CookLogSheet/` (единственный потребитель — `CookLogAction`; ступень лестницы «внутри компонента-потребителя»). В `src/components/` ничего не осталось. Импорт в `_CookLogAction.tsx` — `./_internal/CookLogSheet`.
2. `FinishSheet/_types.ts`: `IFinishSheetProps`, `IUseFinishFormProps`, `TFinishFields`; `_useFinishForm.ts` и `_FinishSheet.tsx` импортируют оттуда.
3. `cookLog.months` в `I18n` — кортеж из 12 строк (индекс по числу остаётся, длина гарантирована типом; без `Date`/`Intl`).
4. `MULTIPLIER_MAX` объявлен один раз в `src/domain/schemas/_cookLogs.ts`, экспортирован через `@/domain/schemas`; схема и лист берут его оттуда; дубль в `_constants.ts` листа и второй комментарий удалены.
5. (необязательное) `FinishSheet` рендерится только в ветке `finishedAt === null` в `LogEntry`.

## Verification
- `pnpm lint` — чисто (после `eslint --fix` одного файла по порядку импортов).
- `pnpm test --run` — 11 файлов, 86/86.
- `pnpm build` — успешно (`built in 484ms`).
- Prettier — только по `src/pages/LogPage`, `src/pages/RecipePage`, `src/domain/schemas`, `src/types/i18n.types.ts`.
- Живая перепроверка на локальном стеке **не делалась**.
- `package.json`/lockfile не тронуты; Фаза 11.5 не затронута.
