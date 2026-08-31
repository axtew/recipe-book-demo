import styled from "styled-components";

import { SBaseText } from "../_BaseText";

export const SH1 = styled(SBaseText).attrs({ as: "h1" })`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: 700;
  line-height: 1.25;
`;

export const SH2 = styled(SBaseText).attrs({ as: "h2" })`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: 700;
  line-height: 1.3;
`;

export const SH3 = styled(SBaseText).attrs({ as: "h3" })`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: 600;
  line-height: 1.35;
`;
