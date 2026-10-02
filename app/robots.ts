import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/company";

// Phase 7, item 2. `/api` is disallowed because the revalidation endpoint
// is a machine-to-machine webhook — crawling it wastes budget and would
// only ever see a JSON acknowledgement. Everything user-facing is open,
// including the generated social cards and the images directory: blocking
// those would strip the site's share previews and image search presence.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
