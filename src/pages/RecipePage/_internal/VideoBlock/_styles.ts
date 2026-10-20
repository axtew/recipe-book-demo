import styled from "styled-components";

export const SSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SLink = styled.a`
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.primary};
  overflow-wrap: anywhere;
  text-decoration: none;
`;
