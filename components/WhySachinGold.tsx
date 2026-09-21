import BrandPhoto from "@/components/BrandPhoto";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";

/**
 * "Why Sachin Gold" — the homepage's one genuinely dark section, and the
 * condensed version of the old site's "Why Choose Us" narrative. The old
 * site's own layout for this block used a team photograph beside the copy
 * — team_img_1.png, their choice — reused here with the brand photo
 * treatment. Every figure is the client's own published claim, already on
 * the Phase 9 confirm list.
 */
export default async function WhySachinGold() {
  const t = await getTranslations("home.why");

  return (
    <section className="relative overflow-hidden bg-[#06130c] grain-dark">
      {/* Aerial plant backdrop, barely-there — texture, not a picture.
          Now with a slow scroll-tied drift (the Hero's Ken Burns idea,
          extended to scroll): the hook self-disables for reduced-motion
          and touch-only visitors, so this is a plain static layer for
          them. Oversized (inset -8%) so the drift never exposes an edge. */}
      <div className="absolute -inset-[8%] opacity-25" aria-hidden="true">
        <Parallax speed={0.06} className="h-full w-full">
          <BrandPhoto src="/images/home/aerial-plant.webp" alt="" sizes="100vw" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06130c]/60 via-[#06130c]/80 to-[#06130c]" />
      </div>

      <div className="section-airy relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-wheat-bright">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 font-display text-display-lg text-white">
              {t("title", { years: company.yearsOfExperience })}
            </h2>
            <p className="mt-5 leading-relaxed text-white/70">{t("body")}</p>

            {/* The proof, as figures — same numbers the whole site uses. */}
            <dl className="mt-9 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {[
                {
                  value: String(company.processingCapacityTonsPerDay),
                  label: t("figTons"),
                },
                {
                  value: `${company.locations.length}`,
                  label: t("figLocations"),
                },
                {
                  value: "1,000+",
                  label: t("figStores"),
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display text-display-md tabular-nums text-wheat-bright">
                    {stat.value}
                  </dd>
                  <dt className="mt-1.5 text-xs leading-snug text-white/55">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            <Link
              href="/about"
              className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-wheat-bright transition-colors hover:text-white"
            >
              {t("readMore")}
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          {/* The team-with-our-own-packaging photograph — the client's own
              choice for this exact narrative on the old site. */}
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 shadow-elevated-deep">
              <BrandPhoto
                src="/images/home/team-packaging.webp"
                alt="The Sachin Gold team with branded Toor Dal and Besan packaging"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <p className="mt-3 text-center text-xs text-white/40">
              {t("caption")}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
