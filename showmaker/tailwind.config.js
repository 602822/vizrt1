/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '100': '100px',
      },
      height: {
        '100': '100px',
      },
    },
  },
  plugins: [],
}