Status: COMPLETED

## Phase goal

Закрыть дефект `FORM-1`: перенести из `Carbon-spa` обещанный конвенциями `useForm` (с девятью адаптациями под этот проект), перевести три существующие формы (`LoginPage`, `ProductFormSheet`, `VariantFormSheet`) на него, вынести нативный `<select>` в общий `src/components/Select/`, перевести `ArchiveConfirm` на общий `SBottomSheetDrawer`. Делается до Фазы 8, пока формы ещё маленькие.

## What was implemented

- Перенесены зависимости хука: `src/hooks/useLatest.hook.ts` (без изменений), `src/utils/helpers/objectGetters.ts` (только `getEntries` — единственный используемый геттер), `src/types/common.types.ts` (только `TSetState`).
- Перенесён `src/hooks/useForm/` целиком (`_types.ts`, `_helpers.ts`, `_useForm.hook.ts`, `index.ts`) с девятью пронумерованными адаптациями из плана и четырьмя комментариями `FIXME` на местах «странно, но не меняется» (общий `isDirty` расходится с полевым; `validator` видит значение до `formatter`; нетронутую форму нельзя отправить; правки во время `saveOnChange` помечаются сохранёнными вместе со всей формой).
- Три формы (`LoginPage`, `ProductFormSheet`, `VariantFormSheet`) переведены на `useForm`. Внешний контракт хуков (что возвращают, какие поля/сеттеры) сохранён — компоненты `_LoginPage.tsx` и `_VariantFormSheet.tsx` не тронуты, как и предписывал список файлов фазы. `_ProductFormSheet.tsx` тронут только ради общего `Select`.
- `src/components/Select/` — общий нативный `<select>` (`SSelect`), перенесён из `ProductFormSheet/_styles.ts`.
- `src/pages/ProductPage/_internal/ArchiveConfirm/` — переведён на общий `SBottomSheetDrawer`, третья копия одного и того же переопределения высоты `Drawer` убрана.

### UIKit wrappers

Новых `styled(<UIKitPrimitive>)`-обёрток фаза не вводит — использует уже существующий `SBottomSheetDrawer` (заведён в Фазе 7) и добавляет `SSelect` — обёртку над нативным `<select>`, не UIKit-примитивом, конвенция про UIKit-обёртки на неё не распространяется.

## Files created

- `src/hooks/useLatest.hook.ts`
- `src/utils/helpers/objectGetters.ts`
- `src/types/common.types.ts`
- `src/hooks/useForm/_types.ts`
- `src/hooks/useForm/_helpers.ts`
- `src/hooks/useForm/_useForm.hook.ts`
- `src/hooks/useForm/index.ts`
- `src/components/Select/_styles.ts`
- `src/components/Select/index.ts`

## Files modified

- `src/pages/LoginPage/_useLoginForm.ts` — переведён на `useForm`, внешний контракт (`email`/`password`/`isPending`/`hasError`/`setEmail`/`setPassword`/`handleSubmit`) не изменился
- `src/components/ProductFormSheet/_useProductForm.ts` — переведён на `useForm`; `error`-баннер и его сброс при открытии остались локальным `useState` вне хука
- `src/components/VariantFormSheet/_useVariantForm.ts` — то же самое
- `src/components/ProductFormSheet/_ProductFormSheet.tsx` — импортирует `SSelect` из `@/components/Select` вместо локального
- `src/components/ProductFormSheet/_styles.ts` — локальный `SSelect` убран
- `src/pages/ProductPage/_internal/ArchiveConfirm/_ArchiveConfirm.tsx` — использует `SBottomSheetDrawer` вместо локального `SDrawer`
- `src/pages/ProductPage/_internal/ArchiveConfirm/_styles.ts` — локальный `SDrawer` убран
- `plans/recipe-book-v1/EXECUTION.md` — добавлена запись по Фазе 7.5

`src/components/ProductFormSheet/_types.ts` и `src/components/VariantFormSheet/_types.ts` из списка файлов фазы в итоге не потребовали правок: внешний контракт возвращаемых хуками объектов не изменился.

## Verification

Команды — ровно из раздела «Проверка» плана.

- **`pnpm lint`** — exit 0, чисто (0 pre-existing в baseline, новых не внесено).
- **`pnpm build`** (`vite build && tsc -b`) — exit 0. То же предупреждение о чанке >500 кБ, что было в baseline (Фаза 6/7).
- **`pnpm test`** (vitest) — 2 файла, 32/32 зелёные (фаза не заводит новых тестов).
- **API хука совпадает с оригиналом, отличия — только девять адаптаций** — сверено построчно с `Carbon-spa/src/utils/hooks/useForm/`, см. «Решения, принятые по ходу» в `EXECUTION.md`.
- **Четыре `FIXME` на месте** — `grep -c FIXME src/hooks/useForm/_useForm.hook.ts` → 4.
- **Ни один хук формы не содержит собственного сравнения для сброса, кроме `useForm`** — подтверждено: `resetOn` в `useForm` — единственное место, сравнивающее `isOpened` ради сброса *полей*; локальный `wasOpened` в двух формах остался только для сброса отдельного `error`-баннера (вне `useForm` по дизайну).
- **`grep` по `styled.select` и по переопределению высоты `Drawer` — по одному совпадению на проект** — подтверждено (`src/components/Select/_styles.ts` и `src/components/BottomSheetDrawer/_styles.ts` соответственно).
- **Поведение трёх форм не изменилось** — `LoginPage` проверен живым прогоном в браузере на локальном стеке Supabase (Docker поднят, `npx supabase start`, пользователь `dev@recipe-book.local`): неверный пароль → баннер ошибки, кнопка остаётся кликабельной без изменения полей (подтверждает адаптацию №8 — форма не запирается после неудачи); верный пароль → редирект на `/`. `ProductFormSheet`/`VariantFormSheet` живым прогоном не проверялись — у обоих по-прежнему нет потребителя, монтирующего их в дерево (подключение в Фазе 8, названное исключение ещё с Фазы 7) — открыть лист через UI не из чего; поведение проверено по коду и типам.
- **Exports** — все новые экспорты имеют импортёра вне своего модуля (`getEntries`, `useLatest`, `TSetState`, `useForm`, `SSelect`, `SBottomSheetDrawer` — все используются). `TUseFormState` сознательно не вынесен в барrel `useForm/index.ts` — текущим трём потребителям он не нужен (вывод типов работает без явной аннотации), появится с первым, кому понадобится (вероятно, Фаза 8).
- **Phase stop condition** — удовлетворено.
- **Runtime/browser** — частично выполнено разработчиком (только `LoginPage`, локальный стенд); `visual_verification.enabled: false` в профиле, отдельного визуального прохода в проекте нет.

## Known issues

- `ProductFormSheet`/`VariantFormSheet` не проверены живым прогоном — ограничение унаследовано от Фазы 7 (нет потребителя, монтирующего их в дерево до Фазы 8), не новое для этой фазы.
- Тип обработчика `onSubmit` хука — `SubmitEvent<HTMLFormElement>`, а не `React.FormEvent<HTMLFormElement>`, как в оригинале Carbon-spa. План явно этого не называет среди девяти адаптаций, но `<form onSubmit>` в установленной версии `@types/react` (19.2) типизирован через `SubmitEventHandler`, весь проект уже на этом типе (коммит `7966414`, формы Фазы 7) — без правки сборка не прошла бы.
- `@tanstack/query-persist-client-core` по-прежнему в прямых зависимостях (отмечено с Фазы 2, вне scope этой фазы).
- `STATUS.md` не тронут — закрывает ревью владельца.
