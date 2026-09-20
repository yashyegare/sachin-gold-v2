import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BrandPhoto from "@/components/BrandPhoto";
import CustomerLogos from "@/components/CustomerLogos";
import PageIntro from "@/components/PageIntro";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/i18n/seo";
import { services } from "@/data/services";
import { getProductsByService } from "@/data/products";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("intro.title"),
    description: t("intro.description"),
    alternates: buildAlternates("/services"),
  };
}

/**
 * The services overview — a primary nav destination, so it gets the shared
 * PageIntro opening. One full-width row per service: large real photo, the
 * full translated description, real advantages as a checklist, real
 * locations as chips, and a preview of the real products behind each
 * service. Stage numbers 01–05 carry the "one integrated chain" idea.
 * Every fact below already existed in the data layer — nothing invented.
 */
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tStats = await getTranslations("home.stats");

  return (
    <>
      {/* ————— Opening band ————— */}
      <PageIntro
        eyebrow={t("intro.eyebrow")}
        title={t("intro.title")}
        description={t("intro.description")}
      >
        {/* The quiet path for visitors who already know what they need. */}
        <p className="text-sm">
          <a
            href={whatsappLink(
              company.whatsapp,
              "Hi Sachin Gold, I'm not sure which service I need — I'd like to discuss my requirement.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 underline decoration-white/30 underline-offset-4 transition-colors hover:text-wheat-bright hover:decoration-wheat-bright"
          >
            {t("intro.notSure")} →
          </a>
        </p>

        {/* Scale strip — the real figures (from company data), with
            labels translated; right where a buyer is evaluating whether
            we can deliver. */}
        <div className="mt-10 border-t border-white/15 pt-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {[
              { value: `${company.yearsOfExperience}+`, label: tStats("years") },
              { value: `${company.locations.length}`, label: tStats("locations") },
              {
                value: company.processingCapacityTonsPerDay
                  ? `${company.processingCapacityTonsPerDay}`
                  : "—",
                label: tStats("tons"),
              },
              {
                value: company.farmersConnected
                  ? `${company.farmersConnected / 100000}L+`
                  : "—",
                label: tStats("farmers"),
              },
            ].map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-2xl tabular-nums text-wheat-bright sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-xs uppercase tracking-wide text-white/60">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </PageIntro>

      {/* ————— The five stages: alternating full rows ————— */}
      <section
        aria-label={t("intro.title")}
        className="section-standard mx-auto max-w-6xl px-6"
      >
        {services.map((service, i) => {
          const products = getProductsByService(service.slug).slice(0, 3);
          const flipped = i % 2 === 1;
          return (
            <Reveal key={service.slug} className={i > 0 ? "mt-20 md:mt-28" : ""}>
              <article className="group grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                {/* Photo — one side or the other, alternating down the page */}
                <div className={flipped ? "md:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden border border-ink/10 shadow-[0_18px_44px_-24px_rgba(10,54,32,0.35)]">
                    <BrandPhoto
                      src={service.image}
                      alt=""
                      sizes="(min-width: 768px) 50vw, 100vw"
                      imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Copy */}
                <div className={flipped ? "md:order-1" : ""}>
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span
                      aria-hidden="true"
                      className="font-display text-5xl leading-none text-wheat-dark sm:text-6xl"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden="true" className="h-10 w-px bg-pine/20" />
                    <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
                      {t(`items.${service.slug}.title`)}
                    </h2>
                  </div>

                  <p className="mt-5 leading-relaxed text-ink/70">
                    {t(`items.${service.slug}.description`)}
                  </p>

                  {/* Real advantages — the strongest three per service */}
                  <ul className="mt-6 space-y-2.5">
                    {t
                      .raw(`items.${service.slug}.advantages`)
                      .slice(0, 3)
                      .map(
                        (
                          advantage: string,
                        ) => (
                          <li
                            key={advantage}
                            className="flex items-start gap-2.5 text-sm text-ink/80"
                          >
                            <Check
                              size={15}
                              strokeWidth={2}
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-pine"
                            />
                            {advantage}
                          </li>
                        ),
                      )}
                  </ul>

                  {/* Product preview — what's actually on the detail page.
                      Product names stay Latin in every locale. */}
                  {products.length > 0 && (
                    <p className="mt-6 text-sm text-ink/60">
                      <span className="font-semibold text-pine">
                        {t("inThisLine")}{" "}
                      </span>
                      {products.map((product) => product.name).join(" · ")}
                    </p>
                  )}

                  {/* Real per-service locations — translated short form;
                      the detail page carries the full descriptions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t
                      .raw(`items.${service.slug}.locations`)
                      .map(
                        (
                          location: string,
                        ) => (
                          <span
                            key={location}
                            className="border border-ink/15 px-2.5 py-1 text-xs text-ink/60"
                          >
                            {location}
                          </span>
                        ),
                      )}
                  </div>

                  <Link
                    href={service.href}
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-pine transition-colors hover:text-pine-deep"
                  >
                    {t("explore", {
                      title: t(`items.${service.slug}.title`),
                    })}
                    <ArrowRight
                      size={14}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      {/* Trust proof at the decision point. */}
      <CustomerLogos />

      <CTA />
    </>
  );
}
