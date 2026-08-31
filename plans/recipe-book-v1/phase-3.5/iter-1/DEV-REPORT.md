Status: COMPLETED

## Phase goal
Роутинг переведён с file-based на code-based (одно место сборки дерева, без кодогенерации), и типографика оформлена как переиспользуемые компоненты `src/components/Typography/`, так что ни один экран больше не задаёт размер шрифта литералом. Оба изменения должны попасть в проект до Фазы 6.

## What was implemented

**Роутинг.** `src/routes/_paths.ts` — единый объект `routerPaths` со всеми путями (пять текущих: `login`, `home`, `products`, `log`, `settings`). `src/routes/_routes.tsx` — фабричные функции `createCommonRoutes(rootRoute)` и `createProtectedRoutes(protectedLayoutRoute)`, лежащие рядом с единственным потребителем. `src/routes/AppRouter.tsx` — корневой роут, pathless layout-роут защищённой части (`id: "protected-layout"`, без сегмента в URL) с guard'ом в `beforeLoad`, сборка дерева, `createRouter`, декларация `Register`. Guard редиректит неавторизованного на `/login` с сохранением `location.href` в `search.redirect`; логин-роут, в свою очередь, редиректит авторизованного на главную. `src/routes/layouts/AppLayout/` — переезд `AppLayout` из `src/components/` (это часть роутинга, не переиспользуемый компонент), логика и вёрстка не менялись.

Циклический импорт между `AppRouter.tsx` и `_routes.tsx` устранён фабричными функциями, принимающими родительский роут параметром, — буквальное прочтение плана (`_routes.tsx` экспортирует готовые массивы, `AppRouter.tsx` их импортирует, а `_routes.tsx` в свою очередь импортирует `rootRoute`/`protectedLayoutRoute` из `AppRouter.tsx`) дало бы циклическую ES-модульную зависимость. Зависимость теперь однонаправленная: `AppRouter.tsx` → `_routes.tsx`.

**Типографика.** `src/components/Typography/` по образцу `Carbon-spa/src/uikit/Typography`, без сторибука и без слоя `uikit/`: `_BaseText.ts` (общая база, цвет — ключ палитры `text | textMuted | primary | danger`, по умолчанию `inherit`, а не принудительный; `textAlign`), `Head/` (`H1`, `H2`, `H3`), `Body/` (`B1`, `B2`, `B3`, с опциональным `as` для рендера как `span`), `Caption/` (`Caption1`, `Caption2`, тоже с `as`), `Numbers/` (`Num1` — крупная цифра, `Num2` — мельче). Размеры и начертания собраны из уже существующих `src/theme/_typography.ts` `fontSizes` (xs…xl) плюс литеральные `font-weight`/`line-height` — новых токенов в теме не заводилось. В отличие от Carbon-spa (где `theme.palette.text` — вложенный объект нескольких цветов), в этом проекте палитра плоская, поэтому `TTextColor` — сужение по ключам самой палитры, а не по `theme.palette.text`.

Существующие экраны переведены на эти компоненты: `RouteStub` (`H1` + `B1`), `LoginPage` (`H1`, `Caption2` для подписей полей, `B3` для ошибки, `B2 as="span"` для текста кнопки), `TabBar` (`Caption2 as="span"` в каждой вкладке, цвет наследуется от родительской ссылки — активное состояние по-прежнему красится через `.active` на `SLink`). Единственное сохранённое исключение — `SInput` в `LoginPage/_styles.ts`: `font-size: 16px` литералом, техническое ограничение iOS Safari (без него — зум страницы при фокусе на поле), не относится к типографической шкале.

**Мелкие правки.** `getAuthSession()` теперь логирует `console.warn` при ошибке `getSession()` перед возвратом «нет сессии» — раньше истёкший refresh-токен и обрыв сети выглядели одинаково и молча. `package.json` получил скрипт `format` (`prettier --write src`), `.github/pipeline-profile.md` теперь ссылается на `pnpm format` вместо `pnpm prettier --write <files>` (последний форматирует весь репозиторий и на это дважды натыкались в Фазе 2).

