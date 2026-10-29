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

/** Link to the recipe card; `createLink` keeps the router `params` typed. */
export const SRecipeLink = createLink(SAnchor);

export const SMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 12px;
`;

/** Notes keep line breaks as they were entered. */
export const SNote = styled.div`
  white-space: pre-wrap;
`;
