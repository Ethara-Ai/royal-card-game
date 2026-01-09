import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),

    // Bundle analyzer - only in build mode when ANALYZE=true
    mode === "production" &&
      process.env.ANALYZE === "true" &&
      visualizer({
        open: true,
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
        template: "treemap", // or "sunburst", "network"
      }),
  ].filter(Boolean),

  // Build optimizations for production
  build: {
    // Output directory
    outDir: "dist",

    // Enable minification
    minify: "esbuild",

    // Generate sourcemaps for debugging (set to false for smaller builds)
    sourcemap: false,

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React
          "react-vendor": ["react", "react-dom"],
          // UI libraries chunk
          "ui-vendor": [
            "react-icons",
            "react-colorful",
            "react-confetti",
            "sonner",
          ],
        },
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },

    // Target modern browsers for smaller bundle
    target: "es2020",

    // Warn if chunk size exceeds limit
    chunkSizeWarningLimit: 500,

    // Report compressed size
    reportCompressedSize: true,

    // Performance optimizations
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // inline assets smaller than 4kb
  },

  // Performance monitoring
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent",
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    open: true,
    cors: true,
  },

  // Preview server (for testing production build)
  preview: {
    port: 4173,
    open: true,
  },

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@config": "/src/config",
      "@assets": "/src/assets",
    },
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || "1.0.0"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __PROD__: mode === "production",
  },

  // Performance optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "react-icons", "sonner", "react-confetti"],
  },
}));
