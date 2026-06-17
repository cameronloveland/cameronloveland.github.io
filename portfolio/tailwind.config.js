/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
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
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.5' },
        },
        burnUp: {
          '0%, 100%': {
            filter: 'brightness(1)',
            transform: 'translate(0,0) scale(1)',
          },
          '25%': {
            filter: 'brightness(1.3)',
            transform: 'translate(-2px,2px) rotate(-2deg) scale(1.05)',
          },
          '50%': {
            filter: 'brightness(1.5)',
            transform: 'translate(2px,-2px) rotate(2deg) scale(1.05)',
          },
          '75%': {
            filter: 'brightness(1.3)',
            transform: 'translate(-2px,2px) rotate(-2deg) scale(1.05)',
          },
        },
      },
      animation: {
        twinkle: 'twinkle 2s ease-in-out infinite',
        nebulaFloat: 'nebulaFloat 60s ease-in-out infinite',
        nebulaPulse: 'nebulaPulse 8s ease-in-out infinite',
        burnUp: 'burnUp 0.6s ease-in-out infinite',
      },
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
