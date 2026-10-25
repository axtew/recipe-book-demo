import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The demo build marks the name so the demo icon on a phone is not confused
  // with the working app.
  const isDemoBuild = mode === "demo";

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        // Dictionaries go into the precache explicitly: the default Workbox
        // globPatterns cover only js/css/html, so json bypasses the service
        // worker and the browser caches it heuristically. New code can then meet
        // an old dictionary, and the screen fails on a missing key.
        includeAssets: ["favicon.svg", "dictionaries/*.json"],
        manifest: {
          name: isDemoBuild ? "Recipe Book (demo)" : "Recipe Book",
          short_name: isDemoBuild ? "Recipes demo" : "Recipe Book",
          description: "Product list, recipes with nutrition totals, cooking log",
          lang: "en",
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
  };
});
