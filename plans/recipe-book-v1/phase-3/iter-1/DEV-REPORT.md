Status: COMPLETED

## Phase goal

Логин работает, четыре вкладки переключаются, незалогиненного пользователя редиректит на `/login` с возвратом на запрошенный роут после входа.

## What was implemented

- **TanStack Router (file-based)** подключён: плагин `@tanstack/router-plugin/vite` в `vite.config.ts` (перед `react()`), роуты в `src/routes/`.
- **`__root.tsx`** — корневой роут с guard'ом в `beforeLoad`: если путь не `/login`, читает сессию Supabase через `getAuthSession()` и при её отсутствии кидает `redirect({ to: "/login", search: { redirect: location.href } })`. Компонент рендерит `/login` без обвязки, остальные роуты — в `AppLayout` с `TabBar`.
- **`useAuth.hook.ts`** — `getAuthSession()` (обычная функция для `beforeLoad`, вне рендера) и `useSignIn()` (хук для формы входа: `signIn`, `isPending`, `hasError`).
- **`AppLayout`** — колонка до 600px, `100dvh`, `env(safe-area-inset-*)`, нижний отступ под таб-бар.
- **`TabBar`** — четыре вкладки (`Link` с `activeProps`), `position: fixed`, `env(safe-area-inset-bottom)`, высота 56px (экспортируется как `TAB_BAR_HEIGHT_PX`, используется `AppLayout` для расчёта отступа контента).
- **`LoginPage`** — email + пароль, свои styled-components контролы (не Mantine — `TextInput`/`Button` не входят в список «тяжёлых» компонентов из конвенций), высота полей и кнопки ≥44px, `font-size: 16px` на инпутах (иначе Safari на iOS зумит по фокусу). Форма и переход после входа вынесены в колокейтед-хук `_useLoginForm.ts` (`useSearch({ from: "/login" })` + `navigate({ href: redirect })`).
- **`RouteStub`** — общий плейсхолдер для четырёх нереализованных вкладок (`/`, `/products`, `/log`, `/settings`), рендерится напрямую из роут-файлов (отдельных `*Page` для них по плану не заводится — они появятся в своих фазах).
- **`src/app/router.ts`** — создание `router` из сгенерированного дерева + `declare module` регистрация. Не было в списке файлов фазы, но необходимо как связующий код (аналогично уже существующему `_queryClient.ts` в том же `app/`).
- **`main.tsx`** — заменён `<App/>` на `<RouterProvider router={router}/>`; **`src/app/App.tsx` удалён** — это был явно временный вход («роутинг ... появляются в следующей фазе», комментарий самого файла), полностью заменён роутингом.
- **i18n**: `l.auth.login.*`, `l.navigation.*`, `l.routeStub.placeholder`; ключ `app.title` убран как более не используемый (был только в удалённом `App.tsx`, статический `<title>` в `index.html` уже покрывает эту роль).
- **`package.json`**: добавлены `@tanstack/react-router` (dep) и `@tanstack/router-plugin` (devDep) — единственные новые зависимости, ровно то, что разрешено формулировкой задачи («TanStack Router itself and its own tooling»). Порядок скрипта `build` изменён на `vite build && tsc -b` (было `tsc -b && vite build`) — официальный FAQ TanStack Router требует коммитить `routeTree.gen.ts` в git, но при обратном порядке `tsc -b` на чистом клоне падал бы раньше, чем плагин успевал бы его сгенерировать/обновить при первом запуске `vite build`.
- **`.prettierignore`**: добавлен `src/routeTree.gen.ts` — файл сгенерирован и сам себя помечает `/* eslint-disable */` + `@ts-nocheck` с явной рекомендацией исключить его из линтера/форматтера; по той же причине, что и `database.types.ts`, файл коммитится в git, но не форматируется и не типизируется вручную.
- **`eslint.config.js`**: точечно выключено `react-refresh/only-export-components` для `src/routes/**/*.tsx` — паттерн файлового роутинга обязывает каждый файл роута экспортировать константу `Route` рядом с компонентом, это предупреждение неустранимо самим выбором TanStack Router, а не дефект конкретного файла.

