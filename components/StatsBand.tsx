import { getTranslations } from "next-intl/server";
import Reveal from "@/components/Reveal";
import CountUpStat from "@/components/CountUpStat";
import { company } from "@/data/company";

/**
 * Credibility strip, sits directly below the Hero. Numbers are the one
 * other place (besides the Hero's CTA and eyebrow) where gold is used
 * deliberately on light surfaces. text-wheat-dark holds AA (5.4:1) on the
 * white band; tabular-nums keeps the digits evenly spaced so the four
 * values align optically. Figures come from the real company data; labels
 * are translated.
 *
 * The figures count up from 0 when the band scrolls into view
 * (CountUpStat): the credibility strip earns its moment like the ticker
 * and hero already do. Server output is still the final value — SEO, no
 * JS and reduced-motion users see plain numbers instantly.
 */
export default async function StatsBand() {
  const t = await getTranslations("home.stats");

  const stats: {
    number: number;
    suffix?: string;
    decimals?: number;
    label: string;
    animate: boolean;
  }[] = [
    {
      number: company.yearsOfExperience,
      suffix: "+",
      label: t("years"),
      animate: true,
    },
    {
      number: company.locations.length,
      label: t("locations"),
      animate: true,
    },
    {
      number: company.processingCapacityTonsPerDay ?? 0,
      label: t("tons"),
      // Only animate when the figure is real; a missing value renders "—"
      // below, never a count-up to 0.
      animate: company.processingCapacityTonsPerDay !== undefined,
    },
    {
      // Exact figure: 150000 / 100000 = 1.5 — do NOT round, "2L+" would
      // overstate the client's own published claim.
      number: company.farmersConnected
        ? company.farmersConnected / 100000
        : 0,
      decimals: 1,
      suffix: "L+",
      label: t("farmers"),
      animate: Boolean(company.farmersConnected),
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
              {stat.animate ? (
                <CountUpStat
                  number={stat.number}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  className="font-display text-display-lg tabular-nums text-wheat-dark"
                />
              ) : (
                <p className="font-display text-display-lg tabular-nums text-wheat-dark">
                  —
                </p>
              )}
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
