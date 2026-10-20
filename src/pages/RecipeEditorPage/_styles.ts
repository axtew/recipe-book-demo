import { NumberInput } from "@mantine/core";
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

/** Числовое поле Mantine с высотой тап-цели 44px: размеры из шкалы Mantine ниже порога. */
export const SNumberInput = styled(NumberInput)`
  && input {
    min-height: 44px;
  }
`;

export const SAddButton = styled.button`
  min-height: 44px;
  border: 1px dashed ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.primary};
  cursor: pointer;
`;

export const SSubmit = styled.button`
  min-height: 48px;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.primary};
  color: ${({ theme }) => theme.palette.surface};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const SSecondaryButton = styled.button`
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.text};
  cursor: pointer;
`;

export const SDangerButton = styled.button`
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.palette.danger};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.palette.danger};
  cursor: pointer;
`;
