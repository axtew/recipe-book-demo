import type { CSSProperties } from "react";
import styled from "styled-components";

/** Ключи палитры, пригодные для цвета текста. */
export type TTextColor = "text" | "textMuted" | "primary" | "danger";

/** Общая база для всех компонентов типографики: цвет из палитры и выравнивание. */
export const SBaseText = styled.p<{
  $color?: TTextColor;
  $textAlign?: CSSProperties["textAlign"];
}>`
  margin: 0;
  color: ${({ $color, theme }) => ($color ? theme.palette[$color] : "inherit")};
  text-align: ${({ $textAlign = "inherit" }) => $textAlign};
`;
