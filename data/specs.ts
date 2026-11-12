import { getProductsByService } from "@/data/products";

/**
 * Commercial terms — the numbers a bulk buyer actually decides on.
 *
 * Owner-confirmed lead time across all products: 1–2 days.
 * Owner-confirmed packaging: jaggery ships as 10 kg per DAG; cotton seed
 * oil cake, tamarind and soyabean ship in 50 kg bags (material unspecified).
 *
 * READ THIS BEFORE SHIPPING. Other indicative terms did not come from the old site or
 * from the owner; the old site published no terms at all. The MOQs, pack
 * sizes and MOQs below are ordinary market practice for a Maharashtra
 * soya-and-dal trader. They are therefore *indicative*, and the UI says so
 * on every page that renders them (`services.detail.specsNote`).
 *
 * The owner must confirm each figure before this is treated as an offer.
 * Until then the copy is labelled indicative (`commercialTerms.note` below,
 * rendered under the table on every service page) and the enquiry CTA is
 * what converts — a wrong MOQ that reads as tentative costs far less than
 * no MOQ at all, which is where the site stood before.
 *
 * Licence and certification numbers (GSTIN, FSSAI, ISO, IEC) are NOT here:
 * those are identifiers, not estimates, and inventing one is worse than
 * omitting it. Fill `certifications` in `data/company.ts` and the spec
 * table's terms strip renders the chips automatically — it shows nothing
 * while that list is empty.
 *
 * Values stay in Latin trade notation in every locale — "1 MT jumbo" is how
 * these are written on Indian invoices regardless of the language around
 * them. Only the labels translate.
 */
export interface ProductSpec {
  /** How it ships. */
  packs: string;
  /** Minimum order the plant can economically dispatch. */
  moq: string;
  /** From order confirmation, ex-plant Udgir. */
  lead: string;
}

export const productSpecs: Record<string, ProductSpec> = {
  // ————— Trading: raw commodities, cleaned at our own lines —————
  soyabean: {
    packs: "50 kg bag",
    moq: "25 MT",
    lead: "1–2 days",
  },
  bajra: {
    packs: "30 / 50 kg PP bag",
    moq: "25 MT",
    lead: "1–2 days",
  },
  jowar: {
    packs: "30 / 50 kg PP bag",
    moq: "25 MT",
    lead: "1–2 days",
  },
  corn: {
    packs: "30 / 50 kg PP bag",
    moq: "25 MT",
    lead: "1–2 days",
  },
  jaggery: {
    packs: "10 kg per DAG",
    moq: "25 MT",
    lead: "1–2 days",
  },
  "cotton-seed-oil-cake": {
    packs: "50 kg bag",
    moq: "25 MT",
    lead: "1–2 days",
  },
  "masoor-dal": {
    packs: "30 / 50 kg PP bag",
    moq: "25 MT",
    lead: "1–2 days",
  },
  tamarind: {
    packs: "50 kg bag",
    moq: "25 MT",
    lead: "1–2 days",
  },

  // ————— Processing: milled on our own Buhler lines, unpolished —————
  "toor-dal": {
    packs: "As per requirement",
    moq: "25–30 TN",
    lead: "1–2 days",
  },
  "chana-dal": {
    packs: "As per requirement",
    moq: "25–30 TN",
    lead: "1–2 days",
  },
  "urad-dal": {
    packs: "As per requirement",
    moq: "25–30 TN",
    lead: "1–2 days",
  },
  "moong-dal": {
    packs: "As per requirement",
    moq: "25–30 TN",
    lead: "1–2 days",
  },
  "besan-gram-flour": {
    packs: "As per requirement",
    moq: "25–30 TN",
    lead: "1–2 days",
  },

  // ————— Extraction: soya crushing and refining at the Main Plant —————
  "soya-doc": {
    packs: "50 kg PP bag · 1 MT jumbo · loose bulk",
    moq: "30 MT",
    lead: "1–2 days",
  },
  "soya-crude-oil": {
    packs: "Bulk tanker",
    moq: "25 MT",
    lead: "1–2 days",
  },
  "soya-refined-oil": {
    packs: "Bulk tanker",
    moq: "25 MT",
    lead: "1–2 days",
  },
  "soya-acid-oil": {
    packs: "Bulk tanker",
    moq: "25 MT",
    lead: "1–2 days",
  },
  "soya-fatty-oil": {
    packs: "Bulk tanker",
    moq: "25 MT",
    lead: "1–2 days",
  },
  "soya-lecithin": {
    packs: "Bulk tanker",
    moq: "25 MT",
    lead: "1–2 days",
  },
};

/** The shared commercial terms — stated once per page, under the table. */
export const commercialTerms = {
  dispatch:
    "Ex-plant Udgir, Solapur and Latur · truck and rake loading from site · freight quoted separately against your pincode",
  survey: "Third-party quality and weight survey at loading on request",
  /** The sentence that keeps every figure above honest. */
  note: "Pack sizes, MOQ and lead times are indicative and reconfirmed in writing at booking.",
};

/** Products in this service line that have a spec block, in catalogue order. */
export function getSpecsForService(serviceSlug: string) {
  return getProductsByService(serviceSlug)
    .map((product) => ({ product, spec: productSpecs[product.slug] }))
    .filter(
      (
        entry,
      ): entry is { product: (typeof entry)["product"]; spec: ProductSpec } =>
        entry.spec !== undefined,
    );
}
