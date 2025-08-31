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
    // Increased chunk size warning limit after optimization
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Strategic manual chunking for optimal loading
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          // UI libraries (Radix, shadcn)
          if (id.includes('node_modules/@radix-ui') || 
              id.includes('node_modules/cmdk') ||
              id.includes('node_modules/vaul')) {
            return 'ui-vendor';
          }
          
          // Animation and motion
          if (id.includes('node_modules/framer-motion')) {
            return 'animation';
          }
          
          // Charts and visualization
          if (id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3')) {
            return 'charts';
          }
          
          // Form handling
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform') ||
              id.includes('node_modules/zod')) {
            return 'forms';
          }
          
          // Utilities and misc
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/tailwind-merge')) {
            return 'utils';
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
