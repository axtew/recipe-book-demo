/** Подпись пункта «Создать «{запрос}»» с подставленным текстом поиска. */
export function buildCreateOptionLabel(template: string, query: string): string {
  return template.replace("{query}", query.trim());
}
