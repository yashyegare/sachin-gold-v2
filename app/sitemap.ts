import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { siteUrl } from "@/data/company";
import { routing } from "@/i18n/routing";

// Phase 7, item 1 — generated from the data layer, and now locale-aware:
// every route emits one entry per locale with the full hreflang alternates
// map, so each translated page is discoverable individually. English
// serves unprefixed (next-intl's localePrefix: "as-needed").
function pathEntry(path: string): MetadataRoute.Sitemap[number] {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    alternates[locale] = `${siteUrl}${prefix}${path}` || siteUrl;
  }
  alternates["x-default"] = `${siteUrl}${path}` || siteUrl;

  return {
    url: `${siteUrl}${path}` || siteUrl,
    lastModified: new Date(),
    alternates: { languages: alternates },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/about",
    "/services",
    "/rates",
    "/contact",
    "/privacy",
  ];
  return [
    ...staticPaths.map((path) => pathEntry(path)),
    ...services.map((service) => pathEntry(service.href)),
  ];
}
