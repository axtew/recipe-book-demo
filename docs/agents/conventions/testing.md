# Тесты

`pnpm test` запускает vitest. Модуль расчёта КБЖУ (`src/domain/nutrition/`) должен проходить тесты в Node без DOM — он не импортирует React, Supabase и Mantine ([`data.md`](data.md) → «Чистота доменного модуля»).

Пайплайн проверяет `pnpm lint` и `pnpm build`; есть тесты — проходит и `pnpm test` ([`AGENTS.md`](../../../AGENTS.md)).
