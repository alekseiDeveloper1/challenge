/** @type {import("eslint").Linter.Config} */
const turboConfig = require("eslint-config-turbo").default;

module.exports = {
  root: true,
  ...turboConfig,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    ".*.js",
    "*.setup.js",
    "*.config.js",
    ".turbo/",
    "dist/",
    "coverage/",
    "node_modules/",
    ".husky/",
  ],
};
