/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        // High-Contrast Dark Theme (The "Vogue" Palette)
        'void-black': '#050505',
        'glass-charcoal': '#121212',
        'glass-charcoal-50': 'rgba(18, 18, 18, 0.5)',
        'crisp-white': '#FFFFFF',
        'muted-silver': '#A3A3A3',
        'terminal-green': '#4ADE80',
        'electric-blue': '#3B82F6',
        'iconic-gold': '#EAB308',
        
        // Retaining old keys for backward compatibility but mapping to new theme
        'neuro': {
          black: '#050505',
          green: '#4ADE80',
          text: '#FFFFFF',
          muted: '#A3A3A3',
          border: '#333333'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'Merriweather', 'ui-serif', 'Georgia'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
      },
    },
  },
  plugins: [],
};
