import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8F6",
        ink: "#12211D",
        clinical: {
          DEFAULT: "#2F6F5E",
          light: "#437E6D",
          dark: "#1F4E41",
        },
        clay: {
          DEFAULT: "#E1614B",
          light: "#EA8272",
        },
        mint: {
          DEFAULT: "#4CE0A0",
          soft: "#B7F5D6",
        },
        neutral: {
          DEFAULT: "#8A8F87",
          light: "#D7DBD3",
          dark: "#5B615A",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      keyframes: {
        "pulse-line": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "node-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.25)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-line": "pulse-line 2.6s ease-out forwards",
        "node-pulse": "node-pulse 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
