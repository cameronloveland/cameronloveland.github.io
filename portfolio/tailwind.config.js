const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        accent: {
          DEFAULT: "#0891b2",
          foreground: "#0f172a",
        },
      },
      boxShadow: {
        card: "0 30px 60px -40px rgba(15, 23, 42, 0.45)",
      },
    },
  },
  plugins: [],
};
