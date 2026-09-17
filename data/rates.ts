export interface Rate {
  product: string;
  price: string;
  unit: string;
}

// V2a: edited directly in code and deployed. V2b can replace this file's
// export with a fetch to an API route backed by a database, without
// touching app/rates/page.tsx.
export const rates: Rate[] = [
  { product: "Normal Soya DOC", price: "TODO", unit: "per quintal" },
  { product: "High Protein Soya DOC", price: "TODO", unit: "per quintal" },
];

export const ratesLastUpdated = "TODO";
