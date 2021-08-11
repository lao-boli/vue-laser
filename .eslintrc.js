module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "@vue/eslint-config-airbnb",
    "plugin:vue/essential",
    "@vue/typescript",
    "@vue/typescript/recommended",
    "./eslintrc/rules/crosstyan.rules.js",
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
