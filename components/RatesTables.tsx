"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Droplets,
  MessageCircle,
  TimerReset,
  Wheat,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

/**
 * The rate tables, as one client island: the "as quoted / per quintal"
 * switch has to be shared by both groups, so the toggle and the tables
 * cannot be separate server-rendered blocks.
 *
 * Actions here follow one rule — a loud enquiry per line group, and a
 * restrained labelled chip per row. Eleven identical green buttons turned
 * the price list into a button grid and made the numbers harder to read
 * than the WhatsApp flow they were meant to serve, so the row chip is
 * white-on-hairline until you point at it. It keeps the same per-product
 * prefilled message (built on the server, so the copy stays in one place)
 * and the row text stays selectable: a buyer at a mandi reads the number
 * out or copies it, they do not press the row.
 */

export interface RateRowView {
  product: string;
  flagship: boolean;
  /** The line as the desk quotes it. */
  quoted: { price: string; unit: string };
  /** The same price per 100 kg — null while the row is "On request". */
  quintal: { price: string; unit: string } | null;
  enquiryHref: string;
}

export interface RateGroupView {
  title: string;
  updatedOn: string | null;
  enquiryHref: string;
  rows: RateRowView[];
}

// Group-heading anchors: a real product photo (the same treated assets from
// the catalogue) plus the site-wide icon language. Keyed by group index —
// the group titles themselves are translated.
const groupImagesByIndex: Record<number, string> = {
  0: "/images/products/soya-doc.webp",
  1: "/images/products/toor-dal.webp",
};

const groupIconsByIndex: Record<number, typeof Droplets> = {
  0: Droplets,
  1: Wheat,
};

type Basis = "quoted" | "quintal";

/**
 * The per-row enquiry chip. Labelled, not glyph-only — "Enquire" has to be
 * readable for the button to mean anything to a first-time visitor. It
 * stays quiet at rest (white, hairline border, ink text) so eleven of them
 * still scan as a price list rather than a button grid, and only fills
 * WhatsApp green under the pointer. Row hover nudges the border alone:
 * colouring the text there would out-specify the button's own hover and
 * leave dark ink on a green fill.
 */
const ROW_CTA =
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 shadow-elevated-sm transition-all duration-200 [transition-timing-function:var(--ease-brand)] group-hover:border-whatsapp/40 hover:-translate-y-px hover:border-whatsapp hover:bg-whatsapp hover:text-white hover:shadow-elevated";

