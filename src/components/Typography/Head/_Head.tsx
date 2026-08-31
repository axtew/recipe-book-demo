import type { CSSProperties, HTMLAttributes, PropsWithChildren } from "react";

import type { TTextColor } from "../_BaseText";
import { SH1, SH2, SH3 } from "./_styles";

interface IHeadProps extends PropsWithChildren, HTMLAttributes<HTMLHeadingElement> {
  color?: TTextColor;
  textAlign?: CSSProperties["textAlign"];
}

export function H1({ children, color, textAlign, ...rest }: IHeadProps) {
  return (
    <SH1 $color={color} $textAlign={textAlign} {...rest}>
      {children}
    </SH1>
  );
}

export function H2({ children, color, textAlign, ...rest }: IHeadProps) {
  return (
    <SH2 $color={color} $textAlign={textAlign} {...rest}>
      {children}
    </SH2>
  );
}

export function H3({ children, color, textAlign, ...rest }: IHeadProps) {
  return (
    <SH3 $color={color} $textAlign={textAlign} {...rest}>
      {children}
    </SH3>
  );
}
