import { Drawer } from "@mantine/core";
import styled from "styled-components";

/**
 * Лист снизу под высоту содержимого.
 *
 * Mantine задаёт нижнему Drawer'у фиксированную высоту из своей шкалы размеров,
 * а здесь содержимое меняется: список рецептов бывает пустым и бывает длинным.
 * Специфичность поднимается через `&&`, как и для любого переопределения кита.
 */
export const SDrawer = styled(Drawer)`
  && .mantine-Drawer-content {
    height: auto;
    max-height: 90dvh;
  }
`;

export const SContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: env(safe-area-inset-bottom);
`;

export const SRecipes = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding-left: 20px;
`;

export const SActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const SConfirm = styled.button`
  flex: 1;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.danger};
  color: ${({ theme }) => theme.palette.surface};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const SCancel = styled.button`
  flex: 1;
  min-height: 44px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.text};
  cursor: pointer;
`;
