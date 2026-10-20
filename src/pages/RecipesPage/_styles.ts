import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

import { TAB_BAR_HEIGHT_PX } from "@/components/TabBar";

const FAB_SIZE_PX = 56;
const FAB_OFFSET_PX = 16;

export const SPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Снизу — место под плавающую кнопку, чтобы она не накрывала последнюю карточку. */
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
  /* Колонка приложения центрирована и ограничена по ширине, а кнопка зафиксирована
     относительно окна: правый отступ считается от края колонки, а не экрана. */
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

  /* Плюс рисуется двумя полосами: подпись у кнопки в aria-label, а размера
     шрифта из шкалы для значка нет. */
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
