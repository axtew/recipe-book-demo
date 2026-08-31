import { Link } from "@tanstack/react-router";
import styled from "styled-components";

import { TAB_BAR_HEIGHT_PX } from "./_constants";

export const SBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.contentMaxWidth};
  display: flex;
  background: ${({ theme }) => theme.palette.surface};
  border-top: 1px solid ${({ theme }) => theme.palette.border};
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
`;

export const SLink = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${TAB_BAR_HEIGHT_PX}px;
  color: ${({ theme }) => theme.palette.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.palette.primary};
    font-weight: 600;
  }
`;
