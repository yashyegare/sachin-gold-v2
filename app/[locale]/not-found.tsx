import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

// Phase 8, item 6 — a sane, on-brand 404, inside the locale layout so
// Navbar/Footer render and the copy translates. (Next 14 has no root
// layout above [locale], so the root not-found.tsx can't render HTML —
// this file is the effective 404 for every route.)
//
// This page is often a first impression (bad search result, stale link),
// so it carries the site's identity instead of flat white: the shared
// pine-deep band with the gold dot texture — the same treatment every
// inner page opens with — plus the real facility photo blended in and
// the destination links as proper cards.
export default async function NotFound() {
  const t = await getTranslations("notFound");

  const links = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/rates", label: t("rates") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <section className="relative overflow-hidden bg-pine-deep">
      {/* The shared texture, one gold dot pattern at low opacity */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <pattern
          id="not-found-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="#B68A1E" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#not-found-dots)" />
      </svg>

      {/* Real facility photo blended from the right — identity without
          competing with the copy */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-pine-deep via-pine-deep/95 to-pine-deep/40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <p className="font-display text-6xl leading-none text-wheat-bright sm:text-7xl">
          404
        </p>
        <h1 className="mt-4 font-display text-display-lg text-white">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-prose leading-relaxed text-white/75">
          {t("body")}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
