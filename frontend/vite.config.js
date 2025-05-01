import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: "gzip",
      threshold: 1024, // compress files > 1KB
      deleteOriginFile: false,
    }),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      svgo: { plugins: [{ name: "removeViewBox" }] },
    }),
  ],
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Code splitting for third-party libraries
          }
        },
      },
    },
    define: {
      "process.env.VITE_APP_ID": JSON.stringify(process.env.VITE_APP_ID),
      "process.env.VITE_SERVER_KEY": JSON.stringify(
        process.env.VITE_SERVER_KEY
      ),
      "process.env.VITE_BACKEND_URL": JSON.stringify(
        process.env.VITE_BACKEND_URL
      ),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"], // Optimize react libraries
  },
});
