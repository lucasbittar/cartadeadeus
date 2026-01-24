import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        burgundy: {
          DEFAULT: '#8B1538',
          50: '#F9E8EC',
          100: '#F2D1D9',
          200: '#E5A3B3',
          300: '#D8758D',
          400: '#CB4767',
          500: '#8B1538',
          600: '#6F112D',
          700: '#530D22',
          800: '#380816',
          900: '#1C040B',
        },
        cream: '#FDF8F5',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
