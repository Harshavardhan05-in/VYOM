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
          cyan: '#22D3EE',
          deep: '#030712',
          panel: '#111C30',
          panelHover: '#162444',
          border: 'rgba(34, 211, 238, 0.25)',
          borderHighlight: 'rgba(34, 211, 238, 0.5)',
          turquoise: '#06B6D4',
          neon: '#38BDF8',
          success: '#10B981',
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
        'glow-cyan': '0 0 24px -4px rgba(34, 211, 238, 0.20)',
        'glow-cyan-sm': '0 0 12px -2px rgba(34, 211, 238, 0.25)',
        'cyber-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(34, 211, 238, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-sm': '24px 24px',
      },
    },
  },
  plugins: [],
}
