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
  // sachingold.com. Entries marked unconfirmed were not verifiable from the
  // live site — check exact filenames against the old repo (Phase 1) and
  // prune the wrong aliases before launch.
  async redirects() {
    return [
      // --- Confirmed live URLs (Google index, Sept 2026) ---
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

      // --- Rates page: exact old filename unconfirmed (the plan calls it
      // "rate"); cover both spellings ---
      { source: "/rate.html", destination: "/rates", permanent: true },
      { source: "/rates.html", destination: "/rates", permanent: true },

      // --- Remaining service pages: old filenames unconfirmed. Aliases
      // cover the plausible legacy names; delete whichever turn out wrong.
      { source: "/trading.html", destination: "/services/commodity-trading", permanent: true },
      { source: "/commodity-trading.html", destination: "/services/commodity-trading", permanent: true },
      { source: "/pulses.html", destination: "/services/pulses-processing", permanent: true },
      { source: "/pulses-processing.html", destination: "/services/pulses-processing", permanent: true },
      { source: "/pulses-flour.html", destination: "/services/pulses-processing", permanent: true },
      { source: "/cold-storage.html", destination: "/services/cold-storage", permanent: true },
      { source: "/cold-storages.html", destination: "/services/cold-storage", permanent: true },

      // --- Safety net: any other legacy .html page falls back to the same
      // path without the extension. Keep this LAST — Next evaluates
      // redirects in array order, and every rule above must win. ---
      { source: "/:path*.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
