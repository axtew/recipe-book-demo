import styled from "styled-components";

export const SForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom);
`;

export const SField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

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

export const SActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const SSubmit = styled.button`
  flex: 1;
  min-height: 44px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const SCancel = styled.button`
  flex: 1;
  min-height: 44px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.text};
  cursor: pointer;
`;
