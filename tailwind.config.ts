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
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        inter: ['"Times New Roman"', 'Times', 'serif'],
        playfair: ['"Times New Roman"', 'Times', 'serif'],
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
