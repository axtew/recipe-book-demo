import type { ReactNode } from "react";

import { H2 } from "@/components/Typography";

import { SSection } from "./_styles";

interface IProps {
  title: string;
  children: ReactNode;
}

/** A block of the settings screen: a heading and the content in a column. */
export function Section({ title, children }: IProps) {
  return (
    <SSection>
      <H2>{title}</H2>
      {children}
    </SSection>
  );
}
