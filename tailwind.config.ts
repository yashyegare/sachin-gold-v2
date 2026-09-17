import type { Config } from "tailwindcss";

// Design tokens for Sachin Gold V2.
// Grounded in the existing brand (pine green + gold accent, Marcellus
// display type) rather than a generic restyle — see README.md for the
// short design rationale.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          DEFAULT: "#0F4C2E", // primary brand green (deepened from legacy #116530)
          deep: "#0A3620", // hover / dark-surface variant
        },
        wheat: "#B68A1E", // harvest-gold accent, used sparingly
        slate: "#2D465E", // legacy heading color, kept for secondary structure
        linen: "#F6F4EE", // warm off-white for alternating sections
        ink: "#16231C", // near-black body text with a green undertone
      },
      fontFamily: {
        display: ["var(--font-marcellus)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
