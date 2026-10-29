import { describe, expect, it } from "vitest";

import { recipeInputSchema } from "../_recipes";

const videoUrlsSchema = recipeInputSchema.shape.videoUrls;

describe("recipeInputSchema.videoUrls", () => {
  it.each(["javascript:alert(1)", "data:text/html,x", "ftp://x.ru"])(
    "rejects a link with a non-http(s) scheme: %s",
    (url) => {
      expect(videoUrlsSchema.safeParse([url]).success).toBe(false);
    },
  );

  it.each(["https://youtu.be/abc", "http://example.com/video"])("accepts %s", (url) => {
    expect(videoUrlsSchema.safeParse([url]).success).toBe(true);
  });
});
