import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1EE5FF',
          100: '#E6FBFF',
          200: '#BFF4FF',
          300: '#99EEFF',
          400: '#4DE2FF',
          500: '#1EE5FF',
          600: '#00BFD1',
          700: '#0094A3',
          800: '#006975',
          900: '#003D46',
        }
      }
    },
  },
  plugins: [],
} satisfies Config