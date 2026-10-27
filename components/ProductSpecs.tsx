import { type ReactNode } from "react";
import { BadgeCheck, Layers, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { certifications } from "@/data/company";
import { commercialTerms, type ProductSpec } from "@/data/specs";
import type { Product } from "@/lib/types";

/**
 * The commercial-terms block: pack sizes, MOQ and lead time per product,
 * plus the shared dispatch / survey terms.
 *
 * Rows carry `id="spec-<slug>"` so a product card anywhere on the site can
 * deep-link straight to its own terms.
 *
 * Where the owner sells a product under several quality grades, the grades
 * are listed outright under the product's name — a buyer comparing two
 * lines should not have to click to find out which grade they are quoting.
 * The list lives in the product cell (grades belong to the product, not to
 * a term) and the numbering carries the premium-to-standard order, stated
 * once as a legend under the table.
 *
 * Values are indicative (see data/specs.ts) and `commercialTerms.note` says
 * so under the table; the labels translate, the trade notation does not.
 */
export default function ProductSpecs({
  items,
}: {
  items: { product: Product; spec: ProductSpec }[];
}) {
  const t = useTranslations("services");
  const hasGrades = items.some((item) => (item.product.grades?.length ?? 0) > 0);

  return (
    <section className="section-standard border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t("detail.specsEyebrow")}
            title={t("detail.specsTitle")}
            description={t("detail.specsDesc")}
          />
        </Reveal>

        <Reveal className="mt-10">
          {/* One row per product at every width. Below md the row and its
              cells switch to blocks and stack into a card, which keeps a
              single `spec-<slug>` anchor per product — a separate mobile
              list would duplicate the id, and the product card's deep link
              would then land on the hidden copy instead of the visible one. */}
          <table className="w-full border-collapse text-sm">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-pine/25 text-left text-[0.7rem] uppercase tracking-widest text-ink/50">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  {t("detail.specProduct")}
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  {t("detail.specPacks")}
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  {t("detail.specMoq")}
                </th>
                <th scope="col" className="py-3 font-semibold">
                  {t("detail.specLead")}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ product, spec }) => {
                const grades = product.grades ?? [];

                return (
                  <tr
                    key={product.slug}
                    id={`spec-${product.slug}`}
                    className="scroll-mt-28 mb-4 block border border-ink/10 bg-linen/40 p-4 last:mb-0 md:mb-0 md:table-row md:border-0 md:border-b md:border-ink/10 md:bg-transparent md:p-0"
                  >
                    <th
                      scope="row"
                      className="mb-3 block text-left font-display text-base font-normal text-ink md:mb-0 md:table-cell md:w-[24%] md:py-4 md:pr-4 md:align-top"
                    >
                      {product.name}
                      <span className="mt-1 block text-[0.65rem] font-sans uppercase tracking-widest text-pine/70">
                        {product.category}
                      </span>
                      {grades.length > 0 && (
                        <Grades
                          caption={t("detail.specGrades")}
                          grades={grades}
                        />
                      )}
                    </th>
                    <SpecCell
                      label={t("detail.specPacks")}
                      className="md:w-[36%]"
                      value={spec.packs}
                    />
                    <SpecCell
                      label={t("detail.specMoq")}
                      className="md:w-[18%]"
                      value={
                        <span className="font-semibold text-pine-deep">
                          {spec.moq}
                        </span>
                      }
                    />
                    <SpecCell
                      label={t("detail.specLead")}
                      className="md:w-[22%]"
                      value={spec.lead}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* The numbering in the grade lists is the premium ranking, so it
              is stated once here instead of repeating a caption on every
              row. Only pages that actually list grades carry it. */}
          {hasGrades && (
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink/50">
              <span
                aria-hidden="true"
                className="mt-[0.55rem] h-px w-4 shrink-0 bg-wheat-dark"
              />
              {t("detail.gradesOrder")}
            </p>
          )}
        </Reveal>

        {/* Shared terms — stated once, under the per-product rows. */}
        <Reveal className="mt-10">
          <div className="grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2">
            <Term
              icon={<Truck size={15} aria-hidden="true" />}
              label={t("detail.termsDispatch")}
              value={commercialTerms.dispatch}
            />
            <Term
              icon={<Layers size={15} aria-hidden="true" />}
              label={t("detail.termsSurvey")}
              value={commercialTerms.survey}
            />
          </div>
          <p className="mt-4 text-xs text-ink/50">{commercialTerms.note}</p>

          {/* Licence numbers, when the owner has supplied them — see
              data/company.ts. Renders nothing while the list is empty rather
              than an "add this later" hole on a live page. */}
          {certifications.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {certifications.map((cert) => (
                <span
                  key={cert.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-pine/20 bg-linen px-3 py-1 text-xs text-ink/70"
                >
                  <BadgeCheck size={13} aria-hidden="true" className="text-pine" />
                  <span className="font-semibold uppercase tracking-wider text-pine">
                    {cert.label}
                  </span>
                  <span className="tabular-nums">{cert.value}</span>
                </span>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Grades({
  caption,
  grades,
}: {
  caption: string;
  grades: string[];
}) {
  const ranked = grades.length > 1;

  return (
    <div className="mt-3 border-l-2 border-wheat pl-3 font-sans">
      <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-ink/45">
        {caption}
      </p>
      <ol className={ranked ? "mt-2 space-y-1.5" : "mt-1.5"}>
        {grades.map((grade, index) => (
          <li
            key={grade}
            className="flex items-baseline gap-2 text-xs leading-snug"
          >
            {ranked && (
              <span className="w-4 shrink-0 font-display text-[0.65rem] tabular-nums text-wheat-dark">
                {String(index + 1).padStart(2, "0")}
              </span>
            )}
            {/* The top grade carries the brand's name, so it takes full
                contrast; the grades below it recede one step. */}
            <span className={index === 0 ? "text-ink" : "text-ink/65"}>
              {grade}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SpecCell({
  label,
  value,
  className = "",
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`block py-2 align-top text-ink/75 md:table-cell md:border-b md:border-ink/10 md:py-4 md:pr-4 ${className}`}
    >
      <span className="mb-1 block text-[0.65rem] uppercase tracking-widest text-ink/45 md:hidden">
        {label}
      </span>
      {value}
    </td>
  );
}

function Term({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-5">
      <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-widest text-pine">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{value}</p>
    </div>
  );
}
