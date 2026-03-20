/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#000000',
          secondary: '#111111',
          background: '#fafafa',
          surface: '#ffffff',
          accent: '#FFCC00',
          'accent-dark': '#e6b800',
          gold: '#d4a853',
          text: '#000000',
          muted: '#6b7280',
          sage: '#A8B8B3',
          'sage-light': '#d4deda',
          cream: '#F5F0E8',
          'cream-dark': '#ebe4d8',
          light: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        cursive: ['Sheryl', 'cursive'],
        brand: ['HappinessBeta', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.12)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px rgba(255, 204, 0, 0.15)',
        'glow-accent': '0 4px 20px rgba(255, 204, 0, 0.3)',
      },
      backdropBlur: {
        'glass': '16px',
      }
    }
  },
  plugins: [],
}
