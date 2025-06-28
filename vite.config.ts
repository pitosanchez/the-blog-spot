import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/the-blog-spot/",
  css: {
    postcss: "./postcss.config.js",
  },
});
