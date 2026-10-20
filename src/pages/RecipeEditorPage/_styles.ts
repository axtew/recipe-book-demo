import styled from "styled-components";

export const SPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
`;

export const SPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 0;
  text-align: center;
`;

export const SForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SFieldRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

export const SAddButton = styled.button`
  min-height: 44px;
  border: 1px dashed ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.primary};
  cursor: pointer;
`;
