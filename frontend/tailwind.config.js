/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0f0f23',
        'bg-card': '#1a1a2e',
        'bg-hover': '#242441',
        'bg-active': '#3a3a5a',
        'accent': {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      fontFamily: {
        'inter': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 4px 20px rgba(99, 102, 241, 0.1)',
      }
    },
  },
  plugins: [],
};