export default function RatesTables({
  groups,
  showBasisToggle,
}: {
  groups: RateGroupView[];
  showBasisToggle: boolean;
}) {
  const t = useTranslations("rates");
  const [basis, setBasis] = useState<Basis>("quoted");

  return (
    <>
      {showBasisToggle && (
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b border-ink/10 pb-5 print:hidden">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-pine">
              {t("basis.label")}
            </p>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-ink/50">
              {t("basis.hint")}
            </p>
          </div>
          <div
            role="group"
            aria-label={t("basis.aria")}
            className="inline-flex rounded-sm border border-ink/15 bg-white p-1 shadow-elevated-sm"
          >
            {(
              [
                ["quoted", t("basis.quoted")],
                ["quintal", t("basis.quintal")],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={basis === value}
                onClick={() => setBasis(value)}
                className={`rounded-[3px] px-3.5 py-2 text-xs font-semibold tabular-nums transition-colors ${
                  basis === value
                    ? "bg-pine text-white"
                    : "text-ink/55 hover:text-pine"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {groups.map((group, gi) => {
        const GroupIcon = groupIconsByIndex[gi] ?? Wheat;
        const groupImage = groupImagesByIndex[gi];
        return (
          <Reveal
            key={group.title}
            className={gi > 0 ? "mt-14" : showBasisToggle ? "mt-12" : ""}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-4">
              <div className="flex items-center gap-4">
                {groupImage && (
                  <Image
                    src={groupImage}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-sm border border-ink/10 object-cover [filter:saturate(0.94)_contrast(1.05)_sepia(0.05)]"
                  />
                )}
                <div className="flex items-center gap-2.5">
                  <GroupIcon
                    size={20}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className="text-pine"
                  />
                  <h2 className="font-display text-display-md text-ink">
                    {group.title}
                  </h2>
                </div>
              </div>

              {/* One loud action per line, next to the line it covers. */}
              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                {group.updatedOn && (
                  <p className="flex items-center gap-1.5 text-xs text-ink/50">
                    <TimerReset size={13} aria-hidden="true" />
                    {t("bannerUpdated", { time: group.updatedOn })}
                  </p>
                )}
                <a
                  href={group.enquiryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("enquireLineAria", { line: group.title })}
                  className="group/line inline-flex w-full items-center justify-center gap-2 rounded-sm bg-pine px-4 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-elevated sm:w-auto"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  {t("enquireLine")}
                  <ArrowRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform group-hover/line:translate-x-0.5"
                  />
                </a>
              </div>
            </div>

            {/* Desktop: a real table (md and up, plus print). Mobile:
                stacked cards — a price list gets read on phones standing
                at a mandi, so that layout is primary, not an afterthought. */}
            <div className="mt-5">
              <div className="hidden md:block print:block">
                <table className="w-full border-collapse text-sm print:text-xs">
                  <thead>
                    <tr className="border-b border-ink/15 text-left text-[0.7rem] uppercase tracking-widest text-ink/50">
                      <th scope="col" className="py-3 pr-2 font-semibold">
                        {t("productHeader")}
                      </th>
                      <th
                        scope="col"
                        className="py-3 pl-2 text-right font-semibold"
                      >
                        {t("rateHeader")}
                      </th>
                      <th
                        scope="col"
                        className="w-px py-3 pl-6 text-right font-semibold print:hidden"
                      >
                        <span className="sr-only">{t("enquire")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row, index) => {
                      const shown =
                        basis === "quintal" && row.quintal
                          ? row.quintal
                          : row.quoted;
                      return (
                        <tr
                          key={row.product}
                          className={`group border-b border-ink/10 transition-colors hover:bg-linen/70 print:break-inside-avoid ${
                            index % 2 === 1 ? "bg-linen/40" : ""
                          }`}
                        >
                          <td className="px-2 py-4 font-medium text-ink first:pl-0 print:py-2.5">
                            {row.product}
                            {row.flagship && (
                              <span className="ml-2.5 inline-block -translate-y-px rounded-full border border-wheat-dark/50 px-2 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark print:hidden">
                                {t("flagship")}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-4 text-right print:py-2.5">
                            <span className="font-semibold tabular-nums text-ink">
                              {shown.price}
                            </span>{" "}
                            <span className="text-ink/50">{shown.unit}</span>
                          </td>
                          {/* Labelled chip, right-aligned in a column that
                              hugs it. */}
                          <td className="w-px py-3 pl-3 pr-0 text-right print:hidden">
                            <a
                              href={row.enquiryHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t("enquireAria", {
                                product: row.product,
                              })}
                              className={ROW_CTA}
                            >
                              <MessageCircle size={13} aria-hidden="true" />
                              {t("enquire")}
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards — hidden at md+, hidden in print. */}
              <ul className="space-y-3 md:hidden print:hidden">
                {group.rows.map((row) => {
                  const shown =
                    basis === "quintal" && row.quintal ? row.quintal : row.quoted;
                  return (
                    <li
                      key={row.product}
                      className="border border-ink/10 bg-white p-4 transition-colors hover:border-pine/40"
                    >
                      <p className="font-display text-base text-ink">
                        {row.product}
                        {row.flagship && (
                          <span className="ml-2 inline-block rounded-full border border-wheat-dark/50 px-1.5 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark">
                            {t("flagship")}
                          </span>
                        )}
                      </p>
                      {/* Price and action share the card's foot: the name
                          gets the full width it needs, and the chip clears
                          44px as a touch target. */}
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <p className="text-sm text-ink">
                          <span className="font-semibold tabular-nums">
                            {shown.price}
                          </span>{" "}
                          <span className="text-ink/50">{shown.unit}</span>
                        </p>
                        <a
                          href={row.enquiryHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t("enquireAria", {
                            product: row.product,
                          })}
                          className={`${ROW_CTA} min-h-[44px] shrink-0 justify-center px-3.5 active:bg-whatsapp active:text-white`}
                        >
                          <MessageCircle size={14} aria-hidden="true" />
                          {t("enquire")}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </>
  );
}
