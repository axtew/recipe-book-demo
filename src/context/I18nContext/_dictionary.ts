import type { I18n } from "@/types/i18n.types";

/**
 * Dictionary for code that lives outside React — currently the mutation error
 * handler in `queryClient`. The context is unreachable from there, yet the text
 * still belongs in the dictionary, not in code.
 *
 * Filled by the provider on load. Until then no screen is rendered, so `null`
 * only means "the dictionary is still on its way".
 */
let dictionary: I18n | null = null;

export function setDictionary(value: I18n) {
  dictionary = value;
}

export function getDictionary(): I18n | null {
  return dictionary;
}
