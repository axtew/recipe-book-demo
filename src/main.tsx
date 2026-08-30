import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";
import { AppProviders } from "@/app/providers";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Корневой элемент #root не найден");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
