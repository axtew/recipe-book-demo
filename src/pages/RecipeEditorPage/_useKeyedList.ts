import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";

interface IKeyed {
  key: string;
}

/**
 * A list of rows with stable keys: editing one row, removing, adding and reordering by keys rather
 * than by indices — the index changes when dragging.
 */
export function useKeyedList<T extends IKeyed>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);

  const add = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback((key: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const move = useCallback((activeKey: string, overKey: string) => {
    setItems((prev) => {
      const from = prev.findIndex((item) => item.key === activeKey);
      const to = prev.findIndex((item) => item.key === overKey);

      return from === -1 || to === -1 ? prev : arrayMove(prev, from, to);
    });
  }, []);

  return { items, add, update, remove, move };
}
