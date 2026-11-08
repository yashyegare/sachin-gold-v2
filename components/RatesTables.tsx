"use client";

import Image from "next/image";
import { useState } from "react";
import CopyRateButton from "@/components/CopyRateButton";
import {
  ArrowRight,
  Droplets,
  MessageCircle,
  TimerReset,
  Wheat,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

/** Searchable rates with category-level enquiries and per-product copy actions. */

export interface RateRowView {
  product: string;
  flagship: boolean;
  updatedOn: string | null;
  /** The line as the desk quotes it. */
  quoted: { price: string; unit: string };
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

export default function RatesTables({ groups }: { groups: RateGroupView[] }) {
  const t = useTranslations("rates");
  const ux = useTranslations("buyerUx");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const visibleGroups = groups
    .map((group, sourceIndex) => ({
      ...group,
      sourceIndex,
      rows: group.rows.filter(
        (row) =>
          (!category || category === group.title) &&
          row.product
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
      ),
    }))
    .filter((group) => group.rows.length > 0);
  const count = visibleGroups.reduce(
    (sum, group) => sum + group.rows.length,
    0,
  );

  return (
    <>
      <div className="mb-8 space-y-4 print:hidden" data-rate-search>
        <label
          htmlFor="rates-search"
          className="block max-w-md text-sm font-medium text-ink"
        >
          {ux("searchRates")}
          <input
            id="rates-search"
            type="search"
            maxLength={100}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="sg-search mt-2"
          />
        </label>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={ux("searchRates")}
        >
          {[null, ...groups.map((group) => group.title)].map((value) => (
            <button
              key={value ?? "all"}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className="sg-filter"
            >
              {value ?? ux("all")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-ink/70">
          <p role="status">{ux("results", { count })}</p>
          {(query || category) && (
            <button
              type="button"
              className="min-h-11 font-semibold text-pine underline underline-offset-4"
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
            >
              {ux("reset")}
            </button>
          )}
        </div>
        {count === 0 && <p className="bg-linen p-5">{ux("empty")}</p>}
      </div>
      {visibleGroups.map((group, gi) => {
        const GroupIcon = groupIconsByIndex[group.sourceIndex] ?? Wheat;
        const groupImage = groupImagesByIndex[group.sourceIndex];
        return (
          <Reveal key={group.title} className={gi > 0 ? "mt-14" : ""}>
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
                        <span className="sr-only">{ux("copy")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row, index) => {
                      return (
                        <tr
                          key={row.product}
                          className={`group border-b border-ink/10 transition-colors hover:bg-linen/70 print:break-inside-avoid ${
                            index % 2 === 1 ? "bg-linen/40" : ""
                          }`}
                        >
                          <td className="px-2 py-4 font-medium text-ink first:pl-0 print:py-2.5">
                            {row.product}
                            {row.updatedOn && (
                              <span className="mt-1 block text-xs font-normal text-ink/60">
                                {t("bannerUpdated", { time: row.updatedOn })}
                              </span>
                            )}
                            {row.flagship && (
                              <span className="ml-2.5 inline-block -translate-y-px rounded-full border border-wheat-dark/50 px-2 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-wheat-dark print:hidden">
                                {t("flagship")}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-2 py-4 text-right print:py-2.5">
                            <span className="font-semibold tabular-nums text-ink">
                              {row.quoted.price}
                            </span>{" "}
                            <span className="text-ink/50">
                              {row.quoted.unit}
                            </span>
                          </td>
                          {/* Keep the copy action next to its rate. */}
                          <td className="w-px py-3 pl-3 pr-0 text-right print:hidden">
                            <CopyRateButton row={row} />
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
                  return (
                    <li
                      key={row.product}
                      className="border border-ink/10 bg-white p-4 transition-colors hover:border-pine/40"
                    >
                      <p className="font-display text-base text-ink">
                        {row.product}
                        {row.updatedOn && (
                          <span className="mt-1 block text-xs font-normal text-ink/60">
                            {t("bannerUpdated", { time: row.updatedOn })}
                          </span>
                        )}
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
                            {row.quoted.price}
                          </span>{" "}
                          <span className="text-ink/50">{row.quoted.unit}</span>
                        </p>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <CopyRateButton row={row} />
                        </div>
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
