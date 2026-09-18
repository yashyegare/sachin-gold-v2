/**
 * Builds a wa.me deep link, optionally with a prefilled message — the
 * same pattern already used on the live site's Rates and Oil Extraction
 * pages (e.g. "Hi Sachin Gold, I am interested in bulk rates for...").
 */
export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
