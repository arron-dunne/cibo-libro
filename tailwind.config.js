/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // enable manual dark mode toggling with the "dark" class
  theme: {
    extend: {
      fontFamily: {
        fun: ["'Fredoka'", "cursive"], // example playful font, can be swapped with next/font
      },
      colors: {
        brand: {
          light: "#fb923c", // orange-400
          DEFAULT: "#f97316", // orange-500
          dark: "#ea580c", // orange-600
        },
      },
    },
  },
  plugins: [],
};

