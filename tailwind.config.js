/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["autumn"],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

