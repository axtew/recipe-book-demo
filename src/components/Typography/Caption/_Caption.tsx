import type { ElementType, HTMLAttributes, PropsWithChildren } from "react";

import type { TTextColor } from "../_BaseText";
import { SCaption1, SCaption2 } from "./_styles";

interface ICaptionProps extends PropsWithChildren, HTMLAttributes<HTMLParagraphElement> {
  color?: TTextColor;
  /** Allows rendering the text with another tag — for example, `span` inside a link. */
  as?: ElementType;
}

export function Caption1({ children, color, ...rest }: ICaptionProps) {
  return (
    <SCaption1 $color={color} {...rest}>
      {children}
    </SCaption1>
  );
}

export function Caption2({ children, color, ...rest }: ICaptionProps) {
  return (
    <SCaption2 $color={color} {...rest}>
      {children}
    </SCaption2>
  );
}
