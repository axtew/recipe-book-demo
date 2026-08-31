import { afterEach, describe, expect, it, vi } from "vitest";

import { readEnvVar } from "../env";

describe("readEnvVar", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("бросает читаемую ошибку, если ключа нет в import.meta.env", () => {
    vi.stubEnv("VITE_SUPABASE_URL", undefined);

    expect(() => readEnvVar("VITE_SUPABASE_URL")).toThrowError(
      "Переменная окружения VITE_SUPABASE_URL не задана",
    );
  });

  it("бросает ту же ошибку, если значение — пустая строка", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");

    expect(() => readEnvVar("VITE_SUPABASE_URL")).toThrowError(
      "Переменная окружения VITE_SUPABASE_URL не задана",
    );
  });

  it("возвращает значение, если ключ задан", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");

    expect(readEnvVar("VITE_SUPABASE_URL")).toBe("https://example.supabase.co");
  });
});
