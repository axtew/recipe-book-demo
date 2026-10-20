interface IVideoLink {
  url: string;
  label: string;
}

/**
 * Ссылки на видео для показа: только `http(s)`. Остальные схемы
 * (`javascript:`, `data:` и т. п.) и нечитаемые адреса пропускаются, а не
 * превращаются в `href`.
 *
 * Подпись — адрес площадки без `www.`.
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
