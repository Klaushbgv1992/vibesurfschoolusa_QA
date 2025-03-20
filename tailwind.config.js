/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#2563eb',
        },
        beach: {
          50: '#e6f2f7',
          400: '#0084cb',
          500: '#005d8e',
          600: '#004c74',
          700: '#003b5a',
        },
      },
    },
  },
  plugins: [],
};