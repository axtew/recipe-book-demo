import styled from "styled-components";

import { TAB_BAR_HEIGHT_PX } from "@/components/TabBar";

/**
 * Плашка прилипает к низу экрана над таб-баром: пока форма прокручивается,
 * цифры остаются на виду. Отступ слева и справа возвращает ширину страницы.
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
