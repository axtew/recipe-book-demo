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

export const SRecalculate = styled.button`
  align-self: flex-start;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.primary};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
