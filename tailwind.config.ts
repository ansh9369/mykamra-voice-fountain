import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: {
          bg: "#05060A",
          bg2: "#0C0F17",
          ink: "#F4F2FF",
          mute: "#6C7186",
          basin: "#141826",
        },
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
