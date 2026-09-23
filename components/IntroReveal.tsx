"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "sg-intro-seen";
const ENTER_MS = 500; // ms — mark fades/scales in
const HOLD_MS = 700;
const EXIT_MS = 650;

type Phase = "idle" | "entering" | "holding" | "exiting" | "done";

/**
 * The one-time, first-visit brand moment on the home page — the old
 * site's "icon pop-up" (a full-screen white overlay, the gold crest
 * logo zooming in over 2s, held, then fading out — ~3s total, with no
 * way to skip it and no reduced-motion check at all). Rebuilt from
 * scratch rather than restored, fixing every real cost that came with
 * it the first time:
 *
 *  - ~3s, unskippable, solid white block that hid the whole page →
 *    ~1.85s total, and instantly skippable on ANY interaction (click,
 *    key, touch, scroll) at any point during it.
 *  - Solid white (jars against the rest of the brand) → pine-deep with
 *    the same grain texture used by every other dark section, so this
 *    reads as "this site," not a loading blocker.
 *  - The old gold-foil clip-art crest → the real mark (sg-mark.svg).
 *  - Zero reduced-motion handling → checked properly; under
 *    prefers-reduced-motion this component renders nothing at all.
 *  - A flat opacity fade → a curtain-wipe exit (clip-path), the same
 *    technique CurtainReveal already established elsewhere on the site
 *    (About's hero photo, the testimonial poster) rather than a new
 *    one-off animation invented just for this.
 *
 * Session-scoped (sessionStorage) deliberately, not localStorage like
 * LanguageGate: a language choice is a durable preference; "have you
 * already seen the brand moment" is intentionally allowed to happen
 * again on a fresh browser session later — matching the old site's own
 * sessionStorage choice.
 *
 * Home page only, mounted from app/[locale]/page.tsx — a visitor
 * landing straight on /rates or /contact from a search result shouldn't
 * get a homepage-flavored intro before they see the page they asked for.
 */
export default function IntroReveal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const skippedRef = useRef(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = Boolean(window.sessionStorage.getItem(STORAGE_KEY));
    } catch {
      seen = true; // storage unavailable — fail open, never gate on an edge case
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

  // Any interaction skips straight to the exit wipe, from whatever point
  // the intro is at — a visitor who came here to check a rate shouldn't
  // be made to sit through a brand moment they didn't ask to watch twice.
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
      <div className="flex flex-col items-center">
        <img
          src="/sg-mark.svg"
          alt=""
          width={72}
          height={72}
          className={`rounded-2xl transition-all duration-500 ${
            phase === "entering" ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{ transitionTimingFunction: "var(--ease-brand)" }}
        />
        <p
          className={`mt-4 font-display text-lg tracking-wide text-white transition-all delay-150 duration-500 ${
            phase === "entering"
              ? "translate-y-1 opacity-0"
              : "translate-y-0 opacity-90"
          }`}
          style={{ transitionTimingFunction: "var(--ease-brand)" }}
        >
          Sachin <span className="text-wheat-bright">Gold</span>
        </p>
      </div>
    </div>
  );
}
