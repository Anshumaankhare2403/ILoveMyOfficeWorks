/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F5F7F2',
          100: '#E9EDE3',
          200: '#D5DEC7',
          300: '#BDCBA8',
          400: '#A3B588',
          500: '#8B9A6E', // user palette primary
          600: '#707E54',
          700: '#55603F',
          800: '#3C442C',
          900: '#23281A',
        },
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F4', // user palette second band
          200: '#F4EFE6',
          300: '#EBE4D8', // user palette third band
          400: '#DFD4C3',
          500: '#CFC0AA',
        },
      },
    },
  },
  plugins: [],
};