### UIKit wrappers
Не вводились — компоненты `Typography/` сами являются новым семейством, не обёрткой над существующим UIKit-примитивом. В проекте нет отдельного слоя UIKit (только Mantine для тяжёлых компонентов и project-компоненты), это соответствует конвенции.

## Files created
- `src/routes/_paths.ts` — объект `routerPaths`
- `src/routes/_routes.tsx` — `createCommonRoutes`, `createProtectedRoutes`, четыре компонента-заглушки экранов
- `src/routes/AppRouter.tsx` — корневой роут, защищённый layout-роут, сборка дерева, `router`, `Register`
- `src/routes/layouts/AppLayout/{_AppLayout.tsx,_styles.ts,index.ts}` — переезд из `src/components/AppLayout/`
- `src/components/Typography/_BaseText.ts` — общая база (`SBaseText`, `TTextColor`)
- `src/components/Typography/Head/{_Head.tsx,_styles.ts,index.ts}` — `H1`, `H2`, `H3`
- `src/components/Typography/Body/{_Body.tsx,_styles.ts,index.ts}` — `B1`, `B2`, `B3`
- `src/components/Typography/Caption/{_Caption.tsx,_styles.ts,index.ts}` — `Caption1`, `Caption2`
- `src/components/Typography/Numbers/{_Numbers.tsx,_styles.ts,index.ts}` — `Num1`, `Num2`
- `src/components/Typography/index.ts` — баррел всей семьи

## Files modified
- `vite.config.ts` — убран плагин `tanstackRouter`
- `src/main.tsx` — импорт `router` из `@/routes/AppRouter` вместо `@/app/router`
- `src/hooks/useAuth.hook.ts` — `getAuthSession()` логирует ошибку `getSession()`
- `package.json` — добавлен скрипт `format`; из `devDependencies` убран `@tanstack/router-plugin`
- `pnpm-lock.yaml` — синхронизирован после `pnpm remove @tanstack/router-plugin`
- `.github/pipeline-profile.md` — `commands.format` указывает на `pnpm format`
- `.prettierignore` — убрана строка `src/routeTree.gen.ts` (файла больше нет)
- `src/components/RouteStub/{_RouteStub.tsx,_styles.ts}` — текст через `H1`/`B1`, убран литеральный `font-size`
- `src/pages/LoginPage/{_LoginPage.tsx,_styles.ts}` — текст через `H1`/`Caption2`/`B3`/`B2`, убран литеральный `font-size` кроме `SInput` (см. выше)
- `src/components/TabBar/{_TabBar.tsx,_styles.ts}` — текст вкладок через `Caption2`, пути через `routerPaths` вместо строковых литералов, убран литеральный `font-size`

## Files deleted
- `src/routeTree.gen.ts`, `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/routes/login.tsx`, `src/routes/products.tsx`, `src/routes/log.tsx`, `src/routes/settings.tsx`, `src/app/router.ts`
- `src/components/AppLayout/` (каталог целиком, после переезда в `src/routes/layouts/AppLayout/`)

## Verification results

Команды — ровно те, что перечислены в разделе «Проверка» фазы.

