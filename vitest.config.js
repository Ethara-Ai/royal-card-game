import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  test: {
    // Limit concurrent processes to reduce system load
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 2,
      },
    },
    maxConcurrency: 5,

    // Use jsdom environment for React component testing
    environment: "jsdom",

    // Global test setup file
    setupFiles: ["./src/test/setup.js"],

    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Include test files matching these patterns
    include: [
      "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
      "src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    ],

    // Exclude these paths from testing
    exclude: ["node_modules", "dist", ".vite", "**/*.d.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/main.jsx",
        "src/test/**",
        "src/**/__tests__/**",
        "src/**/*.test.{js,jsx}",
        "src/**/*.spec.{js,jsx}",
        "node_modules/**",
      ],
      // Coverage thresholds (adjusted to current coverage levels)
      thresholds: {
        statements: 50,
        branches: 85,
        functions: 60,
        lines: 50,
      },
    },

    // Reporter configuration
    reporters: ["verbose"],

    // Mock configuration
    mockReset: true,
    restoreMocks: true,

    // Test timeout in milliseconds
    testTimeout: 10000,

    // CSS handling
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },

  // Resolve aliases (same as main vite.config.js)
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@utils": "/src/utils",
      "@config": "/src/config",
      "@assets": "/src/assets",
    },
  },
});
