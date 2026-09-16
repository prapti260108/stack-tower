/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071626',
          850: '#0a1a2e',
          800: '#0d223a',
          700: '#143152',
        },
        ochre: {
          400: '#e5b84c',
          500: '#c59b27',
          600: '#ab8219',
          700: '#8e6b12',
        },
        eyebrow: '#dfc28a',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Open Sans"',
          '"Helvetica Neue"',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
}
