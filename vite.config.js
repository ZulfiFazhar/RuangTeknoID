import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    historyApiFallback: true,
  },
  // optimizeDeps: {
  //   exclude: ["recharts"],
  // },
});
