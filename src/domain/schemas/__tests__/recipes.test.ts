import { describe, expect, it } from "vitest";

import { recipeInputSchema } from "../_recipes";

const videoUrlsSchema = recipeInputSchema.shape.videoUrls;

describe("recipeInputSchema.videoUrls", () => {
  it.each(["javascript:alert(1)", "data:text/html,x", "ftp://x.ru"])(
    "отклоняет ссылку с не-http(s) схемой: %s",
    (url) => {
      expect(videoUrlsSchema.safeParse([url]).success).toBe(false);
    },
  );

  it.each(["https://youtu.be/abc", "http://example.com/video"])("пропускает %s", (url) => {
    expect(videoUrlsSchema.safeParse([url]).success).toBe(true);
  });
});
