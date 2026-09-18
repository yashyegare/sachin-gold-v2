import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/company";

// Phase 7, item 2.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
