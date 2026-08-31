import styled from "styled-components";

export const SStub = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 100dvh;
  padding: 16px;
  text-align: center;
`;

export const STitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.palette.text};
`;

export const SPlaceholder = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.palette.textMuted};
`;
