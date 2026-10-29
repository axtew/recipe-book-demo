import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

import { SContent, SHandle, SItem } from "./_styles";

interface IProps {
  id: string;
  handleLabel: string;
  children: ReactNode;
}

/** A sortable list row: a handle on the left, the content on the right. */
export function SortableItem({ id, handleLabel, children }: IProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <SItem
      ref={setNodeRef}
      $isDragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <SHandle
        ref={setActivatorNodeRef}
        type="button"
        aria-label={handleLabel}
        {...attributes}
        {...listeners}
      >
        <svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="4" r="1.6" />
          <circle cx="11" cy="4" r="1.6" />
          <circle cx="3" cy="10" r="1.6" />
          <circle cx="11" cy="10" r="1.6" />
          <circle cx="3" cy="16" r="1.6" />
          <circle cx="11" cy="16" r="1.6" />
        </svg>
      </SHandle>
      <SContent>{children}</SContent>
    </SItem>
  );
}
