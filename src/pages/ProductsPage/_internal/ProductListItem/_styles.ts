import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

export const SItem = styled.li`
  display: flex;
`;

const SAnchor = styled.a`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 44px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
  color: inherit;
  text-decoration: none;
`;

/**
 * Link of the product card.
 *
 * Built with `createLink` rather than `styled(Link)`: the styled-components wrapper erases the
 * router generics, and the typed `params` stop being checked.
 */
export const SLink = createLink(SAnchor);

export const SHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;
