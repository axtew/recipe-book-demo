import { useCallback, useEffect, useRef, useState } from "react";

import { recipeDraftSchema } from "@/domain/schemas";
import type { IRecipeDraft } from "@/types/recipes.types";

/** Delay before writing the draft: while the person is typing, localStorage is not hammered. */
const DRAFT_SAVE_DELAY_MS = 500;

function getDraftKey(recipeId: string | null): string {
  return `recipe-draft:${recipeId ?? "new"}`;
}

/**
 * Reads the draft from localStorage. A draft that is unreadable or fails the schema
 * is deleted and treated as absent.
 */
function readDraft(key: string): IRecipeDraft | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;

    const result = recipeDraftSchema.safeParse(JSON.parse(raw));
    if (result.success) return result.data;

    localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }

  return null;
}

/**
 * Autosave of the recipe draft to localStorage under the key
 * `recipe-draft:${recipeId ?? "new"}`.
 *
 * `storedDraft` — the draft found when the editor opened; read once.
 * `saveDraft` defers the write by 500 ms and overwrites a call that has not yet been
 * written; a pending write is flushed on leaving the page and on closing the
 * tab. The storage may be unavailable (private mode, overflow) —
 * then the write is silently skipped: a draft is a convenience, not data.
 *
 * `clearDraft` deletes the entry, but editing continues and the draft
 * keeps being written. `finishDraft` is for a successful save: it deletes the entry and
 * disables any writing until unmount, otherwise the recipe updated after saving
 * could queue a new write that the unmount would flush.
 */
export function useRecipeDraft(recipeId: string | null) {
  const key = getDraftKey(recipeId);

  const [storedDraft] = useState(() => readDraft(key));
  const pendingRef = useRef<IRecipeDraft | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFinishedRef = useRef(false);

  const writePending = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (pendingRef.current === null || isFinishedRef.current) return;

    try {
      localStorage.setItem(key, JSON.stringify(pendingRef.current));
    } catch {
      // The storage is unavailable — the draft will not be saved, the editor keeps working.
    }

    pendingRef.current = null;
  }, [key]);

  const saveDraft = useCallback(
    (draft: IRecipeDraft) => {
      if (isFinishedRef.current) return;

      pendingRef.current = draft;

      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(writePending, DRAFT_SAVE_DELAY_MS);
    },
    [writePending],
  );

  const clearDraft = useCallback(() => {
    pendingRef.current = null;

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to delete if the storage is unavailable.
    }
  }, [key]);

  const finishDraft = useCallback(() => {
    isFinishedRef.current = true;
    clearDraft();
  }, [clearDraft]);

  useEffect(() => {
    window.addEventListener("pagehide", writePending);

    return () => {
      window.removeEventListener("pagehide", writePending);
      writePending();
    };
  }, [writePending]);

  return { storedDraft, saveDraft, clearDraft, finishDraft };
}
