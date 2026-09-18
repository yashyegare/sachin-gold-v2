import type { CompanyInfo } from "@/lib/types";

// Real contact details, pulled directly from the live site's contact.html
// (not previously reflected anywhere else on the site). Worth a quick
// client confirmation that these are still current (Phase 9), but these
// are real, not guesses.
export const company: CompanyInfo = {
  name: "Sachin Gold",
  tagline: "Bulk Agro Commodity Trading & Processing",
  phone: "+91 94229 52233", // "Call Support" main line
  whatsapp: "919422952233", // same number, WhatsApp-enabled — already used on the live site
  email: "info@sachingold.com",
  salesEmail: "sales@sachingold.com",
  legalName: "Sachin International Proteins Private Limited",
  facilities: [
    {
      name: "Main Plant",
      address:
        "289/1 At- Post Her, Near Karadkhel Pati, Udgir, Dist. Latur, MH - 413517",
      phone: "+91 88060 17000",
    },
    {
      name: "Sandeep Dal Industry & Warehouses",
      address: "C37Q+5C Loni, MIDC Udgir, Dist. Latur, MH - 413517",
      phone: "+91 85509 64764",
    },
    {
      name: "SP Cold Storage",
      address: "C38V+VXP, Nanded Road, Somnathpur, Udgir, Dist. Latur, MH - 413517",
      phone: "+91 82085 58227",
    },
  ],
  locations: ["Udgir", "Latur", "Solapur", "Bhalki", "Bidar"],
  yearsOfExperience: new Date().getFullYear() - 1969,
  groupName: "Hude Group",
  foundedYear: 1969,
  farmersConnected: 150000, // "1.5 lakh farmers" via the ITC e-Choupal initiative
  processingCapacityTonsPerDay: 550,
};

// Canonical origin — used by metadata, JSON-LD, sitemap and robots.
export const siteUrl = "https://sachingold.com";
