/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        twinkle: {
          '0%, 100%': {
            opacity: '0.5',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.1)',
          },
        },
        nebulaFloat: {
          '0%, 100%': {
            transform: 'scale(1) translate(0, 0)',
          },
          '50%': {
            transform: 'scale(1.1) translate(5%, -5%)',
          },
        },
        galaxyRotate: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        twinkle: 'twinkle 2s ease-in-out infinite',
        nebulaFloat: 'nebulaFloat 40s ease-in-out infinite',
        galaxyRotate: 'galaxyRotate 90s linear infinite',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        background: '#0f172a',
        accent: '#38bdf8',
        secondary: '#64748b',
        primaryText: '#f8fafc',
      },
    },
  },
  plugins: [],
};
