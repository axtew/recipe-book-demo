import { useContext } from "react";

import type { I18n } from "@/types/i18n.types";

import { I18nContext } from "./_context";

/**
 * Selects a narrow slice of the dictionary — a component subscribes to the
 * branch it needs, not to the whole `I18n`.
 */
export function useI18nSelector<T>(selector: (args: { l: I18n }) => T): T {
  const l = useContext(I18nContext);

  if (l === null) {
    throw new Error(
      "useI18nSelector called outside I18nProvider or before the dictionary is loaded",
    );
  }

  return selector({ l });
}
