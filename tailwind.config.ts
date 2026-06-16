import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '"Times New Roman"', 'Times', 'serif'],
        serif: ['var(--font-lora)', '"Times New Roman"', 'Times', 'serif'],
        inter: ['var(--font-inter)', '"Times New Roman"', 'Times', 'serif'],
        playfair: ['var(--font-lora)', '"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-navy": "#070B14",
        "brand-slate": "#0D1421",
        "brand-charcoal": "#111827",
        "brand-teal": "#019E88",
        "brand-gold": "#D4A843",
        "brand-lavender": "#8B9FF4",
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
