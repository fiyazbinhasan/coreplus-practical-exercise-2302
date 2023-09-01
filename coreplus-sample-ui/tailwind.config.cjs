/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#f59e0b",
          "secondary": "#1d4ed8",
          "accent": "#f7ce46",
          "neutral": "#647488",
          "base-100": "#FFFFFF",
          "info": "#93E7FB",
          "success": "#108981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
