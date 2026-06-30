/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          deep: '#0F0F1E',
          card: '#16213E',
          sidebar: '#0E1729',
          accent: '#1a1f3a'
        },
        primary: {
          brand: '#7C3AED',
          accent: '#EC4899'
        },
        gradient: {
          start: '#7C3AED',
          mid: '#EC4899',
          end: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(124, 58, 237, 0.15)',
        'premium-lg': '0 40px 80px -20px rgba(124, 58, 237, 0.25)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glow': '0 0 40px rgba(124, 58, 237, 0.3)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        floatUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        floatUp: 'floatUp 0.6s ease-out',
        gradientShift: 'gradientShift 6s ease infinite'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}