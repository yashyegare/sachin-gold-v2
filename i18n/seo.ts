import type { Metadata } from "next";
import { routing, type Locale } from "./routing";

/**
 * hreflang alternates for one page path — the exact set of locales the
 * site ships, so every page's metadata carries the full language map and
 * Google can serve the right one per searcher. `x-default` points at the
 * unprefixed English route (the negotiation fallback).
 *
 * Routed via next-intl's `localePrefix: "as-needed"`: English serves
 * unprefixed, the other five always carry their prefix.
 */
export function buildAlternates(path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    languages[locale] = `${prefix}${path}` || "/";
  }
  // x-default: the URL a locale-unknown visitor gets redirected to.
  languages["x-default"] = path || "/";

  return { canonical: path || "/", languages };
}

export function localePath(locale: Locale, path: string): string {
  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}
