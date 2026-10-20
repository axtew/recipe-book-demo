import styled from "styled-components";

export const SForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom);
`;

export const SPicker = styled.div`
  display: flex;
  justify-content: center;
`;

export const SActions = styled.div`
  display: flex;
  gap: 8px;
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
