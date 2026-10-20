import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type { IRecipeDraft } from "@/types/recipes.types";

import { areDraftsEqual, createEmptyDraft, createId } from "./_helpers";

function createDraft(): IRecipeDraft {
  return {
    ...createEmptyDraft(),
    name: "Борщ",
    servingsBase: 4,
    steps: [
      { key: "s1", text: "Нарезать" },
      { key: "s2", text: "Варить" },
    ],
    ingredients: [
      {
        key: "i1",
        productId: "p1",
        pinnedVariantId: null,
        amountGrams: 200,
        isOptional: false,
        note: "",
      },
      {
        key: "i2",
        productId: "p2",
        pinnedVariantId: null,
        amountGrams: 50,
        isOptional: true,
        note: "",
      },
    ],
  };
}

/** Тот же черновик с другим порядком ключей — на всех уровнях вложенности. */
function reverseKeys<T>(value: T): T {
  if (Array.isArray(value)) return value.map(reverseKeys) as T;
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .reverse()
        .map(([key, nested]) => [key, reverseKeys(nested)]),
    ) as T;
  }

  return value;
}

describe("areDraftsEqual", () => {
  it("равны при разном порядке ключей, в том числе во вложенных объектах", () => {
    const draft = createDraft();

    expect(areDraftsEqual(draft, reverseKeys(draft))).toBe(true);
  });

  it("не равны, если переставлены две строки состава", () => {
    const draft = createDraft();
    const swapped = { ...draft, ingredients: [...draft.ingredients].reverse() };

    expect(areDraftsEqual(draft, swapped)).toBe(false);
  });

  it("не равны, если переставлены два шага", () => {
    const draft = createDraft();
    const swapped = { ...draft, steps: [...draft.steps].reverse() };

    expect(areDraftsEqual(draft, swapped)).toBe(false);
  });

  it("undefined в поле и отсутствующее поле равны", () => {
    const draft = createDraft();
    // Черновик из localStorage может не содержать необязательное поле целиком.
    const withoutNotes = Object.fromEntries(
      Object.entries(draft).filter(([key]) => key !== "notes"),
    ) as IRecipeDraft;

    expect(
      areDraftsEqual({ ...draft, notes: undefined } as unknown as IRecipeDraft, withoutNotes),
    ).toBe(true);
  });

  it("не равны при отличии в одном вложенном поле (граммы ингредиента)", () => {
    const draft = createDraft();
    const changed = {
      ...draft,
      ingredients: [{ ...draft.ingredients[0], amountGrams: 201 }, draft.ingredients[1]],
    };

    expect(areDraftsEqual(draft, changed)).toBe(false);
  });
});

describe("createId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("без randomUUID отдаёт валидный UUID, два вызова различаются", () => {
    vi.stubGlobal("crypto", { getRandomValues: crypto.getRandomValues.bind(crypto) });

    const first = createId();
    const second = createId();

    expect(z.uuid().safeParse(first).success).toBe(true);
    expect(z.uuid().safeParse(second).success).toBe(true);
    expect(first).not.toBe(second);
  });

  it("с randomUUID отдаёт его результат", () => {
    expect(z.uuid().safeParse(createId()).success).toBe(true);
  });
});
