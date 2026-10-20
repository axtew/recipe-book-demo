import styled from "styled-components";

export const SItem = styled.div<{ $isDragging: boolean }>`
  position: relative;
  z-index: ${({ $isDragging }) => ($isDragging ? 1 : 0)};
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 8px 8px 8px 0;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
  box-shadow: ${({ $isDragging }) => ($isDragging ? "0 4px 16px rgba(0, 0, 0, 0.15)" : "none")};
`;

/**
 * Ручка захвата. `touch-action: none` обязателен: без него на телефоне жест
 * перетаскивания превращается в прокрутку страницы вместе с элементом.
 */
export const SHandle = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  min-height: 44px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.textMuted};
  cursor: grab;
  touch-action: none;
`;

export const SContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
