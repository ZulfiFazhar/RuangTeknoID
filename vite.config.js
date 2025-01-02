import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "editorjs-html": require.resolve("editorjs-html"),
    },
  },
  optimizeDeps: {
    include: ["editorjs-html"],
  },
});
