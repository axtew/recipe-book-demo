import styled from "styled-components";

export const SPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
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
  gap: 8px;
`;

export const SArchiveButton = styled.button`
  min-height: 44px;
  border: 1px solid ${({ theme }) => theme.palette.danger};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.danger};
  cursor: pointer;
`;

export const SPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 0;
  text-align: center;
`;
