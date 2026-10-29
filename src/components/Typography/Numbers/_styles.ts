import styled from "styled-components";

import { SBaseText } from "../_BaseText";

/** A large number — kcal per 100 g, the most prominent number in the nutrition block. */
export const SNum1 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: 700;
  line-height: 1.2;
`;

/** A small number — per portion and per whole dish, next to the large one. */
export const SNum2 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: 600;
  line-height: 1.2;
`;
