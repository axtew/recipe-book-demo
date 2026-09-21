import { Drawer } from "@mantine/core";
import styled from "styled-components";

/**
 * Нижний лист под высоту содержимого.
 *
 * Mantine задаёт нижнему `Drawer` фиксированную высоту из своей шкалы размеров
 * (`--drawer-size-md`), а листы в приложении бывают и короткими, и длинными.
 * Специфичность поднимается через `&&`, как и для любого переопределения кита.
 */
export const SBottomSheetDrawer = styled(Drawer)`
  && .mantine-Drawer-content {
    height: auto;
    max-height: 90dvh;
  }
`;
