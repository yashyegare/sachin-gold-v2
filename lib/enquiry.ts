import { products } from "@/data/products";

const units = ["metric tonnes", "kg", "bags"];
const kinds = ["purchase", "storage", "transport"];

/** Validate only the structured quote; never require a buyer's identity for WhatsApp. */
export function quoteFromForm(data: FormData): string | null {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const kind = value("requirement_type");
  const amount = Number(value("quantity"));
  const days = Number(value("storage_days"));
  if (
    !kinds.includes(kind) ||
    !units.includes(value("quantity_unit")) ||
    !products.some((product) => product.name === value("product")) ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 100000000 ||
    !value("destination") ||
    value("destination").length > 120 ||
    (kind === "transport" &&
      (!value("pickup") || value("pickup").length > 120)) ||
    (kind === "storage" && (!Number.isInteger(days) || days < 1 || days > 3650))
  )
    return null;
  return [
    "Hi Sachin Gold, I would like a quotation.",
    `Requirement: ${kind}`,
    `Product: ${value("product")}`,
    `Quantity: ${value("quantity")} ${value("quantity_unit")}`,
    `Destination: ${value("destination")}`,
    ...(kind === "transport" ? [`Pickup: ${value("pickup")}`] : []),
    ...(kind === "storage" ? [`Storage: ${value("storage_days")} days`] : []),
  ].join("\n");
}
