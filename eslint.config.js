const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
      "next.config.js",
      "tailwind.config.js",
      "eslint.config.js",
      "eslint.config.mjs",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
