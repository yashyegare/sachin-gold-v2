"use client";

import { useEffect, useState } from "react";

/**
 * Brand splash — the old site's "logo banner" opening moment, redesigned
 * as a proper title card:
 *
 * - Deep pine field with a radial vignette + grain-dot texture (same
 *   language as the hero, so splash → site reads as one surface).
 * - Wordmark rises with a soft blur-in; a wheat hairline draws outward
 *   from center; "ESTD 1969" and the tagline stagger in after.
 * - A thin progress bar fills along the bottom edge — the wait feels
 *   intentional, not stuck.
 * - Exit is a curtain: the veil slides up and the wordmark drifts
 *   slightly ahead of it, so the reveal feels like lifting a cloth off
 *   the page rather than an overlay dissolving.
 *
 * Frequency policy (deliberate): once per browser session, AND only when
 * the session's first landing is the homepage. It's a title card for the
 * site, not a toll on navigation — returning to it on every page, or
 * after every hard refresh mid-visit, trains visitors to ignore it.
 * Skipped entirely for reduced-motion visitors. Auto-dismisses via
 * timeouts so a hung animation can never trap anyone.
 */
const SESSION_KEY = "sg-splash-shown";

export default function BrandSplash() {
  const [phase, setPhase] = useState<"hidden" | "show" | "leaving">("hidden");

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    const landedOnHome =
      window.location.pathname === "/" || window.location.pathname === "";

    if (reducedMotion || alreadyShown || !landedOnHome) return;

    setPhase("show");
    document.body.style.overflow = "hidden";

    // Beat: 1.7s hold, then the curtain lift (0.8s). The second timeout is
    // the escape hatch — dismissal is guaranteed even if transitions hang.
    const t1 = setTimeout(() => setPhase("leaving"), 1700);
    const t2 = setTimeout(() => {
      setPhase("hidden");
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  // Release scroll the moment the curtain starts lifting — a fast visitor
  // should never feel blocked.
  useEffect(() => {
    if (phase === "leaving" || phase === "hidden") {
      document.body.style.overflow = "";
    }
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === "leaving"
          ? "pointer-events-none -translate-y-full"
          : "translate-y-0"
      }`}
    >
      {/* Field: pine-deep + radial vignette + grain dots */}
      <div className="absolute inset-0 bg-pine-deep" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(4, 20, 12, 0.75) 100%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.07]"
        aria-hidden="true"
      >
        <pattern
          id="splash-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="#B68A1E" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#splash-dots)" />
      </svg>

      {/* Title card — drifts up slightly as the curtain lifts, so it
          'hands off' into the hero instead of dead-ending. */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-[850ms] ease-out ${
          phase === "leaving" ? "-translate-y-16" : "translate-y-0"
        }`}
      >
        <div className="animate-splash-logo px-8 text-center">
          <p className="font-display text-4xl font-bold tracking-tight text-wheat sm:text-5xl">
            Sachin Gold
          </p>
          <span className="animate-sweep mx-auto mt-6 block h-px w-44 bg-wheat/80" />
          <p
            className="animate-splash-tagline mt-5 text-[0.65rem] font-medium uppercase tracking-[0.4em] text-linen/70"
          >
            Bulk Agro Commodities
          </p>
          <p className="animate-splash-tagline mt-2 text-[0.6rem] uppercase tracking-[0.5em] text-wheat/60 [animation-delay:0.85s]">
            Estd 1969
          </p>
        </div>
      </div>

      {/* Bottom-edge progress bar — fills over the hold, reads as
          deliberate loading rather than a freeze. */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
        <div
          className={`h-full bg-wheat ${
            phase === "show" ? "animate-splash-progress" : ""
          }`}
        />
      </div>
    </div>
  );
}
