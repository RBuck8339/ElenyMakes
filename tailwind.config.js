/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./globals.css"
  ],
  theme: {
    extend: {
      colors: {
        "background": "#F5EDEC",
            "main-brown": "#533638",
            "main-pink": "#F6D3D8",
            "accent-pink": "#F7B9C4",
            "neutral-accent": "#B3C8BA",
            "accent-green": "#619B8A",
            "other-pink1": "#B56F76",
            "other-pink2": "#B48E92"
      },
    },
  },
  plugins: [],
}
