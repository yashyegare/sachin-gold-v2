export interface Service {
  title: string;
  slug: string;
  shortDescription: string; // shown in the nav dropdown / cards, ~1 sentence
  description: string; // longer copy for the service's own page
  image: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  locations: string[];
  yearsOfExperience: number;
}
