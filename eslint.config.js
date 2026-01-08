import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Global ignores
  globalIgnores(["dist", "build", "node_modules", "coverage", "*.config.js"]),

  // Main configuration for JS/JSX files
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // React specific
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Variables
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",

      // Best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "multi-line"],
      "default-case": "warn",
      "no-fallthrough": "error",
      "no-duplicate-imports": "error",

      // Code quality
      "no-nested-ternary": "warn",
      "no-unneeded-ternary": "error",
      "prefer-template": "warn",
      "prefer-spread": "warn",
      "prefer-rest-params": "warn",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-lonely-if": "error",
      "no-else-return": ["error", { allowElseIf: false }],

      // ES6+
      "arrow-body-style": ["warn", "as-needed"],
      "prefer-arrow-callback": "warn",
      "no-useless-constructor": "error",
      "object-shorthand": ["warn", "always"],
    },
  },
]);
