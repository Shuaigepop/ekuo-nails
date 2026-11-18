/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warmWhite: '#F5F3EF',
        softGray: '#A1A1AA',
        obsidian: {
          DEFAULT: '#070709',
          50: '#1b1b22',
          100: '#15151b',
          200: '#111116',
          300: '#0d0d12',
          400: '#0a0a0e',
          500: '#070709',
        },
        champagne: {
          DEFAULT: '#D4AF37',
          50: '#FAF6E9',
          100: '#F5ECCF',
          200: '#EBD99E',
          300: '#E2C76E',
          400: '#DAB84B',
          500: '#D4AF37',
          600: '#B89327',
          700: '#8E7019',
          800: '#644E0E',
          900: '#3D2F05',
        },
        emeraldGlow: {
          DEFAULT: '#064e3b',
          light: '#059669',
          dark: '#022c22'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Noto Serif TC"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'title': '0.1em',
        'sub': '0.15em',
        'widest-plus': '0.25em',
        'super-wide': '0.4em',
      },
      lineHeight: {
        'editorial': '1.8',
        'relaxed-plus': '1.75',
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'emerald-glow': '0 0 35px -5px rgba(5, 150, 105, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
