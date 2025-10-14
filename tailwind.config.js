// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html,css}", // <— legg merke til at .css er med her!
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222.2 47.4% 11.2%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(222.2 47.4% 11.2%)",
        "card-foreground": "hsl(210 40% 98%)",
        primary: "hsl(217.2 91.2% 59.8%)",
        "primary-foreground": "hsl(222.2 47.4% 11.2%)",
        secondary: "hsl(217.2 32.6% 17.5%)",
        border: "hsl(217.2 32.6% 17.5%)",
        ring: "hsl(217.2 91.2% 59.8%)",
      },
    },
  },
  plugins: [],
};
