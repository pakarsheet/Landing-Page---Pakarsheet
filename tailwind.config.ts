import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#01112b",
        muted: "#4c5a73",
        line: "#d9e2f4",
        sheet: "#8bed02",
        cobalt: "#023ffc",
        leaf: "#efffda",
        coral: "#023ffc",
        blush: "#eaf0ff",
        sky: "#eaf0ff",
        lilac: "#f2ffe0"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(1, 17, 43, 0.1)",
        card: "0 12px 34px rgba(1, 17, 43, 0.07)"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.35rem"
      },
      fontFamily: {
        primary: ["var(--font-geist-sans)", "Geist", "sans-serif"],
        secondary: ["var(--font-inter)", "InterDisplay", "Verdana", "sans-serif"],
        sans: ["var(--font-inter)", "InterDisplay", "Verdana", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
