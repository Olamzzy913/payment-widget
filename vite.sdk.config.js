import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "PaymentWidgetSDK",
      fileName: (format) => `payment-widget.${format}.js`,
      formats: ["umd", "es"],
    },
    outDir: "dist/sdk",
    emptyOutDir: true,
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: false
  },
  base: '/sdk/' // Add this line
});