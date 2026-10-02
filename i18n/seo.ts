import type { Metadata } from "next";
import { company, siteUrl } from "@/data/company";
import { routing, type Locale } from "./routing";

/**
 * Every page's metadata comes through here, because the two things that
 * are easy to get wrong are easy to get wrong silently:
 *
 * 1. The canonical has to carry the locale. A locale-blind canonical tells
 *    Google the Hindi page is a duplicate of the English one, and the
 *    translated pages never get indexed — however correct the hreflang map
 *    beside it looks.
 * 2. The share image has to be named explicitly. Relying on Next's
 *    file-based inheritance leaves routes two segments deep
 *    (/services/<slug>) with no og:image at all, which on a site whose
 *    sales channel is WhatsApp means an empty link preview.
 */

const OG_ALT = "Sachin Gold — Bulk Agro Commodity Trading & Processing";
const OG_SIZE = { width: 1200, height: 630 };

// og:locale wants a language_COUNTRY tag; the bare script codes the router
// uses (hi, kn, …) are not valid there.
const OG_LOCALE: Record<Locale, string> = {
  en: "en_IN",
  hi: "hi_IN",
  mr: "mr_IN",
  kn: "kn_IN",
  te: "te_IN",
  ta: "ta_IN",
};

/** English serves unprefixed (next-intl's `localePrefix: "as-needed"`). */
function prefixOf(locale: string): string {
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

/**
 * Join a prefix and a route path into the URL the browser actually hits.
 * `trailingSlash: false` means "/hi/" 308-redirects to "/hi", so a
 * canonical or hreflang entry with a trailing slash points at a redirect
 * instead of the page.
 */
function joinUrl(prefix: string, path: string): string {
  const joined = `${prefix}${path}`.replace(/\/+$/, "");
  return joined === "" ? "/" : joined;
}

/**
 * The generated social card, addressed per locale, as a full URL.
 * Deliberately not left relative for `metadataBase` to expand: in
 * development Next rewrites relative image URLs to the dev server's own
 * origin, which makes the tag impossible to verify against production
 * behaviour. Absolute here means what a crawler sees is what is written.
 */
export function ogImageUrl(locale: string): string {
  return `${siteUrl}/${locale}/opengraph-image`;
}

/**
 * Absolute URL for the page a visitor is actually on, in that page's
 * locale. JSON-LD `url`/`item` fields must point at the document carrying
 * the markup: emitting `https://sachingold.com/services/logistics` from
 * `/hi/services/logistics` tells Google the Hindi page is the English one,
 * which is the same mistake as a locale-blind canonical.
 */
export function absoluteUrl(locale: string, path: string): string {
  return `${siteUrl}${joinUrl(prefixOf(locale), path)}`;
}

/**
 * A meta description is truncated by Google around 160 characters, and a
 * page that exceeds it gets a machine-written summary instead. Cutting at
 * the last whole word keeps the sentence readable in every script.
 */
function clampDescription(text: string): string {
  if (text.length <= 160) return text;
  const cut = text.slice(0, 160).lastIndexOf(" ");
  return `${text.slice(0, cut > 80 ? cut : 157).trimEnd()}…`;
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
}: {
  locale: string;
  path: string;
  title?: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = joinUrl(prefixOf(locale), path);

  const languages: Record<string, string> = {};
  for (const code of routing.locales) {
    languages[code] = joinUrl(prefixOf(code), path);
  }
  // x-default: the URL a locale-unknown visitor is negotiated to.
  languages["x-default"] = joinUrl("", path);

  const image = ogImageUrl(locale);
  // <title> goes through the layout's `%s | Sachin Gold` template; og:title
  // and twitter:title bypass templates entirely, so they need the full
  // string built here.
  const socialTitle = title
    ? `${title} | ${company.name}`
    : `${company.name} | ${company.tagline}`;
  const summary = clampDescription(description);

  return {
    metadataBase: new URL(siteUrl),
    // Only set `title` when this page actually has one. Writing the key with
    // an undefined value overrides the layout's `title.default`, and the
    // homepage then ships with no <title> at all.
    ...(title ? { title } : {}),
    description: summary,
    alternates: { canonical, languages },
    openGraph: {
      type,
      siteName: company.name,
      url: canonical,
      title: socialTitle,
      description: summary,
      locale: OG_LOCALE[locale as Locale] ?? OG_LOCALE[routing.defaultLocale],
      images: [{ url: image, ...OG_SIZE, alt: OG_ALT }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: summary,
      images: [image],
    },
  };
}
