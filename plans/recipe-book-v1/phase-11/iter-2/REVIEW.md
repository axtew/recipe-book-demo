MODE: review
STATUS: APPROVED
Issue source: none

## Summary
Итерация 2: все пять пунктов ревью iter-1 закрыты, регрессий не найдено. Повторно прогнаны `pnpm lint` (чисто), `pnpm test --run` (86/86), `pnpm build` (успешно); `package.json` и lockfile содержат только два одобренных пакета, `@mantine/dates` и `dayjs`.

## Проверка пунктов iter-1
- Размещение `CookLogSheet`: лист лежит в `src/pages/RecipePage/_internal/CookLogAction/_internal/CookLogSheet/`, барель экспортирует только компонент, `src/components/CookLogSheet` отсутствует, ссылок на старый путь в коде нет. Упоминание `src/components/CookLogSheet/` в исходном списке файлов плана (plan.md:886) перекрыто записью в «Дополнениях».
- `FinishSheet/_types.ts` создан (`IFinishSheetProps`, `IUseFinishFormProps`, `TFinishFields`); `_FinishSheet.tsx` и `_useFinishForm.ts` типов не объявляют, импортируют оттуда.
- `cookLog.months`: кортеж из двенадцати `string` в `src/types/i18n.types.ts`; чтение `l.months[group.month - 1]` в `_MonthGroup.tsx:19` типобезопасно по длине, build проходит.
- Предел множителя: `MULTIPLIER_MAX` объявлен один раз в `src/domain/schemas/_cookLogs.ts:50`, экспортирован через `@/domain/schemas`, используется схемой (`:55`) и листом (`_CookLogSheet.tsx:100`). Дубля в `_constants.ts` нет. У экспорта есть внешний импортёр.
- `FinishSheet` монтируется только в ветке `finishedAt === null` (`_LogEntry.tsx:90-108`).

## Повторный просмотр всего диффа
- Слой данных: компонент -> мутация/запрос -> сервис -> supabase; `createCookLog` и `finishCookLog` в сервисе, снимок проходит `nutritionSnapshotSchema.parse`, сырая форма строки не выходит за сервис, удалений нет.
- `cookLogInputSchema` связана с интерфейсом через `satisfies z.ZodType<ICookLogInput>`.
- Даты: везде строки `YYYY-MM-DD`, `getTodayDate` собирает местные части; `domain/stats` перенесён в домен и импортирует только типы.
- Экспорты: у каждого нового экспорта есть внешний импортёр, барели содержат только компоненты.
- i18n: одна `l` на компонент, селектор `({ l })`, формулировки без рода; единственный словарь обновлён.
- Комментарии русские, без следов пайплайна.
- Зависимости: новых, кроме одобренных, нет.

## Notes
- Не блокирует. В `LogEntry` лист «Другая дата» теперь размонтируется, как только `finishedAt` становится не `null`. Закрытие (`onSaved`) вызывается сразу после `mutateAsync`, а инвалидация кеша обновляет запись позже, поэтому анимация закрытия Drawer, скорее всего, успевает начаться. Стоит один раз проверить руками на iPhone, что лист не обрывается рывком.
- Не блокирует, перенесено в Фазу 11.5 по решению владельца: общие стили кнопок и листов (дубли `SForm`/`SField`/`SActions`/`SSubmit`/`SCancel`), высота Mantine-полей (44px), выравнивание версий Mantine.
- Не блокирует: ввод «1,5» вручную в `NumberInput` и вид `dropdownType="modal"` поверх `Drawer` на iOS проверены только функционально; живая перепроверка в iter-2 не делалась (правки структурные, поведение не менялось).
