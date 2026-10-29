import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

export const SList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SItem = styled.li`
  display: flex;
`;

const SAnchor = styled.a`
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
  color: inherit;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 2px;
  }
`;

/**
 * Link to the recipe card.
 *
 * Built with `createLink` rather than `styled(Link)`: the styled-components wrapper erases the
 * router generics, and the typed `params` stop being checked.
 */
export const SLink = createLink(SAnchor);
