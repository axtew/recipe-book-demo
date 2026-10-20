import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

export const SWarning = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.palette.danger};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
`;

export const SList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: ${({ theme }) => theme.palette.primary};
  text-decoration: underline;
`;

export const SProductLink = createLink(SAnchor);
