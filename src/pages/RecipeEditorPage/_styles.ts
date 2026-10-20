import { NumberInput } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import styled from "styled-components";

export const SPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
`;

export const SBack = styled(Link)`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  min-height: 44px;
  color: ${({ theme }) => theme.palette.primary};
  text-decoration: none;
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

export const SInput = styled.input`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* 16px — иначе Safari на iOS зумит страницу при фокусе на поле. Не токен
     типографики: техническое ограничение платформы, а не размер из шкалы. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
`;

export const STextarea = styled.textarea`
  min-height: 88px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* Тот же порог iOS, что у SInput. */
  font-size: 16px;
  font-family: inherit;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};
  resize: vertical;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
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
