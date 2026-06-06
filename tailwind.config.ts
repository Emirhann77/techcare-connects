import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        accent: {
          pink: "#ec4899",
          orange: "#f97316",
        },
        connect: "#60a5fa",
        // Warm terracotta / clay accent (editorial look).
        brand: {
          50: "#faf3ee",
          100: "#f4e4d8",
          200: "#e8c8b2",
          300: "#daa585",
          400: "#ca8059",
          500: "#bb6440",
          600: "#a8542f",
          700: "#8a4429",
          800: "#6f3823",
          900: "#5c2f1f",
        },
        // Cream paper tones for backgrounds and surfaces.
        paper: {
          50: "#fbf8f2",
          100: "#f6f1e8",
          200: "#efe7d8",
          300: "#e3d7c2",
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pop": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        "pop": "pop 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
