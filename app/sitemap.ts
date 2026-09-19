import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { siteUrl } from "@/data/company";

// Phase 7, item 1 — generated from the data layer, not hand-written XML, so
// new services/routes show up automatically.
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
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
    })),
    ...services.map((service) => ({
      url: `${siteUrl}${service.href}`,
      lastModified: new Date(),
    })),
  ];
}
