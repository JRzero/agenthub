const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        subtle: "var(--color-subtle)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        "primary-soft": "var(--color-primary-soft)",
        "text-strong": "var(--color-text-strong)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      boxShadow: {
        panel: "0 12px 30px rgba(0, 0, 0, 0.16)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".border-primary\\/40": {
          borderColor: "color-mix(in srgb, var(--color-primary) 40%, transparent)",
        },
      });
    }),
  ],
};
