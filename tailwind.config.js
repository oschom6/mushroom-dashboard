/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0d120f',
          900: '#111a15',
          800: '#17231d',
        },
        earth: {
          500: '#7a5b41',
          400: '#937052',
          300: '#b58d69',
        },
        moss: {
          500: '#7f9e5a',
          400: '#97b86b',
          300: '#b2cb83',
        },
        cream: {
          100: '#f2ede3',
          200: '#ddd3c4',
        },
      },
      boxShadow: {
        card: '0 10px 25px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
