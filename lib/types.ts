export interface Service {
  title: string;
  slug: string;
  shortDescription: string; // shown in the nav dropdown / cards, ~1 sentence
  /** One fact-led line for the home value-chain card (real figures only —
   *  sourced from this service's own description/advantages). Falls back
   *  to shortDescription where unset. */
  stageNote?: string;
  description: string; // longer intro copy for the service's own page
  advantages: string[]; // real "Key Advantages" / "Highlights" bullets from the old site
  locations: string[]; // "Our Network" / "Our Presence" for this specific service
  image: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface HeroContent {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Path under /public, e.g. "/images/hero/facility.jpg". Leave "" until a
   *  real facility photo is ready — Hero renders a brand-color gradient
   *  instead of a broken image. */
  image: string;
}

/** One slide of the home hero carousel — all content real, pulled from
 *  the old site's own carousel copy. */
export interface HeroSlide {
  image: string;
  alt: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Product {
  name: string;
  slug: string;
  category: string; // e.g. "Trading", "Processing", "Extraction"
  description: string;
  /** Path under /public, e.g. "/images/products/toor-dal.webp". Leave ""
   *  until a real product photo exists — ProductCard renders a linen
   *  swatch with the product's initial until then. */
  image: string;
  /** slug of the Service in data/services.ts this product belongs to */
  service: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string; // "" until the real photo is migrated — see data/team.ts
  facebook?: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Path under /public for the customer's real video, if one exists.
   *  Rendered inline (preload="metadata") with a real extracted poster
   *  frame — visible immediately, one click (native play) to watch. */
  video?: string;
  /** Poster frame for `video`, extracted from the actual clip (not a
   *  stock/placeholder image) so the visitor sees the real customer
   *  before pressing play. */
  videoPoster?: string;
}

export interface Customer {
  name: string;
  logo: string; // path under /public
}

export interface Facility {
  name: string;
  address: string;
  phone: string;
  /** Real Google Maps short URL from the old site's contact page, one per
   *  facility. Optional only so older data without a link still typechecks. */
  mapUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RateItem {
  product: string;
  /** Display string. "On request" until the client supplies real numbers —
   *  never "TODO" (a literal TODO string would render on the page). */
  price: string;
  unit: string;
  /** Numeric price for schema.org Offer markup. Optional: the structured
   *  data on /rates only emits offers for items that have one, so filling
   *  this in later automatically activates pricing rich-results — no
   *  component changes. Currency is assumed INR. */
  priceValue?: number;
}

export interface RateGroup {
  title: string;
  items: RateItem[];
  /** Per-group "last updated" date (ISO or display string). Dals and soya
   *  derivatives move on different cycles — one page-wide date would be a
   *  small lie. null/undefined hides the line for that group. */
  updatedOn?: string | null;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  /** Primary "call support" number shown site-wide. */
  phone: string;
  /** WhatsApp number, digits only with country code, e.g. "919422952233" —
   *  used to build wa.me links. Real number, already in use on the live site. */
  whatsapp: string;
  email: string;
  salesEmail: string;
  /** Registered legal entity name, from the live site's contact page. */
  legalName: string;
  facilities: Facility[];
  locations: string[];
  yearsOfExperience: number;
  /** Parent group name, as used in the real "About" copy on the live site. */
  groupName?: string;
  foundedYear?: number;
  farmersConnected?: number;
  processingCapacityTonsPerDay?: number;
}
