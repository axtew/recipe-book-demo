import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";

import { SList } from "./_styles";

interface IProps {
  /** Row keys in the current order. */
  keys: string[];
  onMove: (activeKey: string, overKey: string) => void;
  children: ReactNode;
}

/**
 * A vertical list with dragging by a handle with mouse, finger and keyboard.
 *
 * A vertical-list strategy, not a grid one: rows of different height (steps with multi-line text)
 * are reordered by their real sizes.
 */
export function SortableList({ keys, onMove, children }: IProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (over !== null && active.id !== over.id) onMove(String(active.id), String(over.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={keys} strategy={verticalListSortingStrategy}>
        <SList>{children}</SList>
      </SortableContext>
    </DndContext>
  );
}