- **`pnpm lint`** — exit 0, чисто.
- **`pnpm build`** (`vite build && tsc -b`) — exit 0, чисто.
- **`pnpm test run`** — 1 файл, 3/3 теста зелёные.
- **`routeTree.gen.ts` отсутствует** — подтверждено (`ls` → No such file).
- **Плагин `tanstackRouter` убран из `vite.config.ts`** — подтверждено (`grep` не находит ни `tanstackRouter`, ни `router-plugin` ни в `vite.config.ts`, ни в `package.json`).
- **`font-size` вне `Typography/` и `theme/`** — `grep -rn "font-size" src/pages src/components | grep -v Typography` даёт одно совпадение: `src/pages/LoginPage/_styles.ts:31` (`SInput`, задокументированное исключение iOS anti-zoom).
- **`pnpm format` затрагивает только `src`** — запущен, `git status` после запуска показал изменения только внутри `src/**` (форматирование самим прогоном не изменило ни одного файла вне `src`, конфиги/lock-файл не тронуты).
- **Экспорты** — grep-проверка по каждому новому символу. У `routerPaths`, `AppLayout`, `createCommonRoutes`, `createProtectedRoutes`, `router`, `H1`, `B1`, `B2`, `B3`, `Caption2` есть импортёр вне модуля определения. У `H2`, `H3`, `Caption1`, `Num1`, `Num2` импортёра в этой фазе нет — названное исключение (см. «Known issues» и запись в `EXECUTION.md`): построение всей типографической семьи — определение этой фазы, будущие потребители поимённо указаны в плане (`H2`/`H3` — заголовки Фазы 6+, `Num1`/`Num2` — крупные цифры КБЖУ, явно названы в Фазе 9, `Caption1` — подписи покрупнее `Caption2`).
- **Guard без вспышки защищённого экрана** — проверено в браузере (Playwright, `pnpm dev`, реальный запрос к `localhost:5173`, не screenshot): `/` → `/login?redirect=%2F`; `/products` (холодная загрузка) → `/login?redirect=%2Fproducts`; `/log` → `/login?redirect=%2Flog`; `/settings` → `/login?redirect=%2Fsettings`. Во всех случаях итоговый DOM — `LoginPage`, никакой защищённый компонент не успевает смонтироваться (guard в `beforeLoad`, до рендера дерева); консоль без ошибок и предупреждений.
- **Прямой заход на каждый из пяти путей** — все пять отработали (четыре защищённых корректно редиректят на логин с сохранением исходного пути, `/login` рендерит форму входа).
- **Таб-бар скрыт на логине** — подтверждено снимком доступности (accessibility snapshot): на `/login` в дереве нет навигации, только форма.
- **Реальный вход, возврат на запрошенный путь, сессия после перезагрузки, переключение четырёх вкладок под сессией, таб-бар на реальном iPhone** — не выполнялось разработчиком: нужен реальный аккаунт Supabase и физическое устройство, `visual_verification.enabled: false` (тот же список, что и в Фазе 3).
- **Visual Verification** — N/A по профилю проекта, ревьюер не задействован.

`.playwright-mcp` за собой удалён, дев-сервер остановлен.

## Known issues / follow-ups
- Названное исключение по экспорту `H2`/`H3`/`Caption1`/`Num1`/`Num2` — использование ожидается с Фазы 6 (и явно — с Фазы 9 для `Numbers`). Не блокер, зафиксировано, чтобы ревьюер не искал импортёров, которых пока не может быть.
- `SInput` сохраняет литеральный `font-size: 16px` — единственное сознательное отступление от «нет font-size вне Typography», технически обязательное для iOS (иначе Safari зумит страницу при фокусе на поле ввода — прямое нарушение приоритета iOS из `CLAUDE.md`).
- Список файлов фазы не включал `src/pages/LoginPage/**`, `src/components/RouteStub/**`, `src/components/TabBar/**`, но собственная проверка фазы («не осталось объявлений font-size вне Typography») требовала их правки — иначе типографика существовала бы отдельно от уже написанных экранов. Сделано в рамках заявленной цели фазы, не расширения объёма (аналогичная ситуация была в Фазе 3 с `src/app/router.ts`, не значившимся в списке).
- Ранее замеченное (Фаза 3): `getAuthSession()` глотал ошибку `getSession()` — закрыто этой фазой.
- Ранее замеченное (Фаза 2–3): `pnpm prettier` форматирует весь репозиторий, а не переданные файлы — закрыто добавлением скоупнутого `pnpm format`; старый скрипт `prettier` в `package.json` не убирался (план не просил), но профиль пайплайна ссылается только на новый.
- `@tanstack/query-persist-client-core` всё ещё лишний в прямых зависимостях (замечено в Фазе 2, вне списка файлов этой фазы — не трогалось).
- Реальный вход, сессия после перезагрузки, переключение вкладок под сессией, таб-бар на живом iPhone — переносятся на владельца, как и в Фазе 3.
