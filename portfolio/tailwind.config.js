/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        primary: '#38bdf8',
        accent: '#38bdf8',
        secondary: '#64748b',
        background: '#0f172a',
        primaryText: '#f8fafc',
      },
    },
  },
  plugins: [],
};
