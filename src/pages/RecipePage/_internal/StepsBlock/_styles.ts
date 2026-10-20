import styled from "styled-components";

export const SSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const SStep = styled.li`
  display: flex;
  align-items: baseline;
  gap: 12px;

  /* Текст шага сохраняет переносы строк, как их ввели. */
  & > :last-child {
    min-width: 0;
    white-space: pre-wrap;
  }
`;

/** Номер шага: фиксированная ширина держит тексты шагов на одной вертикали. */
export const SNumber = styled.span`
  flex: none;
  min-width: 24px;
  color: ${({ theme }) => theme.palette.primary};
  font-weight: 700;
`;
