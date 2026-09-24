"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "sg-intro-seen";
const ENTER_MS = 550;
const HOLD_MS = 1300; // the gold-sweep plays once during this window
const EXIT_MS = 700;

type Phase = "idle" | "entering" | "holding" | "exiting" | "done";

/**
 * The one-time, first-visit brand moment on the home page — the old
 * site's "icon pop-up," redesigned around the ACTUAL old crest logo
 * (public/images/brand/sg-crest.png) rather than the minimal wordmark
 * this had before. That first attempt was too quiet for what was
 * being asked for; this one is a real choreographed reveal:
 *
 *   glow fades in → crest scales/rotates into place → a gold light-sweep
 *   plays once across the badge (masked to its own scalloped silhouette,
 *   not a rectangle) → a brief hold → curtain-wipe exit.
 *
 * On the source asset: sachin_gold_logo2.jpg is a JPEG with a *mixed*
 * black/white background AND white lettering + dark outline strokes
 * within the badge itself — there's no clean color to key out without
 * also eating holes in "SACHIN" and "Gold." So instead of a hard cutout,
 * the shipped PNG uses a soft geometric vignette (radial fade to
 * transparent) around the badge — it reads as the medallion glowing out
 * of the dark background rather than a rectangle pasted on top. See the
 * crest generation notes for exactly how that was built.
 *
 * Everything that made the previous version (and the old site's
 * original) a real cost is still fixed here:
 *  - Skippable instantly on any interaction (click, key, touch, scroll),
 *    from any point in the sequence.
 *  - Checked prefers-reduced-motion — renders nothing under it.
 *  - Session-scoped (sessionStorage), home page only.
 *  - Curtain-wipe exit reuses the site's existing CurtainReveal
 *    technique rather than a new one-off.
 *
 * The one honest tradeoff, unchanged from before: ~2.5s of a first-time
 * visitor not seeing real content by default if they don't interact —
 * longer than the previous minimal version, because a real choreographed
 * moment needs the extra beats to not feel rushed. Still under the old
 * site's ~3s, and instantly skippable the whole way through.
 */
export default function IntroReveal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const skippedRef = useRef(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = Boolean(window.sessionStorage.getItem(STORAGE_KEY));
    } catch {
      seen = true;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (seen || reduced) {
      setPhase("done");
      return;
    }

    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* fine — it just replays next time if storage can't persist it */
    }

    setPhase("entering");
    const t1 = setTimeout(() => setPhase("holding"), ENTER_MS);
    const t2 = setTimeout(() => setPhase("exiting"), ENTER_MS + HOLD_MS);
    const t3 = setTimeout(
      () => setPhase("done"),
      ENTER_MS + HOLD_MS + EXIT_MS,
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (phase !== "entering" && phase !== "holding") return;
    function skip() {
      if (skippedRef.current) return;
      skippedRef.current = true;
      setPhase("exiting");
      setTimeout(() => setPhase("done"), EXIT_MS);
    }
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [phase]);

  if (phase === "idle" || phase === "done") return null;

  const covering = phase !== "exiting";
  const settled = phase === "holding" || phase === "exiting";

  const maskStyle = {
    WebkitMaskImage: "url(/images/brand/sg-crest.png)",
    maskImage: "url(/images/brand/sg-crest.png)",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  } as const;

  return (
    <div
      aria-hidden="true"
      className={`grain-dark fixed inset-0 z-[100] flex items-center justify-center bg-pine-deep transition-[clip-path] ${
        covering
          ? "[clip-path:inset(0_0_0_0%)]"
          : "[clip-path:inset(0_0_0_100%)]"
      }`}
      style={{
        transitionDuration: `${EXIT_MS}ms`,
        transitionTimingFunction: "var(--ease-brand)",
      }}
    >
      <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72 md:h-80 md:w-80">
        {/* Soft breathing gold glow behind the crest */}
        <div
          className={`animate-glow-pulse absolute inset-0 rounded-full blur-3xl transition-opacity duration-700 ${
            settled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(217,169,60,0.45) 0%, rgba(217,169,60,0) 70%)",
          }}
        />

        {/* The crest itself — scale + gentle rotation settle */}
        <div
          className={`relative h-full w-full transition-all duration-[550ms] ${
            phase === "entering"
              ? "scale-75 rotate-[-6deg] opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }`}
          style={{ transitionTimingFunction: "var(--ease-brand)" }}
        >
          <img
            src="/images/brand/sg-crest.png"
            srcSet="/images/brand/sg-crest.png 1x, /images/brand/sg-crest@2x.png 2x"
            alt=""
            className="h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
          />

          {/* Gold light-sweep, masked to the crest's own silhouette —
              only plays once settled, so it never races the entrance. */}
          {settled && (
            <div
              className="animate-gold-sweep pointer-events-none absolute inset-0"
              style={maskStyle}
            >
              <div
                className="h-full w-full mix-blend-overlay"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, transparent 38%, rgba(255,255,255,0.85) 50%, transparent 62%, transparent 100%)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
