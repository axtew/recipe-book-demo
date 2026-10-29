import {
  createTheme,
  Drawer,
  Input,
  type MantineColorsTuple,
  NumberInput,
  rem,
} from "@mantine/core";
import { DatePicker, DatePickerInput } from "@mantine/dates";

import { breakpoints } from "./_breakpoints";
import { palette } from "./_palette";
import { typography } from "./_typography";

/** The same palette as the styled-components theme — Mantine builds its CSS variables from it. */
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

/** Minimum tap target height: below it on iOS it is hard to hit the field with a finger. */
const TAP_TARGET_PX = 44;

/**
 * Calendar day cell size for the `sm` and `md` scale sizes — a tap target instead of Mantine's 36px and 42px.
 * The scale variables are overridden, not `--day-size`: Mantine writes a reference to them into `--day-size`
 * right in the cell style, and values from `styles` do not override it.
 */
const DAY_SIZE_VARS = { "--day-size-sm": rem(TAP_TARGET_PX), "--day-size-md": rem(TAP_TARGET_PX) };

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
  components: {
    // The sheet close button is enlarged to a 44px tap target: the sheet is closed with a finger.
    // Mantine's default is 28px.
    Drawer: Drawer.extend({
      defaultProps: { closeButtonProps: { size: TAP_TARGET_PX } },
    }),
    // Input fields are a 44px tap target tall instead of the 42px Mantine gives size `md`. A fix here
    // covers all fields built on `Input` at once: `NumberInput`, `DatePickerInput`, `FileInput` and others.
    Input: Input.extend({
      vars: (_theme, props) => ({
        wrapper: props.size === "md" ? { "--input-height": rem(TAP_TARGET_PX) } : {},
      }),
    }),
    // Calendar day cell — a 44px tap target instead of Mantine's 36px.
    DatePicker: DatePicker.extend({
      styles: { day: DAY_SIZE_VARS },
    }),
    // Calendar in a modal: day cell of 44px, the modal stretched to the full screen width.
    // A month of seven cells takes about 312px and otherwise does not fit a 320px-wide screen;
    // Mantine's default modal offset from the screen edges is 5vw, and the inner padding is 16px.
    DatePickerInput: DatePickerInput.extend({
      defaultProps: { modalProps: { xOffset: 0, padding: 2 } },
      styles: { day: DAY_SIZE_VARS },
    }),
    // Number fields without “+” and “−” arrows: nobody uses them for grams and kilocalories, and each
    // arrow takes 21px of the field width by default, half the tap target.
    NumberInput: NumberInput.extend({
      defaultProps: { hideControls: true },
    }),
  },
});
