import styled from "styled-components";

import { SBaseText } from "../_BaseText";

export const SCaption1 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: 400;
  line-height: 1.3;
`;

export const SCaption2 = styled(SBaseText)`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: 400;
  line-height: 1.3;
`;
