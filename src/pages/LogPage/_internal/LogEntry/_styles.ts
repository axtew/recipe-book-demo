import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

export const SItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
`;

export const SHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

const SAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: ${({ theme }) => theme.palette.primary};
  text-decoration: none;
`;

/** Ссылка на карточку рецепта; `createLink` сохраняет типизацию `params` роутера. */
export const SRecipeLink = createLink(SAnchor);

export const SMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
`;

/** Заметки хранят переносы строк, как их ввели. */
export const SNote = styled.div`
  white-space: pre-wrap;
`;

export const SActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const SButton = styled.button`
  flex: 1;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const SOutlineButton = styled.button`
  flex: 1;
  min-height: 44px;
  border: 1px solid ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.primary};
  cursor: pointer;
`;
