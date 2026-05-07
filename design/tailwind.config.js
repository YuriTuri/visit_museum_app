/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#112A4A",
        cream: "#FDF8F3",
        primary: "#3FB8AF",
        primaryLight: "#9BD6D1",
        accent: "#E8505B",
        cardBg: "#FFFFFF",
        chipBg: "#FFF7F0",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0px 2px 2px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
