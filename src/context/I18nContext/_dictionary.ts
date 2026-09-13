import type { I18n } from "@/types/i18n.types";

/**
 * Словарь для кода, живущего вне React, — сейчас это обработчик ошибок мутаций
 * в `queryClient`. Контекст оттуда недоступен, а текст всё равно должен лежать
 * в словаре, а не в коде.
 *
 * Заполняется провайдером при загрузке. До этого момента ни один экран не
 * отрендерен, поэтому `null` здесь означает только «словарь ещё едет».
 */
let dictionary: I18n | null = null;

export function setDictionary(value: I18n) {
  dictionary = value;
}

export function getDictionary(): I18n | null {
  return dictionary;
}
