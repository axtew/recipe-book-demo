import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "dayjs/locale/ru";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app/App";

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("Корневой элемент #root не найден");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
