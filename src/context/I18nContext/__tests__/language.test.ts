import { describe, expect, it } from "vitest";

import { detectLanguage } from "../_language";

describe("detectLanguage", () => {
  it("gives Russian to a Russian browser", () => {
    expect(detectLanguage(null, "ru-RU")).toBe("ru");
    expect(detectLanguage(null, "ru")).toBe("ru");
  });

  it("ignores the case of the browser language", () => {
    expect(detectLanguage(null, "RU-ru")).toBe("ru");
  });

  it("gives English to any other browser language", () => {
    expect(detectLanguage(null, "en-US")).toBe("en");
    expect(detectLanguage(null, "de-DE")).toBe("en");
    expect(detectLanguage(null, "uk-UA")).toBe("en");
    expect(detectLanguage(null, "")).toBe("en");
  });

  it("prefers a stored choice over the browser language", () => {
    expect(detectLanguage("ru", "en-US")).toBe("ru");
    expect(detectLanguage("en", "ru-RU")).toBe("en");
  });

  it("ignores a stored value that is not a known language", () => {
    expect(detectLanguage("fr", "ru-RU")).toBe("ru");
    expect(detectLanguage("", "en-US")).toBe("en");
  });
});
