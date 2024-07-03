import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--ff-base)']
      },
      boxShadow: {
        light: '2px 4px 7px 1px rgba(22, 22, 22, 0.9)',
        dark: '2px 4px 7px 1px rgba(170, 170, 170, 0.9)',
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'black': '#353535',
        'red': '#ff2257',
        'grey': '#e5e5e5',
        'blue': '#1ec3ff',
        'green': '#00d384',
        'orange': '#ff6600',
        'maroon': '#9f9f9f',
        'purple': '#a17efa',
        'yellow': '#f1de00',
        'darkblue': '#0038FF',
        'grey-light': '#e5e5e5',
        'grey-darker': '#bdb9b9',
        'purple-darker': '#855cec',
        'purple-faint': '#dccfff',
        'black-light': 'rgb(87, 87, 86, 0.8)',
        "black-glass": "rgb(18, 18, 18, 0.8)",
        "black-dark": "#000000",
      },
      backgroundImage: {
        'login': "url('/covers/Boardroomm.webp')",
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate"), require("tailwindcss-animate")],
};
export default config;
