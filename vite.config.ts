import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // 開發環境代理到 Worker
      '/_internal': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      }
    }
  }
})
