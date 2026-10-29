/**
 * Hands the text to the user as a downloadable file.
 *
 * Through a temporary Blob link and an invisible `<a download>`: neither a server nor dependencies
 * have any business here.
 */
export function downloadTextFile(fileName: string, content: string, mimeType: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Safari starts the download asynchronously: the link must not be revoked in the same tick.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
