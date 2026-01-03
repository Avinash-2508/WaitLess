/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        background: '#F9FAFB',
        card: '#FFFFFF',
        text: '#111827',
      },
    },
  },
  plugins: [],
}
