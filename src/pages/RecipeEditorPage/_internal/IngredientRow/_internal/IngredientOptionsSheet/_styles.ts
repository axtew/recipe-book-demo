import styled from "styled-components";

export const SCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
`;

export const SCheckbox = styled.input`
  width: 22px;
  height: 22px;
  accent-color: ${({ theme }) => theme.palette.primary};
`;

export const SActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;
