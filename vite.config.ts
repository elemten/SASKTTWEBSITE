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
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
    exclude: [],
  },
  build: {
    target: "es2017",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries - ensure proper bundling
          if (id.includes('node_modules/react/') && !id.includes('node_modules/react-')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-dom/')) {
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
          // Utilities and misc
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/class-variance-authority') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'utils';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // Other vendor dependencies - more specific grouping
          if (id.includes('node_modules/')) {
            // Group by package type to avoid circular dependencies
            if (id.includes('node_modules/embla') || id.includes('node_modules/react-dnd')) {
              return 'ui-extras';
            }
            if (id.includes('node_modules/sonner')) {
              return 'notifications';
            }
            // Default vendor chunk for remaining packages
            return 'vendor';
          }
        },
      },
    },
  },
}));
