/** Label of the `Create “{query}”` item with the search text substituted in. */
export function buildCreateOptionLabel(template: string, query: string): string {
  return template.replace("{query}", query.trim());
}
