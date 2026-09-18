import Link from "next/link";

// Phase 8, item 6 — a sane, on-brand 404 instead of the Next.js default.
// Rendered inside the root layout, so Navbar/Footer are already present.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wheat-dark">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">Page not found</h1>
      <p className="mx-auto mt-4 max-w-prose text-ink/70">
        That page doesn't exist — it may have moved when we rebuilt the site.
        Every product and service is reachable from the links below.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
        <Link
          href="/"
          className="bg-pine px-6 py-3 font-semibold text-linen transition-colors hover:bg-pine-deep"
        >
          Go home
        </Link>
        <Link
          href="/services"
          className="border border-ink/20 px-6 py-3 font-semibold text-ink transition-colors hover:border-pine"
        >
          Our services
        </Link>
        <Link
          href="/rates"
          className="border border-ink/20 px-6 py-3 font-semibold text-ink transition-colors hover:border-pine"
        >
          Market rates
        </Link>
        <Link
          href="/contact"
          className="border border-ink/20 px-6 py-3 font-semibold text-ink transition-colors hover:border-pine"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
