import type { CSSProperties } from "react";
import styled from "styled-components";

/** Palette keys suitable for the text color. */
export type TTextColor = "text" | "textMuted" | "primary" | "danger";

/** Common base for all typography components: palette color and alignment. */
export const SBaseText = styled.p<{
  $color?: TTextColor;
  $textAlign?: CSSProperties["textAlign"];
}>`
  margin: 0;
  color: ${({ $color, theme }) => ($color ? theme.palette[$color] : "inherit")};
  text-align: ${({ $textAlign = "inherit" }) => $textAlign};
`;
