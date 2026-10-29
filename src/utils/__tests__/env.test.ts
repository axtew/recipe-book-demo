import { afterEach, describe, expect, it, vi } from "vitest";

import { readEnvVar } from "../env";

describe("readEnvVar", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws a readable error if the key is not in import.meta.env", () => {
    vi.stubEnv("VITE_SUPABASE_URL", undefined);

    expect(() => readEnvVar("VITE_SUPABASE_URL")).toThrowError(
      "Environment variable VITE_SUPABASE_URL is not set",
    );
  });

  it("throws the same error if the value is an empty string", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "");

    expect(() => readEnvVar("VITE_SUPABASE_URL")).toThrowError(
      "Environment variable VITE_SUPABASE_URL is not set",
    );
  });

  it("returns the value if the key is set", () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");

    expect(readEnvVar("VITE_SUPABASE_URL")).toBe("https://example.supabase.co");
  });
});
