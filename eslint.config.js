import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "dev-dist", ".wrangler"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      eqeqeq: ["error", "always"],
      // Import order: side effects, external packages, the `@/` alias, relative.
      // The groups are listed explicitly because by default the plugin treats `@/...`
      // as an external package and mixes it with the dependencies.
      "simple-import-sort/imports": [
        "error",
        {
          groups: [["^\\u0000"], ["^node:", "^@?\\w"], ["^@/"], ["^\\."]],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
  {
    // Route tree modules export route factories alongside components, and the
    // `router` itself — the warning here cannot be avoided by the file's structure.
    files: ["src/routes/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
);
