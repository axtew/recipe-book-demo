import styled from "styled-components";

export const SPreview = styled.img`
  width: 100%;
  max-height: 260px;
  border-radius: 8px;
  object-fit: cover;
`;

export const SPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 96px;
  border: 1px dashed ${({ theme }) => theme.palette.border};
  border-radius: 8px;
`;

export const SActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & > :first-child {
    flex: 1;
    min-width: 0;
  }
`;
