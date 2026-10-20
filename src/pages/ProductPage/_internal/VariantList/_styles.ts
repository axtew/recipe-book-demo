import styled from "styled-components";

export const SList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SVariant = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-height: 44px;
  padding: 12px;
  border: 1px solid
    ${({ $isActive, theme }) => ($isActive ? theme.palette.primary : theme.palette.border)};
  border-radius: 8px;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.palette.primaryMuted : theme.palette.surface};
  color: inherit;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

export const SHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
`;

export const SSingle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
`;
