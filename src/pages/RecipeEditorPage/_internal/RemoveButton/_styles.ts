import styled from "styled-components";

export const SButton = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  min-height: 44px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.textMuted};
  cursor: pointer;
`;
