import styled from "styled-components";

export const SContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SSection = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  border: none;
`;

export const SLegend = styled.legend`
  padding: 0;
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
