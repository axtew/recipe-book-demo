import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "styled-components";

import { I18nProvider } from "@/context/I18nContext";
import { router } from "@/routes/AppRouter";
import { GlobalStyle, mantineTheme, theme } from "@/theme";

import { LocalizedDatesProvider } from "./_LocalizedDatesProvider";
import { persistOptions, queryClient } from "./_queryClient";

/** App composition: providers (query cache, UI kit, theme, dictionary, dates) with the router below them. */
export function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <ReactQueryDevtoolsPanel />

      <MantineProvider theme={mantineTheme}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <Notifications position="top-center" />

          {/* The dates provider needs the language, so it sits inside the i18n provider. */}
          <I18nProvider>
            <LocalizedDatesProvider>
              <RouterProvider router={router} />
            </LocalizedDatesProvider>
          </I18nProvider>
        </ThemeProvider>
      </MantineProvider>
    </PersistQueryClientProvider>
  );
}
