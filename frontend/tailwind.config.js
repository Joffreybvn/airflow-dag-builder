/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {},
  },
    corePlugins: {
      container: false,
      fontFamily: false
    },
  plugins: [require("tw-elements/dist/plugin.cjs")],
  darkMode: "class"
}
