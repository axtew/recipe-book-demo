import type { ReactNode } from "react";

import { SShell } from "./_styles";

interface IProps {
  children: ReactNode;
}

/**
 * Каркас основного экрана: отцентрованная колонка до 600px, safe-area insets,
 * `100dvh` вместо `100vh` (на мобильном Safari `100vh` больше видимой области).
 */
export function AppLayout({ children }: IProps) {
  return <SShell>{children}</SShell>;
}
