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
          '0%': { transform: 'translate(0,0) scale(1) rotate(0deg)' },
          '25%': {
            transform: 'translate(180px,-120px) scale(1.15) rotate(15deg)',
          },
          '50%': {
            transform: 'translate(-200px,100px) scale(1.25) rotate(-10deg)',
          },
          '75%': {
            transform: 'translate(140px,160px) scale(1.15) rotate(10deg)',
          },
          '100%': { transform: 'translate(0,0) scale(1) rotate(0deg)' },
        },
        nebulaPulse: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.35' },
        },
        nebulaHue: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
      animation: {
        twinkle: 'twinkle 2s ease-in-out infinite',
        nebulaFloat: 'nebulaFloat 45s ease-in-out infinite',
        nebulaPulse: 'nebulaPulse 8s ease-in-out infinite',
        nebulaHue: 'nebulaHue 20s linear infinite',
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
