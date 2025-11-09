/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          blush: '#FCECEC',
          lilac: '#E8DFF5',
          mint: '#D5F5E3',
          sky: '#CDE7F2',
          lemon: '#FBF8CC',
          coral: '#F8D7DA',
          navy: '#2F3A8D',
        },
        ink: '#2D3A3A',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(47, 58, 141, 0.35)',
      },
    },
  },
  plugins: [],
}

export default config
