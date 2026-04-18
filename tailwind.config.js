/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/main/resources/templates/**/*.html', './src/main/resources/static/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#a95c31',
        coffee: {
          50: '#fdfaf7',
          100: '#f7f0e8',
          200: '#eedfce',
          400: '#d9b99b',
          500: '#c69976',
          600: '#b47c59',
          700: '#956248',
          800: '#79503d',
          900: '#644335',
        },
      },
    },
  },
  plugins: [],
};
