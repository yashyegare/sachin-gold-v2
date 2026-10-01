/**
 * Builds a wa.me deep link, optionally with a prefilled message — the
 * same pattern already used on the live site's Rates and Oil Extraction
 * pages (e.g. "Hi Sachin Gold, I am interested in bulk rates for...").
 */
export function whatsappLink(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * Recipient-free WhatsApp share link: opens WhatsApp with the text
 * prefilled and the CONTACT PICKER open — the sender chooses who gets
 * it. This is WhatsApp's documented "share with any contact" flow
 * (wa.me/?text=…). For forward-the-rates style actions; anything that
 * must open a chat with the company itself (enquiries) uses
 * whatsappLink() with the company number instead.
 */
export function whatsappShareLink(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
