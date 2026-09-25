import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  MapPin,
  Sprout,
  Wheat,
  Factory,
  Warehouse,
  Truck,
  Droplets,
  Gauge,
  Store,
  FlaskConical,
  ThermometerSnowflake,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMember";
import Testimonial from "@/components/Testimonial";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import BrandPhoto from "@/components/BrandPhoto";
import StatsBand from "@/components/StatsBand";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/i18n/seo";
import { company, locationRoles } from "@/data/company";
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
      {/* Hero — the one full-bleed photographic opener on the site,
          deliberately breaking the PageIntro pattern: About is the
          narrative page, and an edge-to-edge real photo with the
          headline overlaid reads as an event, not another band. The
          processing interior is About's alone — Home never shows it —
          so no photo repeats across Home → About at the same weight. */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-pine-deep">
        <div
          className="animate-curtain absolute inset-0"
          aria-hidden="true"
        >
          <BrandPhoto
            src="/images/home/processing-interior.webp"
            alt=""
            sizes="100vw"
            priority
          />
          {/* Scrim from the bottom-left so the overlaid copy keeps AA
              contrast over whatever the sky is doing */}
          <div className="absolute inset-0 bg-gradient-to-t from-pine-deep via-pine-deep/55 to-pine-deep/10" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wheat-bright">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-display-xl text-white">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
            {t("tagline")}
          </p>
        </div>
      </section>

      {/* The numbers the story below is about to explain — same figures,
          same component, as Home. */}
      <StatsBand />

      {/* Our Story — p1, verbatim, with a real photo instead of sitting
          alone on a dark band. Asymmetric 60/40, not the even 50/50
          every other page uses — the copy is the subject here. */}
      <section className="section-standard mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-pine">
                {t("ourStoryEyebrow")}
              </p>
              <h2 className="mt-2 font-display text-display-lg text-ink">
                {t("ourStoryTitle")}
              </h2>
              <p className="mt-5 max-w-prose leading-relaxed text-ink/70 drop-cap">
                {t("p1")}
              </p>
            </div>
            <div className="relative aspect-[3/2] overflow-hidden border border-ink/10 shadow-elevated-lg">
              <BrandPhoto
                src="/images/home/team-packaging.webp"
                alt=""
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Our Reach — p2, now as fact cards in the How It Works family:
          white bordered cards on the linen band, icon chip + state tag
          header, town name, and the location's real capabilities as
          pills. The roles aggregate each town's attested capabilities
          from the service pages (data/company.ts locationRoles) — the
          old flat chip row buried all of that. */}
      <section className="section-standard border-t border-ink/10 bg-linen/40">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow={t("reachEyebrow")}
              title={t("reachTitle")}
              description={t("p2")}
            />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {locationRoles.map((location, i) => (
                <li
                  key={location.name}
                  className="group flex h-full flex-col border border-ink/10 bg-white p-5 shadow-elevated-sm transition-all duration-300 [transition-timing-function:var(--ease-brand)] hover:-translate-y-1 hover:border-pine/30 hover:shadow-elevated lg:p-6"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-pine/25 bg-linen"
                    >
                      <MapPin
                        size={18}
                        strokeWidth={1.5}
                        className="text-pine"
                      />
                    </span>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-wheat-dark">
                      {t(`reach${i + 1}State` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink">
                    {location.name}
                  </h3>
                  {/* Capability pills — the old section's chip language,
                      shrunk into the card. */}
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {(t(`reach${i + 1}Roles` as Parameters<typeof t>[0]) as string)
                      .split("·")
                      .map((role) => (
                        <li
                          key={role}
                          className="rounded-full border border-ink/10 bg-linen/60 px-2.5 py-1 text-[0.65rem] font-medium text-ink/70"
                        >
                          {role}
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Community — p3 (the ITC e-Choupal link + farmers figure),
          paired with that exact figure as a callout rather than leaving
          it buried mid-sentence.

          THE one off-grid moment on the site (deliberately singular —
          the effect depends on rarity): the stat card overhangs the
          section's bottom boundary, straddling the border into the next
          section. Desktop only — on mobile it stacks back inside the
          flow, where an overhang would just read as a layout bug. The
          next section gives the overhang headroom via md:pt-24. */}
      <section className="section-standard mx-auto max-w-6xl px-6 md:pb-0">
        <Reveal>
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-pine">
                {t("communityEyebrow")}
              </p>
              <h2 className="mt-2 font-display text-display-lg text-ink">
                {t("communityTitle")}
              </h2>
              <p className="mt-5 max-w-prose leading-relaxed text-ink/70">
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
            {/* Same card family as How It Works / Our Reach — white,
                hairline border, icon chip — carrying the overhang moment
                (kept deliberately singular). */}
            <div className="flex items-center justify-center border border-ink/10 bg-white p-10 text-center shadow-elevated-sm md:translate-y-16 md:shadow-elevated">
              <div>
                <span
                  aria-hidden="true"
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-pine/25 bg-linen"
                >
                  <Sprout
                    size={24}
                    strokeWidth={1.5}
                    className="text-pine"
                  />
                </span>
                <p className="mt-4 font-display text-display-xl tabular-nums text-wheat-dark">
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

      {/* How It Works — new section, built from real facts that already
          existed scattered across the 5 service pages (sourcing details
          from commodity-trading, the 550t/day Buhler line from pulses,
          solvent extraction from oil-extraction, dry+cold from
          cold-storage, the owned fleet from logistics) but never told as
          one continuous story anywhere on the site. Home's
          ServicesShowcase already visualizes the 5 services as a chain;
          this isn't a duplicate of that — it's the narrative version,
          consolidating processing's two separate lines (pulses, oil)
          into one stage, told in real prose rather than a card grid.
          Numbered stages are the right device here (unlike the service
          page's "advantages" list) because sourcing → processing →
          storage → logistics is a genuine, ordered sequence. */}
      {/* How It Works — new section, built from real facts that already
          existed scattered across the 5 service pages (sourcing details
          from commodity-trading, the 550t/day Buhler line from pulses,
          solvent extraction from oil-extraction, dry+cold from
          cold-storage, the owned fleet from logistics) but never told as
          one continuous story anywhere on the site.

          Composition: the bare two-column numbers-and-prose grid read as
          filler — the four stages now sit in equal fact cards (numbered
          chip + stage icon, narrative, and a real figure pinned to the
          card foot, so the eye gets a scannable take-away per stage).
          Card hover mirrors the site-wide lift language; stats all trace
          to data/company.ts or the service pages (Phase 9 confirm list).

          Each whole tile links to its service page (largest tap target,
          same full-card pattern as the home rail — friendlier than a
          small text link). Mapping follows each card's lead story and
          mirrors the real five-stage chain: Sourcing → commodity
          trading, Processing → pulses unit, Extraction → oil seed
          extraction, Storage → cold storage, Logistics → logistics. */}
      <section className="section-standard border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <SectionHeading
              eyebrow={t("processEyebrow")}
              title={t("processTitle")}
              description={t("processDesc")}
            />
          </Reveal>
          {/* Five cards on one desktop row — the full chain at a glance,
              matching the home rail's five-across rhythm. Slightly lower
              padding than the 4-up version so the narrower columns keep
              comfortable gutters. */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                {
                  icon: Wheat,
                  statIcon: MapPin,
                  title: "process1Title",
                  desc: "process1Desc",
                  stat: "process1Stat",
                  href: "/services/commodity-trading",
                },
                {
                  icon: Factory,
                  statIcon: Gauge,
                  title: "process2Title",
                  desc: "process2Desc",
                  stat: "process2Stat",
                  href: "/services/pulses-processing",
                },
                {
                  icon: Droplets,
                  statIcon: FlaskConical,
                  title: "process3Title",
                  desc: "process3Desc",
                  stat: "process3Stat",
                  href: "/services/oil-extraction",
                },
                {
                  icon: Warehouse,
                  statIcon: ThermometerSnowflake,
                  title: "process4Title",
                  desc: "process4Desc",
                  stat: "process4Stat",
                  href: "/services/cold-storage",
                },
                {
                  icon: Truck,
                  statIcon: Store,
                  title: "process5Title",
                  desc: "process5Desc",
                  stat: "process5Stat",
                  href: "/services/logistics",
                },
              ] as const satisfies ReadonlyArray<{
                icon: LucideIcon;
                statIcon: LucideIcon;
                title: string;
                desc: string;
                stat: string;
                href: string;
              }>
            ).map((stage, i) => (
              <Reveal
                key={stage.title}
                className="h-full"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Whole tile as the link — the sitewide :focus-visible
                    ring lands on the <a> wrapper, the group-hover lift
                    stays on the card. */}
                <Link
                  href={stage.href}
                  className="group block h-full rounded-sm"
                >
                  <article className="flex h-full flex-col border border-ink/10 bg-white p-5 shadow-elevated-sm transition-all duration-300 [transition-timing-function:var(--ease-brand)] group-hover:-translate-y-1 group-hover:border-pine/30 group-hover:shadow-elevated lg:p-6">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-pine/25 bg-linen font-display text-sm text-pine"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <stage.icon
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="text-wheat-dark transition-transform duration-300 [transition-timing-function:var(--ease-brand)] group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-4 font-display text-lg text-ink">
                    {t(stage.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {t(stage.desc)}
                  </p>
                  {/* The stage's one real figure, pinned to the card foot
                      so all four stats align across the row regardless of
                      how long each narrative runs in any locale. */}
                  {/* The stage's one real figure, pinned to the card foot.
                      The foot reserves two text lines (min-h) so the
                      hairline divider sits at the same height on all five
                      cards even when a locale's stat wraps — at five-across
                      widths, several do. */}
                  <div className="mt-auto min-h-[3.5rem] border-t border-ink/[0.08] pt-3">
                    <p className="flex items-start gap-1.5 text-xs font-semibold leading-relaxed text-wheat-dark">
                      <stage.statIcon
                        size={12}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="mt-0.5 flex-shrink-0"
                      />
                      {t(stage.stat)}
                    </p>
                  </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Forwardable profile — a bulk buyer often needs something to
              hand to someone else in their organization; this compiles
              the same real data the site shows into a print-ready PDF
              generated from the data layer at /profile.pdf. Placed here,
              right after the process story it excerpts, as a quiet
              action rather than a shouty banner — aligned to the grid's
              left edge so it reads as part of the section, not a stray
              floating element. */}
          <Reveal className="mt-12">
            <div className="max-w-xl">
              <PdfDownloadButton
                href="/profile.pdf"
                label={t("downloadProfile")}
                hint="PDF"
                variant="quiet"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* State-of-the-art processing — real photo behind the facility
          tour link, now with the video's own thumbnail frame. Extra top
          padding on md+ gives the Community callout's overhang its
          headroom. */}
      <section className="section-standard border-t border-ink/10 bg-linen/40 md:pt-24">
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

              {/* The facility-tour video's actual YouTube thumbnail frame
                  (pulled from the video itself into
                  /images/facility/facility-tour-poster.webp) — a preview
                  should show the video, not a stand-in photo. The heavy
                  pine gradient of the old treatment is gone: over a real
                  frame, the play chip, hairline border and hover lift
                  carry the affordance, with only a whisper of scrim for
                  play-button contrast. */}
              <a
                href="https://youtu.be/v8zIFCYXlDs"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex aspect-video items-center justify-center overflow-hidden border border-ink/10 shadow-elevated-lg transition-all duration-300 [transition-timing-function:var(--ease-brand)] hover:-translate-y-1 hover:shadow-elevated-deep"
              >
                <BrandPhoto
                  src="/images/facility/facility-tour-poster.webp"
                  alt=""
                  sizes="(min-width: 768px) 50vw, 100vw"
                  imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-pine-deep/20 transition-colors duration-300 [transition-timing-function:var(--ease-brand)] group-hover:bg-pine-deep/5"
                />
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-wheat shadow-elevated ring-4 ring-white/25 transition-transform duration-300 [transition-timing-function:var(--ease-brand)] group-hover:scale-105">
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
                <span className="absolute bottom-4 left-0 right-0 text-center text-xs font-medium uppercase tracking-widest text-white/0 transition-colors duration-200 group-hover:text-white/80">
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
          {/* Portrait-ratio photos (Founder placeholder — none exists
              yet) render as the round headshot; the directors' real
              photos are landscape studio shots, so they render at their
              full ratio in a bordered card — same presentation the old
              site used, where they looked clear and correct. A photo
              squeezed into a small square crop is exactly what made the
              directors look blurry. */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-3">
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