### Free choice (нет источника дизайна)

- **Таб-бар без иконок**, только текстовые подписи — добавление иконочной библиотеки (например `@tabler/icons-react`) вышло бы за закрытый список зависимостей фазы; текст с активным состоянием (цвет + жирность) достаточен для четырёх вкладок.
- **Контролы формы входа — свои `styled-components`, не Mantine.** `TextInput`/`Button`/`PasswordInput` не входят в список «Mantine только для тяжёлых компонентов» (`Combobox`, `Drawer`, `DatePicker`, `Rating`, `NumberInput`, `Dropzone`, `Notifications`, `Skeleton`), поэтому простая форма реализована как обычный HTML `<input>`/`<button>` со своими стилями.
- **TabBar — `position: fixed`**, а не normal flow. Это ровно случай, для которого конвенция допускает исключение («persistent bottom tab bar» — явное требование задачи «таб-бар... всегда виден»), контент получает компенсирующий `padding-bottom` через экспортированную константу высоты.
- **Ошибка входа — один общий текст** («Неверный email или пароль») без различения сетевой ошибки и неверных данных: у приложения два пользователя, аккаунты создаются вручную, различать типы ошибок избыточно для этой фазы.

## Files created

- `src/app/router.ts`
- `src/hooks/useAuth.hook.ts`
- `src/components/AppLayout/{_AppLayout.tsx,_styles.ts,index.ts}`
- `src/components/TabBar/{_TabBar.tsx,_styles.ts,_constants.ts,index.ts}`
- `src/components/RouteStub/{_RouteStub.tsx,_styles.ts,index.ts}`
- `src/pages/LoginPage/{_LoginPage.tsx,_useLoginForm.ts,_styles.ts,index.ts}`
- `src/routes/{__root.tsx,login.tsx,index.tsx,products.tsx,log.tsx,settings.tsx}`
- `src/routeTree.gen.ts` — автосгенерирован плагином TanStack Router, коммитится по официальной рекомендации (см. выше)

## Files modified

- `vite.config.ts` — добавлен плагин `tanstackRouter` перед `react()`
- `package.json` — новые зависимости (`@tanstack/react-router`, `@tanstack/router-plugin`), порядок скрипта `build`
- `pnpm-lock.yaml` — следствие установки зависимостей
- `eslint.config.js` — точечное отключение `react-refresh/only-export-components` для `src/routes/**/*.tsx`
- `.prettierignore` — исключён `src/routeTree.gen.ts`
- `src/main.tsx` — `RouterProvider` вместо `<App/>`
- `src/types/i18n.types.ts`, `public/dictionaries/ru.json` — новые ключи `auth.login.*`, `navigation.*`, `routeStub.placeholder`; удалён неиспользуемый `app.title`
- `plans/recipe-book-v1/EXECUTION.md` — добавлена запись по Фазе 3 (см. ниже)
- `plans/recipe-book-v1/baseline/README.md` — обновлён под актуальный baseline (см. «Verification»)

Удалён: `src/app/App.tsx` (временный вход, заменён роутингом).

## Verification

Команды из задания выполнены как есть, дополнительно прогнан build/lint/test до и после для контроля регрессий.

