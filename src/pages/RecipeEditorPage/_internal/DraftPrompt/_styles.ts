import styled from "styled-components";

export const SCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.surface};
`;
