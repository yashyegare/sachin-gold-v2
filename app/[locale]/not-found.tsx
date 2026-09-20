import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

// Phase 8, item 6 — a sane, on-brand 404, now inside the locale layout so
// Navbar/Footer render and the copy translates. (Next 14 has no root
// layout above [locale], so the root not-found.tsx can't render HTML —
// this file is the effective 404 for every route.)
export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wheat-dark">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">{t("title")}</h1>
      <p className="mx-auto mt-4 max-w-prose text-ink/70">{t("body")}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
        <Link
          href="/"
          className="bg-pine px-6 py-3 font-semibold text-linen transition-colors hover:bg-pine-deep"
        >
          {t("home")}
        </Link>
        <Link
          href="/services"
          className="border border-ink/20 px-6 py-3 font-semibold text-ink transition-colors hover:border-pine"
        >
          {t("services")}
        </Link>
        <Link
          href="/rates"
          className="border border-ink/20 px-6 py-3 font-semibold text-ink transition-colors hover:border-pine"
        >
          {t("rates")}
        </Link>
        <Link
          href="/contact"
          className="border border-ink/20 px-6 py-3 font-semibold text-ink transition-colors hover:border-pine"
        >
          {t("contact")}
        </Link>
      </div>
    </section>
  );
}
