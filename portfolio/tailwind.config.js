const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#0ea5e9',
          indigo: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 24px 60px -30px rgba(15, 23, 42, 0.3)',
      },
    },
  },
  plugins: [],
};
