/** Shared by Next headers and server metadata. Never trust an incoming Host
 * header to choose the canonical origin or build a redirect destination. */
export function getSeoSettings(env = process.env) {
  const url = new URL(env.NEXT_PUBLIC_SITE_URL || 'https://sachingold.com');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (!['http:', 'https:'].includes(url.protocol) || (!local && url.protocol !== 'https:') ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be a clean HTTPS origin');
  }
  return {
    origin: url.origin,
    host: url.host,
    alternateHost: local ? null : (url.hostname.startsWith('www.') ? url.hostname.slice(4) : 'www.' + url.hostname),
    isPreview: ['preview', 'development'].includes(env.VERCEL_ENV || ''),
    verification: { google: env.GOOGLE_SITE_VERIFICATION || undefined, bing: env.BING_SITE_VERIFICATION || undefined },
  };
}

export function seoHeaders(env = process.env) {
  const { origin, isPreview } = getSeoSettings(env);
  const rules = [
    // Keep publicly accessible Vercel aliases out of search, without disabling
    // crawler access to CSS/JS or sending production users through previews.
    { source: '/:path*', has: [{ type: 'host', value: '.*\\.vercel\\.app' }], headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
    { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
  ];
  if (isPreview) rules.push({ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] });
  // English PDF aliases carry the same content as the bare routes. Google
  // supports canonical Link headers for non-HTML documents such as PDFs.
  for (const document of ['profile.pdf', 'rates.pdf']) {
    rules.push({ source: '/en/' + document, headers: [{ key: 'Link', value: '<' + origin + '/' + document + '>; rel="canonical"' }] });
  }
  rules.push({ source: '/en/services/:slug/spec.pdf', headers: [{ key: 'Link', value: '<' + origin + '/services/:slug/spec.pdf>; rel="canonical"' }] });
  return rules;
}

export function seoRedirects(env = process.env) {
  const { origin, alternateHost, isPreview } = getSeoSettings(env);
  if (!alternateHost || isPreview) return [];
  return [{ source: '/:path*', has: [{ type: 'host', value: alternateHost.replaceAll('.', '\\.') }], destination: origin + '/:path*', permanent: true }];
}
