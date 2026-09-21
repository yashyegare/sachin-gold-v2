import { notFound } from "next/navigation";

// The next-intl documented catch-all: middleware rewrites any unmatched
// path under [locale], this segment catches it and throws notFound() so
// [locale]/not-found.tsx renders WITH the full layout — Navbar, Footer,
// fonts, translations. Without it, root-level unknown URLs bypass the
// locale 404 and Next serves its default unbranded error page (verified
// live: /nonexistent-page-xyz returned the framework default).
export default function CatchAllNotFound() {
  notFound();
}
