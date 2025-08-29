import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { splitVendorChunkPlugin } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries (ensure React and ReactDOM live together)
          if (/node_modules\/(react|react-dom)\//.test(id) || id.includes('react/jsx-runtime')) {
            return 'react-vendor';
          }
          
          // Radix UI components
          if (id.includes('@radix-ui/react-')) {
            return 'ui-vendor';
          }
          
          // Date and form libraries
          if (id.includes('date-fns') || id.includes('react-day-picker') || 
              id.includes('react-hook-form') || id.includes('@hookform/resolvers') || 
              id.includes('zod')) {
            return 'date-vendor';
          }
          
          // Animation and motion
          if (id.includes('framer-motion')) {
            return 'animations';
          }
          
          // Charts and data visualization
          if (id.includes('recharts')) {
            return 'charts';
          }
          
          // Query and state management
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Icon libraries
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          
          // UI utility libraries
          if (id.includes('class-variance-authority') || id.includes('clsx') || 
              id.includes('tailwind-merge') || id.includes('tailwindcss-animate') ||
              id.includes('vaul') || id.includes('sonner') || id.includes('input-otp') ||
              id.includes('cmdk') || id.includes('embla-carousel-react') ||
              id.includes('react-resizable-panels') || id.includes('next-themes')) {
            return 'ui-utils';
          }
          
          // Vendor chunk for other dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
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
