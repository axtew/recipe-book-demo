import { MantineProvider } from "@mantine/core";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "styled-components";

import { I18nProvider } from "@/context/I18nContext";
import { router } from "@/routes/AppRouter";
import { GlobalStyle, mantineTheme, theme } from "@/theme";

import { persistOptions, queryClient } from "./_queryClient";

/** Композиция приложения: провайдеры (кэш запросов, UI-кит, тема, словарь) и роутер под ними. */
export function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <MantineProvider theme={mantineTheme}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <I18nProvider>
            <RouterProvider router={router} />
          </I18nProvider>
        </ThemeProvider>
      </MantineProvider>
    </PersistQueryClientProvider>
  );
}
