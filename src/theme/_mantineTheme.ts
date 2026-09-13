import { createTheme, type MantineColorsTuple } from "@mantine/core";

import { breakpoints } from "./_breakpoints";
import { palette } from "./_palette";
import { typography } from "./_typography";

/** Та же палитра, что и у styled-components темы, — Mantine строит из неё свои CSS-переменные. */
const primaryShades: MantineColorsTuple = [
  palette.primaryMuted,
  palette.primaryMuted,
  palette.primaryMuted,
  palette.primaryMuted,
  palette.primaryMuted,
  palette.primary,
  palette.primary,
  palette.primary,
  palette.primary,
  palette.primary,
];

const dangerShades: MantineColorsTuple = [
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
  palette.danger,
];

export const mantineTheme = createTheme({
  fontFamily: typography.fontFamily,
  primaryColor: "primary",
  colors: {
    primary: primaryShades,
    danger: dangerShades,
  },
  breakpoints: {
    sm: breakpoints.contentMaxWidth,
  },
});
