/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/main/resources/templates/**/*.html', './src/main/resources/static/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#92400e',
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#a38a80',
          600: '#8c7369',
          700: '#685149',
          800: '#493933',
          900: '#2b211d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};
