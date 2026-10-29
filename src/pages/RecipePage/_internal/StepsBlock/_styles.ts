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

  /* Step text keeps line breaks as they were entered. */
  & > :last-child {
    min-width: 0;
    white-space: pre-wrap;
  }
`;

/** Step number: a fixed width keeps the step texts on one vertical line. */
export const SNumber = styled.span`
  flex: none;
  min-width: 24px;
  color: ${({ theme }) => theme.palette.primary};
  font-weight: 700;
`;
