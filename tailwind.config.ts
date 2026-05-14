import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#fff9ef",
        bone: "#f4ead9",
        acid: "#d7ff2f",
        hot: "#ff4ecd",
        bolt: "#33d6ff",
        punch: "#ff6b35",
        mint: "#57e389"
      },
      boxShadow: {
        brutal: "6px 6px 0 #111111",
        "brutal-lg": "10px 10px 0 #111111",
        "brutal-sm": "3px 3px 0 #111111"
      },
      borderRadius: {
        brutal: "10px"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
