/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0B1120',
          secondary: '#111C30',
          card: '#0D1B2A',
          cyan: '#00D9FF',
          deep: '#020B16',
          panel: '#111C30',
          panelHover: '#162444',
          border: 'rgba(0, 217, 255, 0.25)',
          borderHighlight: 'rgba(0, 217, 255, 0.5)',
          turquoise: '#008CFF',
          neon: '#00D9FF',
          success: '#22C55E',
          successBright: '#4ADE80',
          successSurface: '#052E1A',
          warning: '#F59E0B',
          danger: '#EF4444',
          textMuted: '#64748B',
          textSecondary: '#CBD5E1',
          textPrimary: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -4px rgba(0, 217, 255, 0.20)',
        'glow-cyan-sm': '0 0 12px -2px rgba(0, 217, 255, 0.25)',
        'glow-green': '0 0 30px rgba(34, 197, 94, 0.20)',
        'glow-green-sm': '0 0 16px rgba(34, 197, 94, 0.30)',
        'cyber-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(0, 217, 255, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
      },
    },
  },
  plugins: [],
}
