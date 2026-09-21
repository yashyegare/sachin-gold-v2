import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import { company } from "@/data/company";

/**
 * Credibility strip, sits directly below the Hero. Numbers are the one
 * other place (besides the Hero's CTA and eyebrow) where gold is used
 * deliberately on light surfaces. text-wheat-dark holds AA (5.4:1) on the
 * white band; tabular-nums keeps the digits evenly spaced so the four
 * values align optically. Figures come from the real company data; labels
 * are translated.
 */
export default async function StatsBand() {
  const t = await getTranslations("home.stats");

  const stats = [
    {
      value: `${company.yearsOfExperience}+`,
      label: t("years"),
    },
    {
      value: `${company.locations.length}`,
      label: t("locations"),
    },
    {
      value: company.processingCapacityTonsPerDay
        ? `${company.processingCapacityTonsPerDay}`
        : "—",
      label: t("tons"),
    },
    {
      // Exact figure: 150000 / 100000 = 1.5 — do NOT round, "2L+" would
      // overstate the client's own published claim.
      value: company.farmersConnected
        ? `${company.farmersConnected / 100000}L+`
        : "—",
      label: t("farmers"),
    },
  ];

  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-ink/10 px-6 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            className="px-4 py-10 text-center first:pl-0 last:pr-0"
          >
            <div style={{ transitionDelay: `${i * 70}ms` }}>
              <p className="font-display text-display-lg tabular-nums text-wheat-dark">
                {stat.value}
              </p>
              <p className="mt-2 text-sm uppercase tracking-wide text-ink/60">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
