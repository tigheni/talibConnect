import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyzeBundle = process.env.BUNDLE_ANALYZE === "true";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    shouldAnalyzeBundle &&
      visualizer({
        open: true,
        filename: "dist/stats.html",
      }),
  ].filter(Boolean),
});
