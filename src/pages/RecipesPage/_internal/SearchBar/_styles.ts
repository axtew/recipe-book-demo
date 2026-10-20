import styled from "styled-components";

export const SBar = styled.div`
  display: flex;
  gap: 8px;
`;

export const SSearchWrapper = styled.div`
  display: flex;
  flex: 1;

  & > input {
    flex: 1;
    min-width: 0;
  }
`;

export const SFiltersButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
  color: inherit;
  cursor: pointer;
`;

export const SBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
`;
