export interface SeoSettings {
  origin: string; host: string; alternateHost: string | null; isPreview: boolean;
  verification: { google?: string; bing?: string };
}
export function getSeoSettings(env?: Record<string, string | undefined>): SeoSettings;
export function seoHeaders(env?: Record<string, string | undefined>): import('next').Header[];
export function seoRedirects(env?: Record<string, string | undefined>): import('next').Redirect[];
