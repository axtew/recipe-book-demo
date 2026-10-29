import { Drawer } from "@mantine/core";
import styled from "styled-components";

/**
 * Bottom sheet that fits its content height.
 *
 * Mantine gives a bottom `Drawer` a fixed height from its size scale (`--drawer-size-md`), while
 * sheets in the app are both short and long. Specificity is raised with `&&`, as for any UI kit
 * override.
 */
export const SBottomSheetDrawer = styled(Drawer)`
  && .mantine-Drawer-content {
    height: auto;
    max-height: 90dvh;
  }
`;
