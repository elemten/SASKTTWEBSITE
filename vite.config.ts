import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
// import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // splitVendorChunkPlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: "es2019",
    // Performance budgets
    chunkSizeWarningLimit: 500,
    // Let Vite decide optimal chunking to avoid cross-chunk React issues
  },
  // Add bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    plugins: [
      // Add rollup-plugin-visualizer if needed
    ]
  })
}));
