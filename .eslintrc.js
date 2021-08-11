module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "@vue/eslint-config-airbnb",
    "plugin:vue/essential",
    "@vue/typescript/recommended",
    "@vue/typescript",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    indent: ["warn", 2],
    quotes: ["warn", "double"],
    semi: ["warn", "never"],
    camelcase: "off",
    "array-bracket-spacing": ["warn", "never"],
    "brace-style": ["warn", "1tbs"],
    "linebreak-style": ["off", "unix"],
    "max-len": "warn",
    "object-curly-newline": "warn",
    "no-param-reassign": "warn",
    "no-underscore-dangle": "warn",
    "no-empty-function": "warn",
    "no-trailing-spaces": "warn",
    "comma-dangle": "warn",
    "no-plusplus": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-ts-comment": "off",
    "vue/no-unused-components": "warn",
  },
}