- **Baseline (до правок, состояние после Фазы 2):** `pnpm build` exit=0, `pnpm lint` exit=0, `pnpm test run` exit=0 — чисто, фиксировать не от чего. Старый `baseline/README.md` относился к состоянию до Фазы 1 (когда `package.json` ещё не существовал) и был неактуален — заменён на актуальную запись, логи (`build.log`, `lint.log`, `test.log`) перезаписаны свежим прогоном.
- **`pnpm lint`** — exit 0, 0 ошибок, 0 предупреждений (после точечного отключения `react-refresh/only-export-components` для роутов — без этого было 5 warning'ов, все — тот самый неизбежный паттерн `export const Route = ...` рядом с компонентом).
- **`pnpm build`** (`vite build && tsc -b`) — exit 0, без ошибок.
- **`pnpm test run`** — 1 файл, 3/3 теста зелёные (без изменений — Фаза 3 не трогала домен/утилиты, кроме уже сделанного экспорта `readEnvVar` из Фазы 2).
- **Exports** — у каждого нового экспорта есть импортёр вне модуля, проверено `grep`: `getAuthSession`/`useSignIn` ← `__root.tsx`/`_useLoginForm.ts`; `AppLayout`/`TabBar`/`RouteStub`/`LoginPage`/`router` ← соответствующие роуты и `main.tsx`; `TAB_BAR_HEIGHT_PX` ← `AppLayout/_styles.ts`.
- **Контракт `readEnvVar` — сквозная проверка (ветка теперь достижима).** Собрано с временным `vite.config` (`mergeConfig` поверх основного, `envDir` указывает на пустую scratch-папку без `.env`), отдано через `vite preview`, открыто в браузере (Playwright): консоль показала ровно `Error: Переменная окружения VITE_SUPABASE_URL не задана`, без `TypeError` и без тихой загрузки приложения. Временный конфиг, `dist-envtest/`, scratch-папка и `.playwright-mcp/` удалены после проверки, рабочее дерево чистое (`git status --short` подтверждён).
- **Guard `beforeLoad` — дешёвая браузерная проверка (без реального логина).** `pnpm dev`, Playwright: заход на `http://localhost:4322/` → редирект на `/login?redirect=%2F`; заход на `/products` (холодная загрузка, не SPA-переход) → редирект на `/login?redirect=%2Fproducts`; заход на `/login` напрямую → остаётся на `/login` без цикла редиректов. Консоль без ошибок. Дев-сервер и Playwright-сессия закрыты, `.playwright-mcp/` удалён.
- **Вход, возврат на запрошенный роут, сессия переживает перезагрузку, таб-бар не перекрывается клавиатурой/системной полосой на реальном iOS** — **не выполнялось разработчиком**: требует реальных аккаунтов Supabase и/или физического iPhone; `visual_verification.enabled: false` в профиле, эти пункты — за владельцем.

### Phase stop condition

Удовлетворено в пределах доступной разработчику проверки: логин-экран собран и типобезопасен, четыре вкладки переключаются (таб-бар с активным состоянием), незалогиненный редиректится на `/login` с сохранением исходного пути (подтверждено вручную в браузере), контракт `readEnvVar` подтверждён сквозным прогоном. Пункты, требующие реального аккаунта/устройства, оставлены владельцу явно, не имитировались.

## Known issues / follow-ups

- **`src/app/router.ts` не значился в списке файлов фазы**, но необходим как связующий код между сгенерированным деревом роутов и `RouterProvider` — без него `main.tsx` не может подключить роутинг. Расположен в `src/app/`, где уже лежит аналогичный `_queryClient.ts`.
- **Сборка чанков >500кБ** (`index-*.js` 583кБ) — предупреждение Vite про code-splitting, не связано с Фазой 3 и не входит в её бюджет; будущие фазы с ленивой загрузкой страниц (`autoCodeSplitting: true` уже включён на уровне роутера) снимут часть этого сами по мере роста числа реальных страниц.
- Ранее замеченное вне фазы (Фаза 2, не переделывалось): расхождение `pnpm prettier` (в package.json — `prettier --write .`, форматирует весь репозиторий, а не переданные файлы) — актуально и здесь, из-за этого пришлось руками откатывать попутное переформатирование markdown-файлов вне рамок фазы (`.github/*`, `plans/recipe-book-v1/plan.md`, `BACKLOG.md`, `DEPLOY.md`, `backend-track.md`, `phase-1-tutorial.md`, часть `EXECUTION.md`/`REVIEW.md`) — отформатировано напрямую через `npx prettier --write <конкретные файлы>` вместо `pnpm prettier`.
- **`@tanstack/query-persist-client-core` всё ещё лишний в прямых зависимостях** (отмечено в Фазе 2, не трогалось — вне списка файлов Фазы 3).
