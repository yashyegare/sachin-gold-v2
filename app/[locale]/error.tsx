"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

// Runtime error boundary — the 404's counterpart. Before this, any
// render crash served Next's default blank white error page, unbranded
// and untranslated. This renders inside the locale layout (Navbar,
// Footer, fonts, language), offers a real recovery path (reset retries
// the failed render segment; home is the guaranteed-clean escape), and
// reuses the translated notFound.* copy — near-zero extra surface in
// six catalogs for a page that must never read as "different, cheaper
// site" the moment something breaks.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("notFound");

  // The digest is what support/hosting logs key on — surfacing it gives
  // a real report a handle. Logged here; never rendered as raw error
  // text (can leak internals).
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative overflow-hidden bg-pine-deep">
      {/* The shared gold dot texture — same treatment as the 404 and
          every inner-page intro band */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <pattern
          id="error-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="#B68A1E" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#error-dots)" />
      </svg>

      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <p className="font-display text-6xl leading-none text-wheat-bright sm:text-7xl">
          500
        </p>
        <h1 className="mt-4 font-display text-display-lg text-white">
          {t("errorTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-prose leading-relaxed text-white/75">
          {t("errorBody")}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-sm bg-wheat px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-wheat/90"
          >
            {t("errorRetry")}
          </button>
          <a
            href="/"
            className="rounded-sm border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-wheat-bright hover:bg-white/10"
          >
            {t("home")}
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs tabular-nums text-white/40">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}
