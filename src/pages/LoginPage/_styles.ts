import styled from "styled-components";

export const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px;
`;

export const SForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
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

export const SSubmit = styled.button`
  min-height: 44px;
  margin-top: 8px;
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
