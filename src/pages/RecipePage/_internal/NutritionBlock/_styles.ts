import styled from "styled-components";

export const SWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SBig = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

export const SMacros = styled.div`
  display: flex;
  gap: 16px;
`;

export const SCell = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const SMarker = styled.span`
  color: ${({ theme }) => theme.palette.primary};
`;
