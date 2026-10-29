import styled, { css, type RuleSet } from "styled-components";

import type { TButtonVariant } from "./_types";

const variantStyles: Record<TButtonVariant, RuleSet> = {
  primary: css`
    border-color: ${({ theme }) => theme.palette.primary};
    background: ${({ theme }) => theme.palette.primary};
    color: ${({ theme }) => theme.palette.surface};
  `,
  primaryOutline: css`
    border-color: ${({ theme }) => theme.palette.primary};
    background: transparent;
    color: ${({ theme }) => theme.palette.primary};
  `,
  secondary: css`
    border-color: ${({ theme }) => theme.palette.border};
    background: transparent;
    color: ${({ theme }) => theme.palette.text};
  `,
  danger: css`
    border-color: ${({ theme }) => theme.palette.danger};
    background: ${({ theme }) => theme.palette.danger};
    color: ${({ theme }) => theme.palette.surface};
  `,
  dangerOutline: css`
    border-color: ${({ theme }) => theme.palette.danger};
    background: transparent;
    color: ${({ theme }) => theme.palette.danger};
  `,
};

export const SButton = styled.button<{ $variant: TButtonVariant; $isInline?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: ${({ $isInline }) => ($isInline ? "flex-start" : "auto")};
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid;
  border-radius: 8px;
  cursor: pointer;
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

/** A row of equal-width buttons: cancel and confirm in a sheet, a pair of actions in a card. */
export const SButtonRow = styled.div`
  display: flex;
  gap: 8px;

  & > * {
    flex: 1;
  }
`;
