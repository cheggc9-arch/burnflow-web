/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'burn-red': '#dc2626',
        'burn-dark': '#991b1b',
        'burn-light': '#fef2f2',
        'burn-accent': '#fca5a5',
        'pump-green': '#22c55e',
      },
      animation: {
        'pulse-red': 'pulse-red 2s infinite',
        'matrix-fall': 'matrix-fall linear infinite',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)' },
        },
        'matrix-fall': {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '90%': { opacity: '0.7' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
