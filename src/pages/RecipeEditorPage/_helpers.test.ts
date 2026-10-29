import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type { IRecipeDraft } from "@/types/recipes.types";

import { areDraftsEqual, createEmptyDraft, createId } from "./_helpers";

function createDraft(): IRecipeDraft {
  return {
    ...createEmptyDraft(),
    name: "Borscht",
    servingsBase: 4,
    steps: [
      { key: "s1", text: "Chop" },
      { key: "s2", text: "Boil" },
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

/** The same draft with a different key order — at all nesting levels. */
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
  it("returns true with a different key order, including in nested objects", () => {
    const draft = createDraft();

    expect(areDraftsEqual(draft, reverseKeys(draft))).toBe(true);
  });

  it("returns false if two ingredient rows are swapped", () => {
    const draft = createDraft();
    const swapped = { ...draft, ingredients: [...draft.ingredients].reverse() };

    expect(areDraftsEqual(draft, swapped)).toBe(false);
  });

  it("returns false if two steps are swapped", () => {
    const draft = createDraft();
    const swapped = { ...draft, steps: [...draft.steps].reverse() };

    expect(areDraftsEqual(draft, swapped)).toBe(false);
  });

  it("treats undefined in a field and a missing field as equal", () => {
    const draft = createDraft();
    // A draft from localStorage may lack an optional field entirely.
    const withoutNotes = Object.fromEntries(
      Object.entries(draft).filter(([key]) => key !== "notes"),
    ) as IRecipeDraft;

    expect(
      areDraftsEqual({ ...draft, notes: undefined } as unknown as IRecipeDraft, withoutNotes),
    ).toBe(true);
  });

  it("returns false when one nested field differs (ingredient grams)", () => {
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

  it("without randomUUID returns a valid UUID, two calls differ", () => {
    vi.stubGlobal("crypto", { getRandomValues: crypto.getRandomValues.bind(crypto) });

    const first = createId();
    const second = createId();

    expect(z.uuid().safeParse(first).success).toBe(true);
    expect(z.uuid().safeParse(second).success).toBe(true);
    expect(first).not.toBe(second);
  });

  it("with randomUUID returns its result", () => {
    expect(z.uuid().safeParse(createId()).success).toBe(true);
  });
});
