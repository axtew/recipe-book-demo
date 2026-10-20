import styled, { css } from "styled-components";

/** Общий вид текстовых полей: рамка, шрифт, фокус. */
export const textFieldStyles = css`
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

/** Однострочное текстовое поле со стилями проекта. */
export const STextInput = styled.input`
  ${textFieldStyles}
`;
