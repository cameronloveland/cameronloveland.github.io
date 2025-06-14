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
            opacity: '0.8',  // was 1.0
            transform: 'scale(1.1)',  // was 1.3
          },
        },

      },
      animation: {
        twinkle: 'twinkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
