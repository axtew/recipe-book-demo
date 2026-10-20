import { describe, expect, it } from "vitest";

import { getVideoLinks } from "./_helpers";

describe("getVideoLinks", () => {
  it("оставляет http и https, подпись — хост без www", () => {
    expect(getVideoLinks(["https://www.youtube.com/watch?v=1", "http://example.com/a"])).toEqual([
      { url: "https://www.youtube.com/watch?v=1", label: "youtube.com" },
      { url: "http://example.com/a", label: "example.com" },
    ]);
  });

  it("пропускает другие схемы и нечитаемые адреса", () => {
    expect(
      getVideoLinks(["javascript:alert(1)", "data:text/html,x", "не ссылка", "https://ok.ru/v"]),
    ).toEqual([{ url: "https://ok.ru/v", label: "ok.ru" }]);
  });

  it("на пустом списке возвращает пустой список", () => {
    expect(getVideoLinks([])).toEqual([]);
  });
});
