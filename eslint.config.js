import js from "@eslint/js"
import globals from "globals"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import stylistic from "@stylistic/eslint-plugin"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    ignores: [".next/**", "components/ui/**", "app/api/test/**"]
  },
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      "react": reactPlugin,
      "@stylistic": stylistic
    },
    extends: [
      js.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      reactHooks.configs["recommended-latest"],
      stylistic.configs.recommended
    ],
    rules: {
      // React
      "react/prop-types": "off",

      // Stylistic
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/brace-style": "off",
      "@stylistic/comma-dangle": ["error", "never"],
      "@stylistic/jsx-first-prop-new-line": ["error", "multiline"],
      "@stylistic/jsx-one-expression-per-line": ["error", { allow: "non-jsx" }],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/multiline-ternary": ["error", "always-multiline"],
      "@stylistic/quotes": ["error", "double"]
    },
    settings: {
      react: { version: "detect" }
    }
  }
])
