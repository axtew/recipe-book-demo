Status: COMPLETED

## Phase goal

Каркас приложения: проект собирается и запускается, провайдеры (TanStack Query с persist в IndexedDB, MantineProvider, styled-components ThemeProvider) на месте, PWA устанавливается, i18n-инфраструктура работает на единственном словаре `ru.json`, ESLint + Prettier настроены.

## What was implemented

- **Скаффолд Vite + React 19 + TypeScript strict**, ручная сборка `package.json` (Фаза 1 его не создала — см. «Дополнения» плана) с добавлением `supabase` в `devDependencies` и скриптов `db:reset` / `db:types` поверх обычного Vite-набора.
- **`vite.config.ts`**: алиас `@/` → `src/`, `vite-plugin-pwa` (`registerType: "autoUpdate"`, полный манифест с иконками и `lang: "ru"`).
- **Тема** (`src/theme/`): `_palette.ts`, `_typography.ts`, `_breakpoints.ts` — единственный источник значений; `_theme.ts` (styled-components), `_mantineTheme.ts` (Mantine `createTheme`) собираются из одних и тех же констант, `styled.d.ts` типизирует `DefaultTheme`, `_GlobalStyle.ts` — базовый CSS-сброс на `100dvh`.
- **`src/app/providers.tsx` + `_queryClient.ts`**: `QueryClient` с недельным `gcTime` (обоснование — нестабильная связность из Вьетнама, `decisions.md §3`), `PersistQueryClientProvider` + `createAsyncStoragePersister` поверх `idb-keyval` (адаптер `getItem/setItem/removeItem` под интерфейс `AsyncStorage`), `MantineProvider`, `ThemeProvider`, `GlobalStyle`, `I18nProvider` — в этом порядке.
- **`src/api/supabase.ts`** — типизированный клиент `createClient<Database>(...)`, использует `src/types/database.types.ts` (не редактировался) и `src/utils/env.ts`.
- **`src/utils/env.ts`** — типизированный доступ к `import.meta.env`, бросает понятную ошибку при отсутствующей переменной.
- **i18n-инфраструктура**: `public/dictionaries/ru.json`, `src/types/i18n.types.ts` (экспортирует только `I18n`), `src/context/I18nContext/` (`_context.ts`, `_I18nContext.tsx` — провайдер, грузит словарь через `fetch('/dictionaries/ru.json')` и показывает `Loader` до загрузки, `_useI18nSelector.ts`, барабан `index.ts`).
- **Точка входа** — `src/main.tsx` + `src/app/App.tsx`: минимальный экран, читает `l.app.title` через `useI18nSelector`, без роутинга/логина/таб-бара (Фаза 3).
- **ESLint** (`eslint.config.js`, flat config): `js.configs.recommended` + `tseslint.configs.recommended` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`, `eqeqeq: ["error", "always"]`.
- **Prettier** (`.prettierrc.json`, `.prettierignore` — исключены `supabase/migrations` и `src/types/database.types.ts`, которые не редактируются агентом).
- `public/favicon.svg`, `public/pwa-192x192.png`, `public/pwa-512x512.png` (сгенерированы программно — своих иконок/дизайна нет, «Free choice»), `public/_redirects` (`/* /index.html 200`), `.env.example`, `README.md`.
- `tsconfig.json` / `tsconfig.app.json` (strict, алиас `@/*`) / `tsconfig.node.json`.

### Free choice — судейские заметки

- **Иконки/favicon**: программно сгенерированный сплошной зелёный квадрат + простой SVG-контур миски — временная заглушка без дизайн-источника, легко заменить в любой следующей фазе.
- **Палитра** (`_palette.ts`): нейтральный тёплый фон + приглушённый зелёный как primary — не привязано ни к какому макету, свободный выбор для каркаса.

## Files created

- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`
- `index.html`, `README.md`, `.env.example`
- `public/favicon.svg`, `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/_redirects`, `public/dictionaries/ru.json`
- `src/vite-env.d.ts`, `src/main.tsx`
- `src/app/App.tsx`, `src/app/providers.tsx`, `src/app/_queryClient.ts`
- `src/api/supabase.ts`
- `src/utils/env.ts`
- `src/types/i18n.types.ts`
- `src/context/I18nContext/_context.ts`, `_I18nContext.tsx`, `_useI18nSelector.ts`, `index.ts`
- `src/theme/_palette.ts`, `_typography.ts`, `_breakpoints.ts`, `_theme.ts`, `_mantineTheme.ts`, `_GlobalStyle.ts`, `styled.d.ts`, `index.ts`
- `plans/recipe-book-v1/baseline/README.md`, `build.log`, `lint.log`
- `plans/recipe-book-v1/phase-2/iter-1/DEV-REPORT.md` (this report)

## Files modified

- `.gitignore` — добавлены `dev-dist/` (артефакт `vite-plugin-pwa` в dev-режиме) и `*.tsbuildinfo`.

Не создавались и не редактировались: `supabase/**`, `.env`, `src/types/database.types.ts`, `src/api/repositories/**` — по правилу разделения работ.

## Verification

Команды — ровно те, что в разделе «Проверка» фазы / `pipeline-profile.md` (`pnpm build`, `pnpm lint`), плюс `npx prettier --check .` как реализация требования «ESLint + Prettier».

- **`pnpm build`** — прошёл чисто (`tsc -b && vite build`): 890 модулей, `dist/manifest.webmanifest` и `dist/sw.js` сгенерированы (`vite-plugin-pwa`, режим `generateSW`, 8 записей в precache). Артефакт `dist/` удалён после проверки, в рабочем дереве не оставлен.
- **`pnpm lint`** — прошёл чисто, 0 ошибок/предупреждений. По пути исправлены 3 находки первого прогона (все внесены в этой же фазе, база сравнения пуста — см. `baseline/README.md`): вынос `I18nContext` из `_I18nContext.tsx` в `_context.ts` (react-refresh), лишняя `eslint-disable` директива, пустой `interface DefaultTheme extends TTheme {}` переписан как явный список полей.
- **`npx prettier --check .`** — из файлов, созданных/изменённых в этой фазе, форматирования требовали `tsconfig.json`, `src/app/providers.tsx`, `src/theme/_typography.ts` — приведены `prettier --write`, повторный `pnpm build` + `pnpm lint` после форматирования прошли чисто. Остальные найденные `--check` файлы — не тронутые этой фазой `.md`-документы репозитория, не трогались.
- **Экспорты** — все добавленные exports имеют импортёра внутри своего модуля/барреля, кроме `supabase` из `src/api/supabase.ts`: он не используется прямо сейчас, но это явно перечисленный файл именно этой фазы («`src/api/supabase.ts` — клиент»), потребитель — репозитории Фазы 5 (зона владельца). Оставлен как заявленный контракт фазы, не спекулятивный экспорт.
- **Установка на телефон / standalone-режим / Lighthouse** — не выполнялись разработчиком: `visual_verification.enabled: false` в `pipeline-profile.md`, эти проверки — за владельцем.
- **`useI18nSelector` отдаёт значение из `ru.json`** — не проверено вживую в браузере (не входит в обязанности разработчика при выключенной визуальной верификации), но по коду: `App.tsx` рендерит `l.app.title`, значение приходит из `I18nProvider`, который фетчит ровно `public/dictionaries/ru.json`; `pnpm build` подтверждает отсутствие типовых ошибок в этой цепочке. Видимых строк в JSX не осталось — единственный текстовый узел приложения (`l.title`) идёт из словаря.
- **Стоп-условие фазы** — выполнено: файлы из списка фазы созданы, поверх `package.json` добавлены `supabase` в `devDependencies` и скрипты `db:reset`/`db:types` (как того требует «Дополнения»), роутинг/логин/таб-бар Фазы 3 не создавались.

## Known issues / follow-ups

- **`idb-keyval` — дополнительная зависимость, не названная в `decisions.md` явно.** Стек фиксирует «TanStack Query v5 + `persistQueryClient` в IndexedDB», но не называет конкретную библиотеку-хранилище. `idb-keyval` — официально рекомендуемый TanStack Query адаптер для `createAsyncStoragePersister` поверх IndexedDB (~600 байт, без транзитивных зависимостей). Решил не останавливать фазу ради формального разрешения на эту деталь реализации уже одобренной фичи, но фиксирую здесь явно — если владелец сочтёт нужным иной подход (свой обёртка над `indexedDB` без сторонней библиотеки), это точечная правка одного файла (`src/app/_queryClient.ts`).
- **`src/api/supabase.ts` экспортирует `supabase` без текущего импортёра** — ожидаемо, это контракт для Фазы 5 (репозитории, зона владельца). См. «Verification → Экспорты».
- **Иконки и favicon — программные заглушки без дизайна** (`design.source: none` в профиле → всё «Free choice»). Можно заменить в любой момент, ничего от них не зависит.
- Планового расхождения с `.github/copilot-instructions.md` / текущим кодом не обнаружено — конвенции применялись впервые, прецедентов на конфликт ещё не было.
- **`@dnd-kit/*`, `zod`, TanStack Router** сознательно не устанавливались в этой фазе — по списку файлов Фазы 2 они не требуются каркасу (Router — явно Фаза 3, `zod`/`dnd-kit` — Фазы 4/8). **`vitest`** установлен в `devDependencies`, а `pnpm test` объявлен в `package.json`, чтобы команда из `pipeline-profile.md` не падала на отсутствии пакета — самих тестов пока нет, они появятся в Фазе 4 (модуль расчёта КБЖУ).
