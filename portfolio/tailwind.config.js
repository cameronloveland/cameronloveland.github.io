const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#0d9488',
          indigo: '#3730a3',
          midnight: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 30px 80px -40px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
