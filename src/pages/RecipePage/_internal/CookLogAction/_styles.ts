import styled from "styled-components";

export const SButton = styled.button`
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
  cursor: pointer;
`;
