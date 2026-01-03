/** @type {import('tailwindcss').Config} */
const baseConfig = require("@repo/ui/tailwind.config");

module.exports = {
  ...baseConfig.default || baseConfig,
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
