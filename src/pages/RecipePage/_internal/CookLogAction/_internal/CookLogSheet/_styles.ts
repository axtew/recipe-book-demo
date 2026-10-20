import styled from "styled-components";

export const SPresets = styled.div`
  display: flex;
  gap: 8px;
`;

export const SPreset = styled.button<{ $isActive: boolean }>`
  flex: 1;
  min-height: 44px;
  border: 1px solid
    ${({ theme, $isActive }) => ($isActive ? theme.palette.primary : theme.palette.border)};
  border-radius: 8px;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.palette.primaryMuted : theme.palette.surface};
  color: ${({ theme }) => theme.palette.text};
  cursor: pointer;
`;

export const SRatingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const SClearRating = styled.button`
  min-height: 44px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.primary};
  cursor: pointer;
`;
