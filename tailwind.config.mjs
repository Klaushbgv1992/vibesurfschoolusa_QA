/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
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

export default config;