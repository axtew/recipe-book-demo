# Typing

## Strong types

Domain types and component props declare their real fields. `unknown` in any position (`unknown`, `unknown[]`, `Record<string, unknown>`, an `unknown` field) means the shape was not looked up — find it and type it instead of widening. `unknown` is acceptable only in a generic utility that accepts any shape by design; `any` and unexplained `as` assertions are not acceptable anywhere.

**Where to look it up.** The database shapes live in the generated `src/types/database.types.ts` (regenerated with `pnpm db:types`, never hand-edited); the project's own entity interfaces live in `src/types/<domain>.types.ts`. One of the two answers every "what fields does this have" question about persisted data.

**The one place this rule is easy to break here:** a `jsonb` column arrives in the generated types as the recursive `Json` union, which carries no fields at all. Widening it to `unknown` or `Record<string, unknown>` and moving on is exactly the failure this rule names — such a column has a real shape, it is declared as an interface in `src/types/`, and it is validated with its zod schema at the boundary.

When the keys of a map are bounded by an enum, type the map as `Record<EEnumName, ValueType>` (or `Partial<Record<EEnumName, ValueType>>` if not all enum members are present). Default to enum-typed records over `Record<string, X>` whenever an enum exists. Match this style for any new colour / category / lookup map.

Where global and local types live — [`structure.md`](structure.md).
