// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
      proxy: {
        "/predict": {
          target:
            "https://agrosaarthi-backend-ws-18-8000.ml.iit-ropar.truefoundry.cloud",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/predict/, "/predict"),
          secure: false,
        },
      },
  },
});
