import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
        wheat: {
          DEFAULT: "#B68A1E", // harvest-gold accent, used sparingly
          // Contrast variants: DEFAULT wheat is only ~3.1:1 on white/linen —
          // fails AA at eyebrow sizes — and ~4.25:1 on pine-deep. Use the
          // variant that matches the surface so text always passes 4.5:1.
          bright: "#D9A93C", // gold for dark surfaces (6.2:1 on pine-deep)
          dark: "#8A6414", // gold for light surfaces (5.4:1 on white)
        },
        slate: "#2D465E", // legacy heading color, kept for secondary structure
        linen: "#F6F4EE", // warm off-white for alternating sections
        ink: "#16231C", // near-black body text with a green undertone
        // WhatsApp brand green, split for contrast: DEFAULT is dark enough
        // (4.6:1) to carry white text on light surfaces; `surface` is the
        // bright variant used only as a hover/background tint.
        whatsapp: {
          DEFAULT: "#128C7E",
          surface: "#25D366",
        },
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
  // @tailwindcss/typography: prose defaults for long narrative blocks.
  // Brand theming lives in globals.css (.prose-pine sets the plugin's
  // --tw-prose-* variables from our tokens).
  plugins: [typography],
};

export default config;
