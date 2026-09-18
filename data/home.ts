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
  // Drop the real facility photo at public/images/hero/facility.jpg and set
  // this string — Hero switches to the photo-with-overlay version with zero
  // component changes. Empty string renders the pine gradient + grain dots.
  image: "",
};
