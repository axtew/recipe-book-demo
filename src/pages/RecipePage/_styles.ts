import { createLink } from "@tanstack/react-router";
import styled from "styled-components";

export const SPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
`;

export const STopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const SEditAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.primary};
  text-decoration: none;
`;

export const SEditLink = createLink(SEditAnchor);

export const SPhoto = styled.img`
  width: 100%;
  max-height: 280px;
  border-radius: 8px;
  object-fit: cover;
`;

export const SHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SBadge = styled.span`
  align-self: flex-start;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.palette.primaryMuted};
`;

export const SSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/** Notes keep line breaks as they were entered. */
export const SNotes = styled.div`
  white-space: pre-wrap;
`;

export const SPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 0;
  text-align: center;
`;
