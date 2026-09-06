import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Словари попадают в precache явно: дефолтные globPatterns Workbox
      // покрывают только js/css/html, а json проходит мимо service worker'а и
      // кэшируется браузером эвристически. Тогда новый код может встретиться со
      // старым словарём, и экран падает на отсутствующем ключе.
      includeAssets: ["favicon.svg", "dictionaries/*.json"],
      manifest: {
        name: "Книга рецептов",
        short_name: "Рецепты",
        description: "Справочник продуктов, рецепты с расчётом КБЖУ, журнал готовки",
        lang: "ru",
        theme_color: "#1a1a1a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
