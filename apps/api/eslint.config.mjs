import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config({
  files: ["**/*.{js,mjs,cjs,ts}"],
  extends: [pluginJs.configs.recommended, ...tseslint.configs.recommended],
  languageOptions: { globals: globals.browser },
  ignores: ["build/**"],
  rules: {
    ...eslintConfigPrettier.rules,
    "no-self-assign": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        caughtErrors: "none",
      },
    ],
  },
});
