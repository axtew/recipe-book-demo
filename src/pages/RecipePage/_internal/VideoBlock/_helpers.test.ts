import { describe, expect, it } from "vitest";

import { getVideoLinks } from "./_helpers";

describe("getVideoLinks", () => {
  it("keeps http and https, the label is the host without www", () => {
    expect(getVideoLinks(["https://www.youtube.com/watch?v=1", "http://example.com/a"])).toEqual([
      { url: "https://www.youtube.com/watch?v=1", label: "youtube.com" },
      { url: "http://example.com/a", label: "example.com" },
    ]);
  });

  it("skips other schemes and unreadable addresses", () => {
    expect(
      getVideoLinks(["javascript:alert(1)", "data:text/html,x", "not a link", "https://ok.ru/v"]),
    ).toEqual([{ url: "https://ok.ru/v", label: "ok.ru" }]);
  });

  it("returns an empty list for an empty list", () => {
    expect(getVideoLinks([])).toEqual([]);
  });
});
