import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/i18n/seo";

/**
 * Locale-aware, and honest about dates. Every route emits one entry per
 * locale with the full hreflang alternates map, so each translated page is
 * discoverable individually — the sitemap is the only place the Indic
 * pages are guaranteed to be found by name.
 *
 * `lastModified` is deliberately present only for /rates, the one page
 * whose content really does move (it revalidates off the owner's sheet).
 * Stamping every static page with the build date would tell Google the
 * whole site changed on every deploy, which trains it to ignore the field.
 */
function pathEntry(
  path: string,
  signals: {
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  },
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);

  return {
    url: absoluteUrl(routing.defaultLocale, path),
    changeFrequency: signals.changeFrequency,
    priority: signals.priority,
    ...(signals.lastModified ? { lastModified: signals.lastModified } : {}),
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    pathEntry("", { changeFrequency: "weekly", priority: 1 }),
    pathEntry("/rates", {
      // Live sheet prices: the freshest thing on the site, and the page
      // buyers actually search for.
      changeFrequency: "hourly",
      priority: 0.9,
      lastModified: new Date(),
    }),
    pathEntry("/services", { changeFrequency: "monthly", priority: 0.9 }),
    ...services.map((service) =>
      pathEntry(service.href, {
        changeFrequency: "monthly",
        priority: 0.8,
      }),
    ),
    pathEntry("/contact", { changeFrequency: "yearly", priority: 0.7 }),
    pathEntry("/about", { changeFrequency: "yearly", priority: 0.6 }),
    // Not a landing page; listed so its policy text is findable, ranked last.
    pathEntry("/privacy", { changeFrequency: "yearly", priority: 0.1 }),
  ];
}
