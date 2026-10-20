import styled from "styled-components";

export const SBackAnchor = styled.a`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  min-height: 44px;
  color: ${({ theme }) => theme.palette.primary};
  text-decoration: none;
`;
