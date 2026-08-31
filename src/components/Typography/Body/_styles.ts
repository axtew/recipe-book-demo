import styled from "styled-components";

import { SBaseText } from "../_BaseText";

export const SB1 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: 400;
  line-height: 1.4;
`;

export const SB2 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: 400;
  line-height: 1.4;
`;

export const SB3 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: 400;
  line-height: 1.4;
`;
