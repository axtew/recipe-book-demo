import { type RefObject, useLayoutEffect, useRef } from "react";

/**
 * Hook for using React data in callbacks without re-renders via a RefObject
 *
 * @param {T} value - Value
 * @returns {RefObject<T>} Ref with the data
 */
export function useLatest<T>(value: T): RefObject<T> {
  const latest = useRef(value);

  useLayoutEffect(() => {
    latest.current = value;
  }, [value]);

  return latest;
}
