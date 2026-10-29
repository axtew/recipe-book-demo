import styled, { css } from "styled-components";

/** Common look of text fields: border, font, focus. */
export const textFieldStyles = css`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* 16px — otherwise Safari on iOS zooms the page when the field is focused. Not a
     typography token: a technical platform constraint, not a size from the scale. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
`;

/** Single-line text field with the project styles. */
export const STextInput = styled.input`
  ${textFieldStyles}
`;
