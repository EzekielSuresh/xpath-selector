import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: path.resolve(__dirname, "public"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    // assetsDir: ".",
    rollupOptions: {
      input: {
        contentScript: path.resolve(__dirname, "src/contentScript.tsx")
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/index.css",
      },
    },
  },
})
