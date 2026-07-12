/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F2ECE1',
        cream: '#FFFDF7',
        charcoal: '#2B2B2B',
        navy: '#1E3A5F',
        sage: '#8FAE7D',
        amber: '#D9A441',
        rust: '#B5493C',
        slate: '#8A8F98',
      }
    },
  },
  plugins: [],
}
