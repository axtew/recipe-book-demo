import styled from "styled-components";

export const SBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SPickerLine = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SMenuButton = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  min-height: 44px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.palette.textMuted};
  cursor: pointer;
`;

export const SMetaLine = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  /* Граммы — фиксированной ширины, остальное место отдаётся подписям. */
  & > :first-child {
    flex: none;
    width: 120px;
  }
`;

export const SBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  min-width: 0;
`;
