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
          '0%': { transform: 'translate(0,0) scale(1)' },
          '25%': { transform: 'translate(120px,-80px) scale(1.05)' },
          '50%': { transform: 'translate(-130px,60px) scale(1.1)' },
          '75%': { transform: 'translate(80px,120px) scale(1.05)' },
          '100%': { transform: 'translate(0,0) scale(1)' },
        },
        nebulaPulse: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.4' },
        },
        nebulaHue: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
      animation: {
        twinkle: 'twinkle 2s ease-in-out infinite',
        nebulaFloat: 'nebulaFloat 60s ease-in-out infinite',
        nebulaPulse: 'nebulaPulse 8s ease-in-out infinite',
        nebulaHue: 'nebulaHue 30s linear infinite',
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
