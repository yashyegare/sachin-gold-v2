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
        // Latin-first stacks: brand Latin type (Inter/Marcellus) renders
        // every Latin glyph, and the Noto script fonts below pick up
        // Devanagari/Kannada/Telugu/Tamil via unicode-range — headings in
        // translated locales keep a serif voice (Noto Serif) instead of
        // silently falling back to the browser default.
        display: [
          "var(--font-marcellus)",
          "var(--font-noto-serif-devanagari)",
          "var(--font-noto-serif-kannada)",
          "var(--font-noto-serif-telugu)",
          "var(--font-noto-serif-tamil)",
          "serif",
        ],
        sans: [
          "var(--font-inter)",
          "var(--font-noto-sans-devanagari)",
          "var(--font-noto-sans-kannada)",
          "var(--font-noto-sans-telugu)",
          "var(--font-noto-sans-tamil)",
          "system-ui",
          "sans-serif",
        ],
      },
      transitionTimingFunction: {
        // One easing curve, used everywhere: overriding Tailwind's DEFAULT
        // means every existing transition-*/transition utility site-wide
        // (colors, transform, shadow, all of it) picks this up automatically
        // — zero markup changes required. A fast-start, settled-finish
        // curve reads as more "considered" than the stock Tailwind ease on
        // every hover, reveal and carousel move at once.
        DEFAULT: "cubic-bezier(0.22, 1, 0.36, 1)",
        brand: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        // Two-layer "contact + ambient" system: a tight, dark shadow close
        // to the element (as if it's actually resting on the surface)
        // layered under a soft, diffuse shadow further out (ambient light
        // falloff). Real shadows are neutral-dark regardless of the
        // casting object's own color, so these three sizes cover every
        // light-surface card/dropdown/button hover site-wide — replacing
        // what were previously one-off arbitrary shadow values per
        // component. Pick by size, not by which component it's for.
        "elevated-sm":
          "0 2px 4px -2px rgba(22,35,28,0.14), 0 10px 24px -10px rgba(22,35,28,0.16)",
        elevated:
          "0 3px 6px -2px rgba(22,35,28,0.16), 0 16px 32px -12px rgba(22,35,28,0.22)",
        "elevated-lg":
          "0 4px 10px -4px rgba(22,35,28,0.18), 0 26px 50px -16px rgba(22,35,28,0.28)",
        // Dark-surface variant — black-tinted, not ink-green — for photos
        // sitting on a bg-ink section (WhySachinGold), where the standard
        // family above would barely read against the already-dark backdrop.
        "elevated-deep":
          "0 6px 14px -6px rgba(0,0,0,0.5), 0 32px 60px -20px rgba(0,0,0,0.55)",
        // Soft gold glow — no offset, just spread — for later use behind
        // stat numbers and the primary CTA's hover state (Phase 3/5).
        // Defined now so later phases reference a token, not a new
        // arbitrary value invented on the spot.
        "glow-gold": "0 0 0 1px rgba(217,169,60,0.15), 0 0 32px rgba(217,169,60,0.35)",
      },
      fontSize: {
        // Fluid display scale — clamp() instead of a fixed breakpoint
        // jump. Min/max match what the site already used (text-2xl→3xl,
        // 3xl→4xl, 4xl→5xl, 5xl→6xl); the change is that type now grows
        // smoothly with the viewport instead of snapping at exactly 640px.
        "display-md": [
          "clamp(1.5rem, 1.35rem + 1vw, 1.875rem)",
          { lineHeight: "1.25" },
        ],
        "display-lg": [
          "clamp(1.875rem, 1.65rem + 1.2vw, 2.25rem)",
          { lineHeight: "1.2" },
        ],
        "display-xl": [
          "clamp(2.25rem, 1.8rem + 2.4vw, 3rem)",
          { lineHeight: "1.15" },
        ],
        "display-2xl": [
          "clamp(3rem, 2.4rem + 3vw, 3.75rem)",
          { lineHeight: "1.1" },
        ],
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
