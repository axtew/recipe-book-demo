import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

import { TAB_BAR_HEIGHT_PX } from "@/components/TabBar";

const FAB_SIZE_PX = 56;
const FAB_OFFSET_PX = 16;

export const SPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* At the bottom — room for the floating button so it does not cover the last card. */
  padding: 16px 16px calc(${FAB_SIZE_PX + 2 * FAB_OFFSET_PX}px + env(safe-area-inset-bottom));
`;

export const SHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

export const SPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
  text-align: center;
`;

const SFabAnchor = styled.a`
  position: fixed;
  bottom: calc(${TAB_BAR_HEIGHT_PX}px + env(safe-area-inset-bottom) + ${FAB_OFFSET_PX}px);
  /* The app column is centered and limited in width, while the button is fixed
     relative to the window: the right offset is counted from the column edge, not the screen. */
  right: max(
    ${FAB_OFFSET_PX}px,
    calc((100vw - ${({ theme }) => theme.breakpoints.contentMaxWidth}) / 2 + ${FAB_OFFSET_PX}px)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${FAB_SIZE_PX}px;
  height: ${FAB_SIZE_PX}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
  box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
  text-decoration: none;

  /* The plus is drawn with two bars: the button label is in aria-label, and there is no
     font size from the scale for an icon. */
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 2px;
    border-radius: 1px;
    background: currentcolor;
  }

  &::after {
    transform: rotate(90deg);
  }
`;

export const SFab = createLink(SFabAnchor);
