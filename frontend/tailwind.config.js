/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      colors: {
        orange: {
          DEFAULT: "#fc9634",
          50: "#fff8ed",
          100: "#ffefd5",
          200: "#fedaaa",
          300: "#fec073",
          400: "#fc9634",
          500: "#fa7c15",
          600: "#eb610b",
          700: "#c3480b",
          800: "#9b3911",
          900: "#7d3111",
          950: "#431607",
        },
        calypso: {
          DEFAULT: "#0f6b61",
          50: "#effef9",
          100: "#cafdf0",
          200: "#95fae2",
          300: "#58f0d1",
          400: "#26dbbc",
          500: "#0dbfa4",
          600: "#079a87",
          700: "#0b7a6d",
          800: "#0f6b61",
          900: "#105149",
          950: "#02312e",
        },
        whisper: "#F0F0F5",
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        ".margin-container": {
          marginInline: "1rem",

          "@screen sm": {
            // maxWidth: "640px",
            marginInline: "2rem",
          },
          "@screen md": {
            // maxWidth: "768px",
            marginInline: "3rem",
          },
          "@screen lg": {
            // maxWidth: "1024",
            marginInline: "4rem",
          },
          "@screen xl": {
            // maxWidth: "1280px",
            marginInline: "5rem",
          },
          "@screen 2xl": {
            // maxWidth: "1536px",
            marginInline: "7rem",
          },
        },

        ".padding-container": {
          paddingInline: "1rem",

          "@screen sm": {
            paddingInline: "2rem",
          },
          "@screen md": {
            paddingInline: "3rem",
          },
          "@screen lg": {
            paddingInline: "4rem",
          },
          "@screen xl": {
            paddingInline: "5rem",
          },
          "@screen 2xl": {
            paddingInline: "7rem",
          },
        },
      });
    },
  ],
};
