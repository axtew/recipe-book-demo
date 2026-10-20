import styled from "styled-components";

import { TAB_BAR_HEIGHT_PX } from "@/components/TabBar";

export const SShell = styled.div`
  min-height: 100dvh;
  max-width: ${({ theme }) => theme.breakpoints.contentMaxWidth};
  margin: 0 auto;
  padding-top: env(safe-area-inset-top);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  /* Резерв под таб-бар, зафиксированный поверх контента, плюс системная полоса жестов iOS. */
  padding-bottom: calc(${TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom));
`;

export const SCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 100dvh;
  padding: 24px;
`;
