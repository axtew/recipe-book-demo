import styled from "styled-components";

export const SGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 44px;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
`;

export const STitle = styled.span`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

export const SChevron = styled.span<{ $isCollapsed: boolean }>`
  display: inline-block;
  color: ${({ theme }) => theme.palette.textMuted};
  transform: rotate(${({ $isCollapsed }) => ($isCollapsed ? "-90deg" : "0")});
`;

export const SList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
