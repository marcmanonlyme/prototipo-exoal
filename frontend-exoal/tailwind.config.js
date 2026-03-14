/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta institucional inspirada en CENEVAL (navy #003a70)
        blue: {
          50:  '#e6eef7',
          100: '#bdd3ec',
          200: '#90b5de',
          300: '#6297d0',
          400: '#3f80c5',
          500: '#1d6ab9',  // focus rings
          600: '#005aad',  // botones primarios
          700: '#004d95',  // hover botones
          800: '#003a70',  // navbar principal / CENEVAL navy
          900: '#002650',  // elemento más oscuro
          950: '#001533',
        },
      },
    },
  },
  plugins: [],
}