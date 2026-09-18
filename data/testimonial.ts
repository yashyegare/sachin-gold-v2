import type { Testimonial } from "@/lib/types";

// REAL — found on the live About page, distinct from the fake
// testimonials.html (see README's "Testimonials" note for that
// distinction). The old site also links a real customer video at
// assets/img/cust_feedback.mp4 — TODO: migrate to public/videos/ and
// surface it here once in place. This stays a single quote (not a
// carousel) so the page never overstates the social proof that exists.
export const testimonial: Testimonial = {
  quote:
    "Working with Sachin Gold has completely transformed our supply chain. Their commitment to pure quality, timely logistics, and highly transparent trading practices makes them the most reliable agro-commodity partner in the region.",
  name: "Shrikant",
  role: "Trader / Wholesale Distributor",
};
