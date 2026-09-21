import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Sprout } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMember";
import Testimonial from "@/components/Testimonial";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import PageIntro from "@/components/PageIntro";
import BrandPhoto from "@/components/BrandPhoto";
import StatsBand from "@/components/StatsBand";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/i18n/seo";
import { company } from "@/data/company";
import { team } from "@/data/team";
import { testimonial } from "@/data/testimonial";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("p1").slice(0, 155),
    alternates: buildAlternates("/about"),
  };
}

/**
 * About page — end-to-end redesign. Same real content as before (every
 * paragraph, figure, name and photo traces to data/company.ts,
 * data/team.ts, data/testimonial.ts or the translated message files —
 * nothing invented), but composed as a proper narrative instead of one
 * dense hero followed by two flat sections:
 *
 *   hero (punchy, real tagline) → StatsBand (the numbers the story is
 *   about to tell) → Our Story (p1, real photo) → Our Reach (p2,
 *   location chips) → Community (p3 + the farmers figure as a callout)
 *   → Facilities/processing tour → Team → Partner story (video right
 *   there, no toggle) → CTA.
 */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tStats = await getTranslations("home.stats");

  return (
    <>
      {/* Hero — punchy: eyebrow, title, the company's own real tagline.
          The founding story (p1) now gets its own well-lit section below
          instead of being buried as dense white-on-dark hero copy. */}
      <PageIntro
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={company.tagline}
        image="/images/home/aerial-plant.webp"
      />

      {/* The numbers the story below is about to explain — same figures,
          same component, as Home. */}
      <StatsBand />

      {/* Our Story — p1, verbatim, with a real photo instead of sitting
          alone on a dark band. */}
      <section className="section-standard mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-pine">
                {t("ourStoryEyebrow")}
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                {t("ourStoryTitle")}
              </h2>
              <p className="mt-5 leading-relaxed text-ink/70">{t("p1")}</p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-ink/10 shadow-[0_18px_44px_-24px_rgba(10,54,32,0.35)]">
              <BrandPhoto
                src="/images/home/team-packaging.webp"
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Our Reach — p2, paired with the same location names as chips
          instead of leaving them buried mid-paragraph. */}
      <section className="section-standard border-t border-ink/10 bg-linen/40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow={t("reachEyebrow")}
              title={t("reachTitle")}
              description={t("p2")}
            />
            <ul className="mt-8 flex flex-wrap gap-3">
              {company.locations.map((location) => (
                <li
                  key={location}
                  className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink/75"
                >
                  <MapPin
                    size={14}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="flex-shrink-0 text-pine"
                  />
                  <span>{location}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Community — p3 (the ITC e-Choupal link + farmers figure),
          paired with that exact figure as a callout rather than leaving
          it buried mid-sentence. */}
      <section className="section-standard mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-pine">
                {t("communityEyebrow")}
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                {t("communityTitle")}
              </h2>
              <p className="mt-5 leading-relaxed text-ink/70">
                {t("p3Pre")}{" "}
                <a
                  href="https://itcportal.com/itc-businesses/agri-business/itc-e-choupal.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pine underline underline-offset-2 hover:text-pine-deep"
                >
                  {t("p3Link")}
                </a>{" "}
                {t("p3Post")}
              </p>
            </div>
            <div className="flex items-center justify-center border border-ink/10 bg-linen p-10 text-center">
              <div>
                <Sprout
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mx-auto text-pine"
                />
                <p className="mt-4 font-display text-4xl tabular-nums text-wheat-dark sm:text-5xl">
                  {company.farmersConnected
                    ? `${company.farmersConnected / 100000}L+`
                    : "—"}
                </p>
                <p className="mt-2 text-sm uppercase tracking-wide text-ink/60">
                  {tStats("farmers")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* State-of-the-art processing — real photo behind the facility
          tour link, unchanged from before, now with Reveal like every
          other section on the page. */}
      <section className="section-standard border-t border-ink/10 bg-linen/40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <SectionHeading
                  eyebrow={t("facEyebrow")}
                  title={t("facTitle")}
                  description={`${t("facDesc")}`}
                />
                <ul className="mt-6 space-y-2 text-ink/70">
                  <li>— {t("fac1")}</li>
                  <li>— {t("fac2")}</li>
                  <li>— {t("fac3")}</li>
                </ul>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-sm bg-pine px-6 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-lg"
                >
                  {t("facCta")}
                </Link>
              </div>

              {/* Real processing-interior photo behind the facility-tour
                  link — the tile previews the real thing it opens (the
                  YouTube tour). */}
              <a
                href="https://youtu.be/v8zIFCYXlDs"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex aspect-video items-center justify-center overflow-hidden border border-ink/10 shadow-[0_14px_36px_-16px_rgba(10,54,32,0.5)] transition-shadow hover:shadow-[0_20px_48px_-16px_rgba(10,54,32,0.6)]"
              >
                <BrandPhoto
                  src="/images/home/processing-interior.webp"
                  alt=""
                  sizes="(min-width: 768px) 50vw, 100vw"
                  imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-pine-deep/70 via-pine-deep/45 to-pine-deep/25"
                />
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wheat transition-transform group-hover:scale-105">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="white"
                    aria-hidden="true"
                  >
                    <path d="M5 3l12 7-12 7V3z" />
                  </svg>
                </span>
                <span className="absolute bottom-4 left-0 right-0 text-center text-xs font-medium uppercase tracking-widest text-white/0 transition-colors duration-200 group-hover:text-white/70">
                  {t("videoCaption")}
                </span>
                <span className="sr-only">{t("videoSr")}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="section-standard border-t border-ink/10 px-6">
        <Reveal className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={t("teamEyebrow")}
            title={t("teamTitle")}
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="group space-y-2">
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  <TeamMemberCard member={member} />
                </div>
                {member.facebook && (
                  <p className="text-center">
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ink/50 transition-colors hover:text-pine"
                    >
                      Facebook ↗
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* The one real testimonial — see data/testimonial.ts for why this
          is intentionally singular. The quote itself is never translated:
          it's a real customer's own words. Video sits right beside it,
          one click away — no toggle. */}
      <section className="section-standard border-t border-ink/10 bg-linen/40 px-6">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading
              eyebrow={t("storyEyebrow")}
              title={t("storyTitle")}
            />
            <div className="mt-8">
              <Testimonial testimonial={testimonial} />
            </div>
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}
