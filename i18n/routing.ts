import { defineRouting } from "next-intl/routing";

/**
 * The six launch locales. English is default and serves unprefixed (/),
 * the translated locales are prefixed (/hi, /mr, /kn, /te, /ta) — the
 * prefixed form keeps hreflang targets unambiguous and matches how the
 * old site's Marathi/Kannada buyers would arrive from search.
 *
 * The old site shipped a Google Translate widget; this rebuild replaces
 * machine-in-the-moment translation with real, reviewable message files
 * (messages/*.json) — the direction the project plan always intended.
 */
export const routing = defineRouting({
  locales: ["en", "hi", "mr", "kn", "te", "ta"],
  defaultLocale: "en",
  // English serves at / (no prefix); the other five are always prefixed.
  localePrefix: "as-needed",
});

// Locale type for the whole app — derive, never hand-write.
export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  kn: "ಕನ್ನಡ",
  te: "తెలుగు",
  ta: "தமிழ்",
};
