import styled from "styled-components";

import { TAB_BAR_HEIGHT_PX } from "@/components/TabBar";

/**
 * The bar sticks to the bottom of the screen above the tab bar: while the form scrolls, the numbers
 * stay in view. The left and right offset restores the page width.
 */
export const SBar = styled.div`
  position: sticky;
  bottom: calc(${TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 -16px;
  padding: 8px 16px;
  border-top: 1px solid ${({ theme }) => theme.palette.border};
  background: ${({ theme }) => theme.palette.surface};
`;

export const SLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;

  & > :first-child {
    flex: none;
    width: 72px;
  }
`;
