/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{vue,vuetify,js,js,ts,jsx,tsx}",
    "./views/*.ejs",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50":"#eff6ff",
          "100":"#dbeafe",
          "200":"#bfdbfe",
          "300":"#93c5fd",
          "400":"#60a5fa",
          "500":"#3b82f6",
          "600":"#2563eb",
          "700":"#1d4ed8",
          "800":"#1e40af",
          "900":"#1e3a8a",
          "950":"#172554"
        }
      }
    },
    fontFamily: {
     'body': [
        'Hanken Grotesk', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ],
      'sans': [
        'Hanken Grotesk', 
        'ui-sans-serif', 
        'system-ui', 
        '-apple-system', 
        'system-ui', 
        'Segoe UI', 
        'Roboto', 
        'Helvetica Neue', 
        'Arial', 
        'Noto Sans', 
        'sans-serif', 
        'Apple Color Emoji', 
        'Segoe UI Emoji', 
        'Segoe UI Symbol', 
        'Noto Color Emoji'
      ]
    },
    fontSize: {
      sm: ['12px'],
      base: ['13px'],
      lg: ['14px'],
      xl: ['16px'],
      xs: ['11px'],
      "1xl": ['18px'],
      "2xl": ['24px'],
      "3xl": ['34px'],
      "4xl": ['48px'],
      "5xl": ['56px'],
    }
  },
  important: ".blockeditor",
  plugins: [
    require('flowbite-typography'),
    // require("@tailwindcss/typography"),
    plugin(function ({ addVariant }) {
      addVariant("mouse", "@media (hover: hover)");
    }),
  ],
};
