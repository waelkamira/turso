/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        one: '#FF0000',
        two: '#741001',
        three: '#5C1211',
        four: '#182120',
        five: '#d82b2b',
        six: '#E7701F',
        seven: '#F8EEDB',
        eight: '#979797',
        nine: '#FFC83D',
        ten: '#FDF2D6',
        eleven: '#FADDB1',
        twelve: '#22C55E',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        xs: '1px',
      },
    },
  },
  plugins: [],
};
