export interface Service {
  title: string;
  slug: string;
  shortDescription: string; // shown in the nav dropdown / cards, ~1 sentence
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
}

export interface Facility {
  name: string;
  address: string;
  phone: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RateItem {
  product: string;
  price: string;
  unit: string;
}

export interface RateGroup {
  title: string;
  items: RateItem[];
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
