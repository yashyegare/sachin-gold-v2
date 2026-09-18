import { homeStats } from "@/data/stats";

/**
 * Credibility strip, meant to sit directly below the Hero. Numbers are
 * the one other place (besides the Hero's CTA and eyebrow) where gold is
 * used deliberately — everywhere else on the page is green/ink/white.
 * text-wheat-dark holds AA (5.4:1) on the white band; tabular-nums keeps
 * the digits evenly spaced so the four values align optically.
 */
export default function StatsBand() {
  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-ink/10 px-6 sm:grid-cols-4">
        {homeStats.map((stat) => (
          <div
            key={stat.label}
            className="px-4 py-10 text-center first:pl-0 last:pr-0"
          >
            <p className="font-display text-3xl tabular-nums text-wheat-dark sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm uppercase tracking-wide text-ink/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
