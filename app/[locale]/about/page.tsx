import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMember";
import Testimonial from "@/components/Testimonial";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";
import PageIntro from "@/components/PageIntro";
import BrandPhoto from "@/components/BrandPhoto";
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

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <>
      {/* Intro band — the shared PageIntro treatment. */}
      <PageIntro eyebrow={t("eyebrow")} title={t("title")}>
        <div className="max-w-3xl">
          <div className="prose-pine max-w-none space-y-4 text-white/80 [&_a:hover]:text-white">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>
              {t("p3Pre")}{" "}
              <a
                href="https://itcportal.com/itc-businesses/agri-business/itc-e-choupal.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wheat-bright underline underline-offset-2 hover:text-white"
              >
                {t("p3Link")}
              </a>{" "}
              {t("p3Post")}
            </p>
          </div>
        </div>
      </PageIntro>

      {/* State-of-the-art processing */}
      <section className="section-standard mx-auto max-w-6xl px-6">
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
              className="mt-8 inline-block rounded-sm bg-pine px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pine-deep"
            >
              {t("facCta")}
            </Link>
          </div>

          {/* Real processing-interior photo behind the facility-tour link —
              the tile previews the real thing it opens (the YouTube tour). */}
          <a
            href="https://youtu.be/v8zIFCYXlDs"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-sm border border-ink/10 transition-shadow hover:shadow-[0_14px_36px_-16px_rgba(10,54,32,0.5)]"
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
      </section>

      {/* Team */}
      <section className="section-standard border-t border-ink/10 bg-linen px-6">
        <Reveal className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={t("teamEyebrow")}
            title={t("teamTitle")}
            align="center"
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-10 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="space-y-2">
                <TeamMemberCard member={member} />
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
          it's a real customer's own words. */}
      <section className="mx-auto max-w-4xl px-6 py-28 md:py-32">
        <SectionHeading eyebrow={t("storyEyebrow")} title={t("storyTitle")} />
        <div className="mt-8">
          <Testimonial testimonial={testimonial} />
        </div>
      </section>

      <CTA />
    </>
  );
}
