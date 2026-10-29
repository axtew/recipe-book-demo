import styled from "styled-components";

/**
 * Native dropdown with the project styles.
 *
 * On iPhone a native `<select>` opens the system wheel picker — large, with gestures and
 * voice-over, better than a custom dropdown for a short static list and costs not a byte of JS.
 * Mantine's `Combobox` stays where search over a large set of values is needed.
 */
export const SSelect = styled.select`
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.palette.border};
  border-radius: 8px;
  /* The same technical threshold as for text input fields: below it Safari
     on iOS zooms the page on focus. Not a typography token. */
  font-size: 16px;
  color: ${({ theme }) => theme.palette.text};
  background: ${({ theme }) => theme.palette.surface};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.palette.primary};
    outline-offset: 1px;
  }
`;
