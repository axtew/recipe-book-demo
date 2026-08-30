# Baseline — recipe-book-v1

До начала Фазы 2 в репозитории не было `package.json` (Фаза 1 его не создала — см. `EXECUTION.md`), поэтому `pnpm build` и `pnpm lint` физически не могли быть выполнены.

- `build.log` — `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`, exit=1
- `lint.log` — `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`, exit=1

Никаких пред-существующих ошибок в коде фиксировать не от чего: кода не было. Все ошибки, обнаруженные при первом реальном прогоне `pnpm build` / `pnpm lint` в Фазе 2, — новые, вносимые этой фазой, и должны быть исправлены в её рамках.
