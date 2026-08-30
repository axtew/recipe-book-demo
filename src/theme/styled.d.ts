import "styled-components";

import type { breakpoints } from "./_breakpoints";
import type { palette } from "./_palette";
import type { typography } from "./_typography";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: typeof palette;
    typography: typeof typography;
    breakpoints: typeof breakpoints;
  }
}
