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
    // Conservative chunking: only isolate React to avoid TDZ issues from custom splits
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (/node_modules\/(react|react-dom)\//.test(id) || id.includes('react/jsx-runtime')) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  // Add bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    plugins: [
      // Add rollup-plugin-visualizer if needed
    ]
  })
}));
