/**
 * Typescript-оптимизированный Object.entries
 *
 * @param obj
 * @returns
 */
export function getEntries<T extends object>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}
