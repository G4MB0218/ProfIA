import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182032', muted: '#6e7387', mint: '#49c69b', peach: '#ffb46f',
        brand: { 50: '#f4f3ff', 100: '#eae8ff', 200: '#d6d2ff', 300: '#b8b0ff', 400: '#9688fb', 500: '#7868f2', 600: '#6658e8', 700: '#5245ca', 800: '#433aa3', 900: '#39357f' }
      },
      fontFamily: { sans: ['DM Sans', 'system-ui', 'sans-serif'], display: ['Manrope', 'DM Sans', 'sans-serif'] },
      boxShadow: { soft: '0 14px 40px rgba(60, 52, 120, 0.09)', lift: '0 18px 60px rgba(45, 38, 100, 0.14)' }
    }
  },
  plugins: []
} satisfies Config
