interface IVideoLink {
  url: string;
  label: string;
}

/**
 * Video links for display: `http(s)` only. Other schemes (`javascript:`, `data:` and the like) and
 * unreadable addresses are skipped rather than turned into an `href`.
 *
 * The label is the platform address without `www.`.
 */
export function getVideoLinks(urls: string[]): IVideoLink[] {
  return urls.flatMap((url) => {
    try {
      const { protocol, hostname } = new URL(url);

      if (protocol !== "http:" && protocol !== "https:") return [];

      return [{ url, label: hostname.replace(/^www\./, "") }];
    } catch {
      return [];
    }
  });
}
