/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crypto-dark': '#0f0f0f',
        'crypto-accent-green': '#00ff88',
        'crypto-accent-red': '#ff3366',
      },
    },
  },
  plugins: [],
}
