import type { HTMLAttributes, PropsWithChildren } from "react";

import type { TTextColor } from "../_BaseText";
import { SNum1, SNum2 } from "./_styles";

interface INumbersProps extends PropsWithChildren, HTMLAttributes<HTMLParagraphElement> {
  color?: TTextColor;
}

export function Num1({ children, color, ...rest }: INumbersProps) {
  return (
    <SNum1 $color={color} {...rest}>
      {children}
    </SNum1>
  );
}

export function Num2({ children, color, ...rest }: INumbersProps) {
  return (
    <SNum2 $color={color} {...rest}>
      {children}
    </SNum2>
  );
}
