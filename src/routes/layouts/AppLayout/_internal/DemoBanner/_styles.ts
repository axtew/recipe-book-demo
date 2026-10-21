import styled from "styled-components";

export const SBanner = styled.div`
  padding: 8px 16px;
  text-align: center;
  background: ${({ theme }) => theme.palette.primaryMuted};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;
