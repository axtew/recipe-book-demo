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
  /** Ключи строк в текущем порядке. */
  keys: string[];
  onMove: (activeKey: string, overKey: string) => void;
  children: ReactNode;
}

/**
 * Вертикальный список с перетаскиванием за ручку мышью, пальцем и с клавиатуры.
 *
 * Стратегия вертикального списка, а не сеточная: строки разной высоты (шаги с
 * многострочным текстом) переставляются по реальным размерам.
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
