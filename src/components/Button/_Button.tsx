import { B2 } from "@/components/Typography";

import { SButton } from "./_styles";
import type { IButtonProps } from "./_types";

/** Project button: a label, a kind by the role of the action, height of at least 44px. */
export function Button({ variant, isInline, children, ...rest }: IButtonProps) {
  return (
    <SButton $variant={variant} $isInline={isInline} {...rest}>
      <B2 as="span">{children}</B2>
    </SButton>
  );
}
