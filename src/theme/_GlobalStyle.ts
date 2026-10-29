import { createGlobalStyle } from "styled-components";

/** Base margin reset and default background/text color — shared by the whole app. */
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    min-height: 100dvh;
  }

  body {
    background: ${({ theme }) => theme.palette.background};
    color: ${({ theme }) => theme.palette.text};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
  }
`;
