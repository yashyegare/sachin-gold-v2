import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/i18n/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/rates", "/services", ...services.map(service => service.href), "/contact", "/about", "/privacy"];
  return paths.flatMap(path => {
    const languages: Record<string, string> = Object.fromEntries(
      routing.locales.map(locale => [locale, absoluteUrl(locale, path)]),
    );
    languages['x-default'] = absoluteUrl(routing.defaultLocale, path);
    return routing.locales.map(locale => ({
      url: absoluteUrl(locale, path),
      alternates: { languages },
    }));
  });
}
