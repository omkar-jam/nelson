import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* PlatiGleam palette */
        'plati-dark': '#0a0b0e',
        plati: {
          DEFAULT: '#111318',
          elevated: '#181c22',
          border: '#2a2e36',
          muted: '#5c626e',
          soft: '#9ca0a8',
        },
        gleam: {
          DEFAULT: '#c5bfb4',
          bright: '#e2ddd4',
        },
        paper: '#e6e3de',
        /* Legacy / aliases */
        cream: '#e6e3de',
        gold: '#c5bfb4',
        'gold-dim': '#9ca0a8',
        night: {
          bg: '#0a0b0e',
          surface: '#111318',
          elevated: '#181c22',
          border: '#2a2e36',
          muted: '#5c626e',
          soft: '#9ca0a8',
          cream: '#e6e3de',
          gold: '#c5bfb4',
          goldDim: '#9ca0a8',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.35rem, 2.5vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '0.01em' }],
        'display-sm': ['1.125rem', { lineHeight: '1.35', letterSpacing: '0.02em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        'body': ['0.9375rem', { lineHeight: '1.65', letterSpacing: '0.005em' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.6', letterSpacing: '0.02em' }],
        'caption': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
