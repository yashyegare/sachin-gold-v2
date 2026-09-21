import type { Testimonial } from "@/lib/types";

// REAL — found on the live About page, distinct from the fake
// testimonials.html (see README's "Testimonials" note for that
// distinction). The customer video has been migrated to
// public/videos/cust_feedback.mp4 and wired inline (poster + native
// play control) below the quote — no longer behind a toggle.
export const testimonial: Testimonial = {
  quote:
    "Working with Sachin Gold has completely transformed our supply chain. Their commitment to pure quality, timely logistics, and highly transparent trading practices makes them the most reliable agro-commodity partner in the region.",
  name: "Shrikant",
  role: "Trader / Wholesale Distributor",
  // Migrated from the old repo: assets/img/cust_feedback.mp4 (linked from
  // the old About page's testimonial section).
  video: "/videos/cust_feedback.mp4",
  // Real frame extracted from the clip itself (ffmpeg, ~2s in) — not a
  // stock photo — so the poster is the actual customer, not a guess.
  videoPoster: "/images/testimonial/cust-feedback-poster.webp",
};
