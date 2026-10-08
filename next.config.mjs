import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats automatically; next/image will pick the best
    // one the requesting browser supports.
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  // Drop the `X-Powered-By: Next.js` response header. Nothing depends on
  // it, it's a fingerprint, and removing it saves a round-trip's worth of
  // bytes on every one of the site's ~40 static pages.
  poweredByHeader: false,
  // Standard security headers. Deliberately conservative: no CSP yet —
  // a real content-security-policy has to account for the Google Maps
  // iframe, Web3Forms and next/image, and must be tested on the live
  // deploy before it's allowed to break any of them. XFO/nosniff carry
  // the clickjacking/MIME basics with zero breakage risk. (Vercel adds
  // HSTS at the edge automatically.)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
  // Phase 7/10 of the plan: preserve the old site's search equity. Every
  // legacy .html URL must 301 to its new route before cutover to
  // sachingold.com.
  //
  // Verified against the live old site on 2026-10-08: each source below
  // returned HTTP 200 on sachingold.com, and every removed alias returned
  // 404 there, so it carries no equity to preserve. The old sitemap.xml
  // lists exactly 11 URLs — the 10 pages below plus "/". Two further pages
  // exist but are NOT in the sitemap (testimonials.html, blog-details.html);
  // they are unedited BootstrapMade template remnants, so they redirect to
  // the nearest real content instead of to a path V2 has no route for.
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      {
        source: "/oil-extraction.html",
        destination: "/services/oil-extraction",
        permanent: true,
      },
      {
        source: "/logistics.html",
        destination: "/services/logistics",
        permanent: true,
      },
      { source: "/rate.html", destination: "/rates", permanent: true },
      {
        source: "/commodity-trading.html",
        destination: "/services/commodity-trading",
        permanent: true,
      },
      {
        source: "/pulses-processing.html",
        destination: "/services/pulses-processing",
        permanent: true,
      },
      {
        source: "/cold-storage.html",
        destination: "/services/cold-storage",
        permanent: true,
      },

      // --- Live on the old site, but the closest V2 content is elsewhere:
      // the only genuine customer quote and the feedback video are on
      // About, and blog-details is an empty template page. ---
      { source: "/testimonials.html", destination: "/about", permanent: true },
      { source: "/blog-details.html", destination: "/", permanent: true },

      // --- Safety net: any other legacy .html page falls back to the same
      // path without the extension. Keep this LAST — Next evaluates
      // redirects in array order, and every rule above must win. ---
      { source: "/:path*.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
