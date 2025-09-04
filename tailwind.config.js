/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(222 47.2% 11.2%)',
        accent: 'hsl(211 90.9% 47.5%)',
        surface: 'hsl(0 0% 100%)',
        bg: 'hsl(210 40% 96.1%)',
        'text-primary': 'hsl(215.4 16.3% 14.9%)',
        'text-secondary': 'hsl(215.4 15% 30%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(212, 20%, 20%, 0.12)',
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading1': ['1.5rem', { lineHeight: '1.4', fontWeight: '700' }],
        'body': ['1rem', { lineHeight: '1.75', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}