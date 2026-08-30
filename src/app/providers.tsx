import { MantineProvider } from "@mantine/core";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import type { ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { I18nProvider } from "@/context/I18nContext";
import { GlobalStyle, mantineTheme, theme } from "@/theme";

import { queryClient, queryPersister } from "./_queryClient";

interface IProps {
  children: ReactNode;
}

/** Общие провайдеры приложения: персистентный кэш запросов, UI-кит, тема, словарь. */
export function AppProviders({ children }: IProps) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: queryPersister }}>
      <MantineProvider theme={mantineTheme}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </MantineProvider>
    </PersistQueryClientProvider>
  );
}
