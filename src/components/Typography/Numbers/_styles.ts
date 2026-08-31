import styled from "styled-components";

import { SBaseText } from "../_BaseText";

/** Крупная цифра — ккал на 100 г, самое заметное число в блоке КБЖУ. */
export const SNum1 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: 700;
  line-height: 1.2;
`;

/** Мелкая цифра — на порцию и на всё блюдо, рядом с крупной. */
export const SNum2 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: 600;
  line-height: 1.2;
`;
