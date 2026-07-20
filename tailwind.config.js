
// Tailwind CSS Configuration File/ tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: ['cursor-target'],   // ✅ ensures this class is never purged
  theme: {
    extend: {},
  },
  plugins: [],
}
