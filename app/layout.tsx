import type { Metadata, Viewport } from "next";
import { Inter, Marcellus } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSplash from "@/components/BrandSplash";
import { company, siteUrl } from "@/data/company";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} | ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description:
    "Trusted partner for bulk agro commodities — trading, pulses processing, oil extraction, cold storage and logistics across Maharashtra and Karnataka.",
  openGraph: {
    type: "website",
    siteName: company.name,
    url: siteUrl,
    title: `${company.name} | ${company.tagline}`,
    description:
      "Bulk agro commodities since 1969 — toor and chana dal processing, bulk Soya DOC extraction, cold storage and logistics across Maharashtra and Karnataka.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | ${company.tagline}`,
    description:
      "Bulk agro commodities since 1969 — trading, processing, cold storage and logistics across Maharashtra and Karnataka.",
  },
};

// Colors the browser UI on mobile to match the brand surface. (Own export
// per Next 14's metadata/viewport split.)
export const viewport: Viewport = {
  themeColor: "#0A3620",
};

// Phase 7, item 4 — Organization + LocalBusiness JSON-LD in the root
// layout. Every field traces to captured live-site data (founding year,
// legal name, Main Plant address); confirm all with the client in Phase 9.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: company.name,
      legalName: company.legalName,
      parentOrganization: company.groupName
        ? { "@type": "Organization", name: company.groupName }
        : undefined,
      url: siteUrl,
      description: company.tagline,
      foundingDate: `${company.foundedYear ?? 1969}`,
      email: company.email,
      telephone: company.phone,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: company.name,
      legalName: company.legalName,
      url: siteUrl,
      email: company.email,
      telephone: company.phone,
      // Main Plant's captured address — real data from the live contact page.
      address: {
        "@type": "PostalAddress",
        streetAddress: company.facilities[0]?.address,
        addressLocality: "Udgir",
        addressRegion: "Maharashtra",
        postalCode: "413517",
        addressCountry: "IN",
      },
      // States, not cities — company.locations holds the operating cities
      // (Udgir, Latur, …); areaServed here is the broader footprint.
      areaServed: ["Maharashtra", "Karnataka"].map((name) => ({
        "@type": "State",
        name,
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${marcellus.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        {/* Skip link: first focusable element on every page, so keyboard
            users don't tab through the whole navbar each time. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-pine focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-linen"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Once-per-session brand splash over everything (skipped for
            reduced-motion visitors and repeat views in the session). */}
        <BrandSplash />
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
