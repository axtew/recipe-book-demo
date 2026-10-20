import styled from "styled-components";

export const SSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SItem = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;

export const SBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const SMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SPinIcon = styled.svg`
  flex: none;
  fill: ${({ theme }) => theme.palette.textMuted};
`;
