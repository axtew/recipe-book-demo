import type { CSSProperties, ElementType, HTMLAttributes, PropsWithChildren } from "react";

import type { TTextColor } from "../_BaseText";
import { SB1, SB2, SB3 } from "./_styles";

interface IBodyProps extends PropsWithChildren, HTMLAttributes<HTMLParagraphElement> {
  color?: TTextColor;
  textAlign?: CSSProperties["textAlign"];
  /** Позволяет отрендерить текст другим тегом — например, `span` внутри кнопки. */
  as?: ElementType;
}

export function B1({ children, color, textAlign, ...rest }: IBodyProps) {
  return (
    <SB1 $color={color} $textAlign={textAlign} {...rest}>
      {children}
    </SB1>
  );
}

export function B2({ children, color, textAlign, ...rest }: IBodyProps) {
  return (
    <SB2 $color={color} $textAlign={textAlign} {...rest}>
      {children}
    </SB2>
  );
}

export function B3({ children, color, textAlign, ...rest }: IBodyProps) {
  return (
    <SB3 $color={color} $textAlign={textAlign} {...rest}>
      {children}
    </SB3>
  );
}
