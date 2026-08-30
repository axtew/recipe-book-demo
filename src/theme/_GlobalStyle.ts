import { createGlobalStyle } from "styled-components";

/** Базовый сброс отступов и цвет фона/текста по умолчанию — общий для всего приложения. */
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
