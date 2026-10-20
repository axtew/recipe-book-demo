/**
 * Отдаёт текст пользователю как скачиваемый файл.
 *
 * Через временную ссылку на Blob и невидимый `<a download>`: ни серверу, ни
 * зависимостям тут делать нечего.
 */
export function downloadTextFile(fileName: string, content: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Safari начинает скачивание асинхронно: ссылку нельзя отзывать в том же тике.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
