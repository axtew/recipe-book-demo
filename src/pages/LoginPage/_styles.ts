import styled from "styled-components";

export const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px;
`;

export const STitle = styled.h1`
  margin: 0 0 24px;
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  color: ${({ theme }) => theme.palette.text};
  text-align: center;
`;

export const SForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.palette.textMuted};
`;

export const SInput = styled.input`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* 16px — иначе Safari на iOS зумит страницу при фокусе на поле. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
`;

export const SSubmit = styled.button`
  min-height: 44px;
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const SError = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.palette.danger};
`;
