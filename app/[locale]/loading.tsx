/**
 * Route-level loading UI (app/[locale]/loading.tsx). Before this, any
 * navigation or Suspense boundary showed a blank white flash — the one
 * remaining moment that read as an unfinished default Next.js app next
 * to everything else on the site.
 *
 * Deliberately minimal: a slim top progress bar (same convention as
 * GitHub/YouTube — indeterminate, unknown duration, not the one-time
 * slide-progress fill used elsewhere) plus the mark, faintly pulsing.
 * No copy, so this needs nothing added to the six translation catalogs.
 * Renders inside the locale layout, so Navbar/Footer stay mounted and
 * visible around it — nothing "disappears," only the content area
 * shows a loading state.
 */
export default function Loading() {
  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] overflow-hidden bg-pine-deep/10"
        role="status"
        aria-label="Loading"
      >
        <div className="animate-loading-bar h-full w-1/3 bg-gradient-to-r from-pine via-wheat to-pine" />
      </div>

      <div className="flex min-h-[50vh] items-center justify-center">
        <img
          src="/sg-mark.svg"
          alt=""
          width={40}
          height={40}
          className="animate-pulse rounded-[9px] opacity-40"
        />
      </div>
    </>
  );
}
