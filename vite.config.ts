import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Add bundle analyzer when ANALYZE=true
    process.env.ANALYZE === 'true' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: "es2019",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // UI libraries (Radix, shadcn)
          if (id.includes('node_modules/@radix-ui') || id.includes('node_modules/cmdk') || id.includes('node_modules/vaul')) {
            return 'ui-vendor';
          }
          // Animation and motion
          if (id.includes('node_modules/framer-motion')) {
            return 'animation';
          }
          // Charts and visualization
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          // Form handling
          if (id.includes('node_modules/react-hook-form')) {
            return 'forms';
          }
          // Query and state management
          if (id.includes('node_modules/@tanstack')) {
            return 'query';
          }
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Other vendor dependencies
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
  },
}));
