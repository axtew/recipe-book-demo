import { useCallback, useEffect, useRef, useState } from "react";

import { recipeDraftSchema } from "@/domain/schemas";
import type { IRecipeDraft } from "@/types/recipes.types";

/** Задержка перед записью черновика: пока человек печатает, localStorage не дёргается. */
const DRAFT_SAVE_DELAY_MS = 500;

function getDraftKey(recipeId: string | null): string {
  return `recipe-draft:${recipeId ?? "new"}`;
}

/**
 * Читает черновик из localStorage. Нечитаемый или не прошедший схему черновик
 * удаляется и считается отсутствующим.
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
 * Автосохранение черновика рецепта в localStorage под ключом
 * `recipe-draft:${recipeId ?? "new"}`.
 *
 * `storedDraft` — черновик, найденный при открытии редактора; читается один раз.
 * `saveDraft` откладывает запись на 500 мс и перезаписывает ещё не записанный
 * вызов; несброшенная запись дописывается при уходе со страницы и при закрытии
 * вкладки. Хранилище может быть недоступно (приватный режим, переполнение) —
 * тогда запись молча пропускается: черновик это удобство, а не данные.
 *
 * `clearDraft` удаляет запись, но редактирование продолжается и черновик
 * пишется дальше. `finishDraft` — для успешного сохранения: удаляет запись и
 * отключает любую запись до размонтирования, иначе обновлённый после сохранения
 * рецепт мог бы поставить в очередь новую запись, которую допишет размонтирование.
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
      // Хранилище недоступно — черновик не сохранится, редактор продолжает работать.
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
      // Нечего удалять, если хранилище недоступно.
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
