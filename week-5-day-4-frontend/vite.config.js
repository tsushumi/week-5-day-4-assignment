import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// The app talks to the API at http://localhost:3000 directly (see src/api.js),
// which is why the backend needs app.use(cors()). If you'd rather avoid CORS
// entirely, uncomment the proxy below, then call fetch("/api/books") instead
// of the absolute URL in src/api.js — Vite will forward /api/* to the backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3000",
    //     changeOrigin: true,
    //   },
    // },
  },
});
