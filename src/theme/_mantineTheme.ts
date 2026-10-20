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

/** Минимальная высота тап-цели: ниже неё на iOS по полю трудно попасть пальцем. */
const TAP_TARGET_PX = 44;

/**
 * Размер ячейки дня календаря для размеров шкалы `sm` и `md` — тап-цель вместо 36px и 42px у Mantine.
 * Переопределяются переменные шкалы, а не `--day-size`: Mantine пишет в `--day-size` ссылку на них
 * прямо в стиле ячейки, и значения из `styles` её не перебивают.
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
    // Крестик закрытия листа увеличен до тап-цели в 44px: лист закрывается пальцем.
    // По умолчанию у Mantine он 28px.
    Drawer: Drawer.extend({
      defaultProps: { closeButtonProps: { size: TAP_TARGET_PX } },
    }),
    // Поля ввода высотой в тап-цель 44px вместо 42px, которые Mantine даёт размеру `md`. Правка здесь
    // покрывает разом все поля на базе `Input`: `NumberInput`, `DatePickerInput`, `FileInput` и прочие.
    Input: Input.extend({
      vars: (_theme, props) => ({
        wrapper: props.size === "md" ? { "--input-height": rem(TAP_TARGET_PX) } : {},
      }),
    }),
    // Ячейка дня календаря — тап-цель в 44px вместо 36px у Mantine.
    DatePicker: DatePicker.extend({
      styles: { day: DAY_SIZE_VARS },
    }),
    // Календарь в модальном окне: ячейка дня в 44px, окно растянуто на всю ширину экрана.
    // Месяц из семи ячеек занимает около 312px и иначе не помещается на экране шириной 320px;
    // по умолчанию у Mantine отступ окна от краёв экрана 5vw, а внутренний отступ 16px.
    DatePickerInput: DatePickerInput.extend({
      defaultProps: { modalProps: { xOffset: 0, padding: 2 } },
      styles: { day: DAY_SIZE_VARS },
    }),
    // Числовые поля без стрелок «+» и «−»: в граммах и килокалориях ими не пользуются, а каждая
    // стрелка по умолчанию занимает 21px ширины поля и вдвое меньше тап-цели.
    NumberInput: NumberInput.extend({
      defaultProps: { hideControls: true },
    }),
  },
});
