import type { Testimonial } from "@/lib/types";

// REAL — found on the live About page, distinct from the fake
// testimonials.html (see README's "Testimonials" note for that
// distinction). The customer video has been migrated to
// public/videos/cust_feedback.mp4 and wired click-to-play below the quote.
// carousel) so the page never overstates the social proof that exists.
export const testimonial: Testimonial = {
  quote:
    "Working with Sachin Gold has completely transformed our supply chain. Their commitment to pure quality, timely logistics, and highly transparent trading practices makes them the most reliable agro-commodity partner in the region.",
  name: "Shrikant",
  role: "Trader / Wholesale Distributor",
  // Migrated from the old repo: assets/img/cust_feedback.mp4 (linked from
  // the old About page's testimonial section).
  video: "/videos/cust_feedback.mp4",
};
