// vite.sdk.config.js
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
    outDir: "dist",
    emptyOutDir: false,
    minify: false, // Disable minification for now
  },
  server: {
    port: 3000,
  },
});
