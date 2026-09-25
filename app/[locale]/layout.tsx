import type { Metadata, Viewport } from "next";
import {
  Inter,
  Marcellus,
  Noto_Sans_Devanagari,
  Noto_Sans_Kannada,
  Noto_Sans_Telugu,
  Noto_Sans_Tamil,
  Noto_Serif_Devanagari,
  Noto_Serif_Kannada,
  Noto_Serif_Telugu,
  Noto_Serif_Tamil,
} from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyContactButtons from "@/components/StickyContactButtons";
import LanguageGate from "@/components/LanguageGate";
import LcpProbe from "@/components/LcpProbe";
import { company, siteUrl } from "@/data/company";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/i18n/seo";
import "../globals.css";

// Fonts: the Latin brand pair (Inter/Marcellus) plus the Noto families for
// the four scripts the translated locales render. Marcellus and Inter
// carry no Devanagari/Kannada/Telugu/Tamil glyphs — without these, all
// headings and body text in hi/mr/kn/te/ta would silently fall back to
// the browser default. Serif variants keep the display voice; Sans covers
// body text. Each next/font export self-hosts only the glyphs its
// unicode-range requires, so a locale downloads its own script's font and
// no others.
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

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
});
const notoSansKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  variable: "--font-noto-sans-kannada",
  display: "swap",
});
const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  variable: "--font-noto-sans-telugu",
  display: "swap",
});
const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-sans-tamil",
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-devanagari",
  display: "swap",
});
const notoSerifKannada = Noto_Serif_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-kannada",
  display: "swap",
});
const notoSerifTelugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-telugu",
  display: "swap",
});
const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-tamil",
  display: "swap",
});

// Generates the static params for every locale × page combination so the
// whole site renders statically (the plan's performance mandate) instead
// of falling back to on-demand SSR.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const validLocale = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${company.name} | ${company.tagline}`,
      template: `%s | ${company.name}`,
    },
    description: t("description"),
    alternates: buildAlternates("/"),
    openGraph: {
      type: "website",
      siteName: company.name,
      url: siteUrl,
      title: `${company.name} | ${company.tagline}`,
      description: t("description"),
      locale: validLocale === "en" ? "en_IN" : validLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${company.name} | ${company.tagline}`,
      description: t("description"),
    },
  };
}

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Invalid locales 404 — middleware normally prevents this, but a direct
  // request must never render the chrome under the wrong language.
  if (!routing.locales.includes(locale as Locale)) notFound();

  // Enable static rendering for this request (next-intl's SSG contract).
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations("notFound");

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${marcellus.variable} ${notoSansDevanagari.variable} ${notoSansKannada.variable} ${notoSansTelugu.variable} ${notoSansTamil.variable} ${notoSerifDevanagari.variable} ${notoSerifKannada.variable} ${notoSerifTelugu.variable} ${notoSerifTamil.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        {/* Skip link: first focusable element on every page, so keyboard
            users don't tab through the whole navbar each time. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-pine focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-linen"
        >
          {t("skipToContent")}
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 focus:outline-none"
          >
            {children}
          </main>
          <Footer />
          {/* Persistent floating actions — Enquiry + WhatsApp, the
              expected always-visible chat affordance on Indian B2B
              sites, now paired with a form option too. Both slide away
              together while the home hero controls own that corner
              (see the component). */}
          <StickyContactButtons />
          {/* First-visit language gate — one calm modal, once per browser.
              Self-silencing (localStorage); a no-op for returning visitors. */}
          <LanguageGate />
          {/* Dev-only: logs the real LCP element/value to the console so
              the hero carousel / font-swap cost is measured, not argued. */}
          <LcpProbe />
        </NextIntlClientProvider>
        {/* Vercel Analytics + Speed Insights — cookieless, no consent banner
            needed. Both render nothing outside Vercel deployments, so local
            dev is unaffected. This is the site's only measurement; without
            it every launch decision (rates page usage, WhatsApp clicks,
            Indic-language traffic) is a guess. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
