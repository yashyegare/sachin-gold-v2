import { getProductsByService } from "@/data/products";

/**
 * Commercial terms — the numbers a bulk buyer actually decides on.
 *
 * READ THIS BEFORE SHIPPING. Nothing in this file came from the old site or
 * from the owner; the old site published no terms at all. The grades below
 * are the standard trade grades for these commodities (AGMARK / typical
 * contract wording) and the MOQs, pack sizes, lead times and payment terms
 * are ordinary market practice for a Maharashtra soya-and-dal trader. They
 * are therefore *indicative*, and the UI says so on every page that renders
 * them (`services.detail.specsNote`).
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
 * Values stay in Latin trade notation in every locale — "Protein min 46%" is
 * how these are written on Indian invoices regardless of the language around
 * them. Only the labels translate.
 */
export interface ProductSpec {
  /** Quality contract shorthand: the parameters a buyer specifies. */
  grade: string;
  /** How it ships. */
  packs: string;
  /** Minimum order the plant can economically dispatch. */
  moq: string;
  /** From order confirmation, ex-plant Udgir. */
  lead: string;
}

export const productSpecs: Record<string, ProductSpec> = {
  // ————— Trading: raw commodities, cleaned and graded at our own lines —————
  soyabean: {
    grade: "Sortex-cleaned · moisture max 12% · oil basis 18–20% · ADMAX as per AGMARK FAQ",
    packs: "50/60 kg jute or PP bag · 1 MT jumbo · bulk in bags",
    moq: "50 MT",
    lead: "4–6 working days",
  },
  bajra: {
    grade: "Local/Desi grade · moisture max 12% · foreign matter max 1% · Sortex-cleaned",
    packs: "25/50 kg PP bag · 1 MT jumbo",
    moq: "25 MT",
    lead: "3–5 working days",
  },
  jowar: {
    grade: "White/mixed jowar · moisture max 12% · foreign matter max 0.75%",
    packs: "25/50 kg PP bag · 1 MT jumbo",
    moq: "25 MT",
    lead: "3–5 working days",
  },
  corn: {
    grade: "Yellow maize, AFD grade · moisture max 12% · broken & damaged max 2%",
    packs: "50 kg PP bag · 1 MT jumbo · bulk tipper",
    moq: "50 MT",
    lead: "4–6 working days",
  },
  jaggery: {
    grade: "Grade A/B · colour 60–80 IU · moisture max 3.5% · sulphur-free on request",
    packs: "25/50 kg PP bag · 12 kg carton for retail packs",
    moq: "20 MT",
    lead: "3–5 working days",
  },
  "cotton-seed-oil-cake": {
    grade: "Protein min 22–24% · oil residue max 1.5% · moisture max 12%",
    packs: "50 kg PP bag · 1 MT jumbo",
    moq: "25 MT",
    lead: "3–5 working days",
  },
  "masoor-dal": {
    grade: "Whole masoor, unpolished · moisture max 12% · foreign matter max 0.5%",
    packs: "1/5/10/25/50 kg PP & HDPE bag · 1 MT jumbo",
    moq: "10 MT",
    lead: "2–4 working days",
  },
  tamarind: {
    grade: "Pressed ball, seedless · moisture max 16% · tartaric acid 28–32%",
    packs: "20/25 kg PP bag",
    moq: "15 MT",
    lead: "4–6 working days",
  },

  // ————— Processing: milled on our own Buhler lines, unpolished —————
  "toor-dal": {
    grade: "Protein min 20–21% · moisture max 12% · foreign matter max 0.25% · unpolished",
    packs: "1/5/10/25/50 kg PP & HDPE bag · 1 MT jumbo",
    moq: "10 MT",
    lead: "2–4 working days",
  },
  "chana-dal": {
    grade: "Super-fine split · moisture max 10% · foreign matter max 0.25% · unpolished",
    packs: "1/5/10/25/50 kg PP & HDPE bag · 1 MT jumbo",
    moq: "10 MT",
    lead: "2–4 working days",
  },
  "urad-dal": {
    grade: "Protein min 16–17% · moisture max 12% · foreign matter max 0.5% · unpolished",
    packs: "1/5/10/25/50 kg PP & HDPE bag · 1 MT jumbo",
    moq: "10 MT",
    lead: "2–4 working days",
  },
  "moong-dal": {
    grade: "Yellow split, protein min 24% · moisture max 12% · husk-free grade",
    packs: "1/5/10/25/50 kg PP & HDPE bag · 1 MT jumbo",
    moq: "10 MT",
    lead: "2–4 working days",
  },
  "jowar-dal": {
    grade: "Milled jowar · moisture max 12% · foreign matter max 0.5%",
    packs: "25/50 kg PP bag · 1 MT jumbo",
    moq: "10 MT",
    lead: "2–4 working days",
  },
  "besan-gram-flour": {
    grade: "Protein min 20% · fat min 5% · moisture max 5% · fine mesh, pure chana besan",
    packs: "1/5/10/20/50 kg PP & HDPE bag · 1 MT jumbo",
    moq: "5 MT",
    lead: "2–3 working days",
  },

  // ————— Extraction: soya crushing and refining at the Main Plant —————
  "soya-doc": {
    grade: "Normal: protein min 46%, fat max 1.5%, fibre max 7% · High-Pro: protein min 48–50% · moisture max 12%",
    packs: "50 kg PP bag · 1 MT jumbo · loose bulk",
    moq: "25 MT",
    lead: "2–3 working days",
  },
  "soya-crude-oil": {
    grade: "FFA max 2.0% · moisture & impurity max 0.5% · Lovibond 1.5R / 15Y",
    packs: "Bulk tanker · 190 kg MS drum · 1 MT IBC",
    moq: "20 MT (one tanker lot)",
    lead: "3–5 working days",
  },
  "soya-refined-oil": {
    grade: "FFA max 0.1% · moisture max 0.1% · smoke point ~230°C · neutralised, bleached, deodorised",
    packs: "15 L / 1 kg retail pouch (on request) · 19 L can · 1 MT IBC · bulk tanker",
    moq: "5 MT · full tanker 16 MT",
    lead: "3–5 working days",
  },
  "soya-acid-oil": {
    grade: "FFA min 50% · moisture max 1.0% · for soap, fatty-acid and chemical feedstock",
    packs: "190 kg MS drum · bulk tanker",
    moq: "5 MT",
    lead: "3–5 working days",
  },
  "soya-fatty-oil": {
    grade: "Acid value and ester value to buyer spec · for cosmetics, paints and industrial blends",
    packs: "190 kg MS drum · 1 MT IBC · bulk tanker",
    moq: "5 MT",
    lead: "3–5 working days",
  },
  "soya-lecithin": {
    grade: "Acetone insolubles min 60% · moisture max 0.5% · colour K-18, non-bleached",
    packs: "190 kg MS drum · 1 MT IBC · bulk tanker",
    moq: "2 MT",
    lead: "4–6 working days",
  },
};

/** The shared commercial terms — stated once per page, under the table. */
export const commercialTerms = {
  payment:
    "30% advance with the order, balance before dispatch · LC at sight above 100 MT · credit terms for repeat buyers on review",
  dispatch:
    "Ex-plant Udgir (MIDC) · truck and rake loading from site · freight quoted separately against your pincode",
  survey:
    "Third-party quality and weight survey at loading on request · reweigh allowed at destination",
  /** The sentence that keeps every figure above honest. */
  note: "Grades, pack sizes, MOQ and lead times are indicative and reconfirmed in writing at booking.",
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
