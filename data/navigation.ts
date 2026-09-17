import { services } from "@/data/services";
import type { NavLink } from "@/lib/types";

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Our Services",
    href: "/services",
    children: [
      { label: "Overview", href: "/services" },
      ...services.map((service) => ({
        label: service.title,
        href: service.href,
      })),
    ],
  },
  { label: "Rates", href: "/rates" },
  { label: "Contact", href: "/contact" },
];
