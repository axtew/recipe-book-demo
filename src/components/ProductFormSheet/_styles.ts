import styled from "styled-components";

export const SForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom);
`;

export const SField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SInput = styled.input`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* 16px — иначе Safari на iOS зумит страницу при фокусе на поле. Не токен
     типографики: техническое ограничение платформы, а не размер из шкалы. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
`;

export const SSelect = styled.select`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* Тот же технический порог, что у SInput. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
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
