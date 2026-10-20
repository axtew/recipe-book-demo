import type { ReactNode } from "react";

import { H2 } from "@/components/Typography";

import { SSection } from "./_styles";

interface IProps {
  title: string;
  children: ReactNode;
}

/** Блок экрана настроек: заголовок и содержимое колонкой. */
export function Section({ title, children }: IProps) {
  return (
    <SSection>
      <H2>{title}</H2>
      {children}
    </SSection>
  );
}
