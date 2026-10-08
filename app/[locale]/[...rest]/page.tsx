import { notFound } from "next/navigation";

// The next-intl documented catch-all: middleware rewrites any unmatched
// path under [locale], this segment catches it and throws notFound() so
// [locale]/not-found.tsx renders WITH the full layout — Navbar, Footer,
// fonts, translations. Without it, root-level unknown URLs bypass the
// locale 404 and Next serves its default unbranded error page (verified
// live: /nonexistent-page-xyz returned the framework default).
// Soft 404, and it stays that way on Next 14: app/[locale]/loading.tsx
// suspends this segment, so the shell flushes with 200 before notFound()
// throws and the status can no longer change. Dropping the boundary does
// give a real 404 but loses the layout with it — Next then answers with
// its own <html id="__next_error__"> stub, verified on the 2026-10-08
// production build. The branded page is worth more than the status code,
// so it keeps the boundary and opts out of indexing instead.
export const metadata = {
  robots: { index: false, follow: true },
};

export default function CatchAllNotFound() {
  notFound();
}
