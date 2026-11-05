/** Only low-cardinality, public route information may be sent to analytics.
 * Never include href queries, telephone numbers, emails or form contents. */
export const conversionNames = ['whatsapp_click', 'phone_click', 'email_click', 'enquiry_click', 'pdf_download', 'enquiry_form_submit', 'enquiry_form_success', 'enquiry_form_error', 'enquiry_email_handoff'] as const;
export type ConversionName = typeof conversionNames[number];
const locales = ['en', 'hi', 'mr', 'kn', 'te', 'ta'];
const services = ['commodity-trading', 'pulses-processing', 'oil-extraction', 'cold-storage', 'logistics'];
export function routeContext(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  const locale = locales.includes(parts[0] || '') ? parts.shift()! : 'en';
  const path = '/' + parts.join('/');
  const known = ['/', '/about', '/contact', '/rates', '/services', '/privacy', ...services.map(slug => '/services/' + slug)];
  return { locale, page: known.includes(path) ? path : 'other' };
}
export function classifyConversion(href: string, origin: string): ConversionName | null {
  let url: URL;
  try { url = new URL(href, origin); } catch { return null; }
  if (url.protocol === 'tel:') return 'phone_click';
  if (url.protocol === 'mailto:') return 'email_click';
  if (['https:', 'http:'].includes(url.protocol) && ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) return 'whatsapp_click';
  if (url.origin !== origin) return null;
  if (url.pathname.endsWith('.pdf')) return 'pdf_download';
  const context = routeContext(url.pathname);
  return context.page === '/contact' ? 'enquiry_click' : null;
}
