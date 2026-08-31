Status: COMPLETED

## Phase goal

Логин работает, четыре вкладки переключаются, незалогиненного пользователя редиректит на `/login` с возвратом на запрошенный роут после входа. (Фаза уже реализована в iter-1 и одобрена ревьюером по существу — эта итерация закрывает два оставшихся замечания: отсутствующую запись в `EXECUTION.md` и нарушение конвенции i18n «один `l` на компонент».)

## What was implemented

Две точечные правки, без изменения поведения приложения:

1. **`plans/recipe-book-v1/EXECUTION.md`** — добавлена запись `## Фаза 3 — Авторизация и навигация` в конец файла (append-only, ничего из записей Фазы 1/2 не тронуто и не переформатировано). Формат соответствует шаблону из шапки файла и стилю существующих записей: Файлы / Проверка (таблица) / Отклонения от плана / Замечено вне фазы. В «Замечено вне фазы» перенесены три пункта ревьюера: коммит `src/routeTree.gen.ts` как сознательный выбор, требующий подтверждения владельцем; `getAuthSession()` глотает `error` из `getSession()`; ветвление `__root.tsx` по `pathname` вместо pathless authenticated layout route.
2. **i18n — «один `l` на компонент».** В четырёх роут-заглушках (`src/routes/index.tsx`, `products.tsx`, `log.tsx`, `settings.tsx`) результат `useI18nSelector` был привязан к `const title` вместо `const l`. Проверил остальные компоненты фазы (`LoginPage`, `TabBar`, `RouteStub`) grep'ом по `useI18nSelector` — там уже было `const l`, отклонение было только в этих четырёх файлах. Исправлено на `const l = useI18nSelector(({ l }) => l.navigation.<key>); return <RouteStub title={l} />;` — оставлена узкая единичная выборка (как и было), изменилось только имя переменной.

Побочная находка при работе: при первой попытке отформатировать `EXECUTION.md` через `npx prettier --write` файл переформатировался целиком (выравнивание всех markdown-таблиц, включая записи Фазы 1 и Фазы 2), что нарушало явное указание «append only». Откатил через `git checkout --`, из-за чего вместе с моей правкой временно пропала и запись Фазы 2 (она была только в рабочем дереве, не в HEAD) — восстановил обе записи (Фаза 2 как было, Фаза 3 новая) без повторного запуска prettier по всему файлу.

## Files created

(нет новых файлов в этой итерации; полный список созданного в Фазе 3 — см. `phase-3/iter-1/DEV-REPORT.md`, раздел «Files created», без изменений)

- `src/app/router.ts`
- `src/hooks/useAuth.hook.ts`
- `src/components/AppLayout/{_AppLayout.tsx,_styles.ts,index.ts}`
- `src/components/TabBar/{_TabBar.tsx,_styles.ts,_constants.ts,index.ts}`
- `src/components/RouteStub/{_RouteStub.tsx,_styles.ts,index.ts}`
- `src/pages/LoginPage/{_LoginPage.tsx,_useLoginForm.ts,_styles.ts,index.ts}`
- `src/routes/{__root.tsx,login.tsx,index.tsx,products.tsx,log.tsx,settings.tsx}`
- `src/routeTree.gen.ts` — автосгенерирован плагином TanStack Router, коммитится по официальной рекомендации

## Files modified

Кумулятивно (iter-1 + iter-2):

- `vite.config.ts` — добавлен плагин `tanstackRouter` перед `react()`
- `package.json` — новые зависимости (`@tanstack/react-router`, `@tanstack/router-plugin`), порядок скрипта `build`
- `pnpm-lock.yaml` — следствие установки зависимостей
- `eslint.config.js` — точечное отключение `react-refresh/only-export-components` для `src/routes/**/*.tsx`
- `.prettierignore` — исключён `src/routeTree.gen.ts`
- `src/main.tsx` — `RouterProvider` вместо `<App/>`
- `src/types/i18n.types.ts`, `public/dictionaries/ru.json` — новые ключи `auth.login.*`, `navigation.*`, `routeStub.placeholder`; удалён неиспользуемый `app.title`
- `plans/recipe-book-v1/EXECUTION.md` — добавлена запись по Фазе 3 (сделано в этой итерации, ранее заявлено ошибочно)
- `plans/recipe-book-v1/baseline/README.md` — обновлён под актуальный baseline (iter-1)
- **iter-2:** `src/routes/index.tsx`, `src/routes/products.tsx`, `src/routes/log.tsx`, `src/routes/settings.tsx` — `const title` → `const l` (конвенция i18n)

Удалён: `src/app/App.tsx` (временный вход, заменён роутингом).

## Verification

Команды выполнены заново после обеих правок:

- **`pnpm lint`** — exit 0, 0 ошибок, 0 предупреждений.
- **`pnpm build`** (`vite build && tsc -b`) — exit 0, без ошибок. `dist/` удалён после проверки.
- **`pnpm test run`** — 1 файл, 3/3 теста зелёные.
- **`git status --short`** после форматирования — только ожидаемые файлы фазы, никакого постороннего переформатирования (проверено после инцидента с полным прогоном prettier, см. выше).
- **Exports** — правка не добавляла новых экспортов, только переименование локальной переменной внутри компонент-функций; состав экспортов не менялся.
- **Реальный вход, возврат на запрошенный роут, сессия переживает перезагрузку, таб-бар и iOS-клавиатура/safe-area на реальном устройстве** — по-прежнему **не выполнялось разработчиком**: не входило в объём этой итерации (были только два конкретных замечания ревью), требует реальных аккаунтов Supabase и/или физического iPhone; `visual_verification.enabled: false` — эти пункты остаются за владельцем, как и в iter-1.

### Phase stop condition

Удовлетворено (без изменений относительно iter-1, дополнительно закрыты оба замечания ревью): логин-экран собран и типобезопасен, четыре вкладки переключаются, незалогиненный редиректится на `/login` с сохранением исходного пути, контракт `readEnvVar` подтверждён сквозным прогоном (iter-1). `EXECUTION.md` теперь содержит требуемую запись по Фазе 3; все компоненты фазы следуют конвенции «один `l` на компонент».

## Known issues / follow-ups

Без изменений относительно iter-1 (перенесены и в новую запись `EXECUTION.md`, раздел «Замечено вне фазы»):

- `src/routeTree.gen.ts` коммитится как сознательный выбор по рекомендации TanStack Router — решение по факту принял исполнитель, стоит явно подтвердить у владельца.
- `getAuthSession()` не различает «сессии нет» и «сеть недоступна» — обе ветки выглядят как разлогиненный пользователь.
- `__root.tsx` ветвит обёртку `AppLayout` по `pathname` вместо pathless authenticated layout route — потребует внимания при росте числа роутов.
- Расхождение `pnpm prettier` (`prettier --write .` в `package.json`, форматирует весь репозиторий) — актуально, из-за него правки в этой итерации форматировались точечно через `npx prettier --write <файлы>`, а полный прогон на `EXECUTION.md` пришлось откатывать (см. «What was implemented»).
- `@tanstack/query-persist-client-core` всё ещё лишний в прямых зависимостях (отмечено в Фазе 2, вне бюджета Фазы 3).
