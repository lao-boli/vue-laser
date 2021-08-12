module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "@vue/eslint-config-airbnb",
    "plugin:vue/essential",
    // "./eslintrc/rules/crosstyan.rules.js",
    "./eslintrc/crosstyan.override.eslint.js",
    "@vue/typescript",
    "@vue/typescript/recommended",
    "./eslintrc/crosstyan.ts.eslint.js",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-unused-components": "warn",
  },
}
