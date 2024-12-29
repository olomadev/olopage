/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{vue,vuetify,js,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Roboto', 'sans-serif']
    },
    fontSize: {
      sm: ['12px'],
      base: ['10px'],
      lg: ['19px'],
      xl: ['11px'],
      xs: ['10px'],
      "1xl": ['18px'],
      "2xl": ['24px'],
      "3xl": ['34px'],
    }
  },
  important: ".blockeditor",
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("mouse", "@media (hover: hover)");
    }),
  ],
};
