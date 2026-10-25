import { DatesProvider } from "@mantine/dates";
import type { ReactNode } from "react";

import { useLanguage } from "@/context/I18nContext";

interface IProps {
  children: ReactNode;
}

/**
 * Calendar locale follows the UI language; the week starts on Monday in both.
 * The Russian dayjs locale is registered in `main.tsx`, the English one is built in.
 */
export function LocalizedDatesProvider({ children }: IProps) {
  const { language } = useLanguage();

  return (
    <DatesProvider settings={{ locale: language, firstDayOfWeek: 1 }}>{children}</DatesProvider>
  );
}
