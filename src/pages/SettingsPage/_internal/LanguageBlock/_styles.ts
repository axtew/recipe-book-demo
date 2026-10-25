import styled from "styled-components";

export const SGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: none;
`;

export const SOption = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  cursor: pointer;

  & > input {
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: ${({ theme }) => theme.palette.primary};
  }
`;
