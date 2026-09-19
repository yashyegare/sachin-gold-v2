import type { HeroContent } from "@/lib/types";

// Home hero copy. Lives here (not in the component) so copy edits never
// touch Hero.tsx — same pattern as services/rates/company.
export const homeHero: HeroContent = {
  // Live-site capture: about.html publishes "Since 1969" — the client's own
  // claim, still worth an explicit confirmation in Phase 9.
  eyebrow: "Bulk Agro Commodities, Since 1969",
  headline: "Trusted trading and processing for India's agro commodities",
  subheadline:
    "From bulk sourcing and pulses processing to oil extraction, cold storage and logistics — Sachin Gold moves commodities from field to buyer across Maharashtra and Karnataka, with consistency you can plan around.",
  primaryCta: { label: "Explore Our Services", href: "/services" },
  secondaryCta: { label: "Today's Rates", href: "/rates" },
  // Real photo, migrated from the old repo's hero carousel
  // (banner_new_img1.jpg) via npm run images. Hero renders the
  // photo-with-overlay version; empty string would fall back to the
  // pine gradient + grain dots.
  image: "/images/hero/facility.webp",
};
