/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", 'Georgia', 'serif'],
        sans: ["'Plus Jakarta Sans'", "'Inter'", 'sans-serif'],
        mono: ["'DM Mono'", 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0a0a0c',
          1: '#111115',
          2: '#16161a',
          3: '#1c1c22',
          4: '#222229',
          border: 'rgba(255,255,255,0.06)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg,#3b82f6 0%,#6366f1 50%,#a855f7 100%)',
        'gradient-hero': 'linear-gradient(to bottom,rgba(10,10,12,0.5) 0%,rgba(10,10,12,0.65) 50%,#0a0a0c 100%)',
        'gradient-radial-blue': 'radial-gradient(ellipse at 50% 0%,rgba(59,130,246,0.12) 0%,transparent 70%)',
        'gradient-radial-purple': 'radial-gradient(ellipse at 80% 80%,rgba(168,85,247,0.08) 0%,transparent 60%)',
      },
      boxShadow: {
        'blue-glow': '0 0 40px rgba(59,130,246,0.25)',
        'blue-glow-sm': '0 0 20px rgba(59,130,246,0.18)',
        'card': '0 4px 32px rgba(0,0,0,0.45)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.6)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'shimmer': 'shimmer 1.8s infinite linear',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-600px 0' }, '100%': { backgroundPosition: '600px 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};