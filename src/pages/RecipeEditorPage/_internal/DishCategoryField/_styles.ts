import styled from "styled-components";

export const SChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SChip = styled.button<{ $isSelected: boolean }>`
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid
    ${({ $isSelected, theme }) => ($isSelected ? theme.palette.primary : theme.palette.border)};
  border-radius: 999px;
  background: ${({ $isSelected, theme }) =>
    $isSelected ? theme.palette.primaryMuted : theme.palette.surface};
  color: ${({ theme }) => theme.palette.text};
  cursor: pointer;
`;
