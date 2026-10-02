import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { services } from "@/data/services";
import PdfDownloadButton from "@/components/PdfDownloadButton";

/**
 * Four columns: the brand lockup and its forwardable profile, the site
 * map, the five service lines, and the head office. The column headings
 * (`footer.companyTitle` / `servicesTitle` / `contactTitle`) were in the
 * message catalog from the start and unused — an unlabelled list of links
 * reads as filler, so they are back.
 *
 * The lockup is stacked and centred — badge, then wordmark, then tagline,
 * then the group line, all on one shared centre axis. Side by side, the
 * badge had to shrink to fit the column next to the wordmark and the
 * shield's detail went muddy; on its own line it can carry 104px and stay
 * legible, which is the point of the mark.
 */
const LINK_CLASS =
  "inline-flex min-h-[44px] items-center text-ink/70 transition-colors hover:text-pine md:min-h-[34px]";

const HEADING_CLASS =
  "text-[0.7rem] font-semibold uppercase tracking-widest text-pine";

export default async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  return (
    <footer className="border-t border-ink/10 bg-linen">
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-12 px-6 py-14 sm:grid-cols-2 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.15fr)]">
        {/* ————— Brand ————————————————————————————————————————————— */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/brand/sachin-badge-lg.webp"
            alt=""
            width={400}
            height={379}
            unoptimized
            className="h-[104px] w-auto rounded-[10px]"
          />
          <p className="mt-4 font-display text-[2.4rem] leading-[1.05] text-ink">
            Sachin <span className="text-wheat-dark">Gold</span>
          </p>
          <p className="mt-1.5 max-w-[16rem] text-sm leading-snug text-ink/60">
            {t("tagline")}
          </p>
          <p className="mt-4 text-xs text-ink/45">
            {company.groupName} <span aria-hidden="true">·</span> Est.{" "}
            {company.foundedYear}
          </p>

          <PdfDownloadButton
            href="/profile.pdf"
            label={t("profile")}
            className="mt-6"
          />
        </div>

        {/* ————— Site map ————————————————————————————————————————— */}
        {/* Section anchors sit directly under the page that holds them, so
            the column reads as a hierarchy rather than eight loose links —
            and gives the long About page and the Contact FAQ a way in that
            the primary nav, which is already tight at 1024px, does not. */}
        <nav aria-label={t("companyTitle")}>
          <p className={HEADING_CLASS}>{t("companyTitle")}</p>
          <ul className="mt-1 text-sm">
            {(
              [
                ["/", tNav("home")],
                ["/about", tNav("about")],
                ["/about#team", t("team")],
                ["/services", tNav("services")],
                ["/services#products", t("products")],
                ["/rates", tNav("rates")],
                ["/contact", tNav("contact")],
                ["/contact#faq", t("faq")],
              ] as const
            ).map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={LINK_CLASS}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ————— Service lines ————————————————————————————————————— */}
        <nav aria-label={t("servicesTitle")}>
          <p className={HEADING_CLASS}>{t("servicesTitle")}</p>
          <ul className="mt-1 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className={`${LINK_CLASS} max-w-[16rem]`}
                >
                  {tNav(`serviceSlugs.${service.slug}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ————— Head office ——————————————————————————————————————— */}
        <div>
          <p className={HEADING_CLASS}>{t("contactTitle")}</p>
          <ul className="mt-1 text-sm text-ink/70">
            <li>
              <a
                href={company.facilities[0]?.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${LINK_CLASS} max-w-[17rem] gap-2 hover:text-pine`}
              >
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 self-start text-pine"
                  aria-hidden="true"
                />
                {company.facilities[0]?.address}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                className={`${LINK_CLASS} gap-2 hover:text-pine`}
              >
                <Phone size={14} className="shrink-0 text-pine" aria-hidden="true" />
                {company.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${company.email}`}
                className={`${LINK_CLASS} gap-2 break-all hover:text-pine`}
              >
                <Mail size={14} className="shrink-0 text-pine" aria-hidden="true" />
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ————— Legal strip — left-aligned with the columns above, the
            privacy link carried over to the trailing edge. ————— */}
      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-5 text-xs text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. {t("rights")}
          </p>
          <Link
            href="/privacy"
            className="inline-flex min-h-[36px] items-center transition-colors hover:text-pine hover:underline sm:min-h-0"
          >
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
