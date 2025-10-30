/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        // New Pink Theme
        primary: {
          light: '#f9a8d4', // pink-300
          DEFAULT: '#ec4899', // pink-500
          dark: '#be185d', // pink-700
        },
        secondary: {
          light: '#c4b5fd', // violet-300
          DEFAULT: '#8b5cf6', // violet-500
          dark: '#6d28d9', // violet-700
        },
        accent: {
          DEFAULT: '#f59e0b', // amber-500
          dark: '#b45309', // amber-700
        },
        success: '#10b981', // emerald-500
        danger: '#ef4444', // red-500
        background: '#fffbff', // A very light pink background
        surface: '#ffffff',
        text: {
          primary: '#1d232a',
          secondary: '#5a6169',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
      }
    }
  },
  plugins: []
};