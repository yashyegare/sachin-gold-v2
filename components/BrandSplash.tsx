"use client";

import { useEffect, useRef } from "react";
import { company } from "@/data/company";

/**
 * First-visit brand splash — the real badge assembles itself on a warm
 * near-black curtain over the whole viewport, then the curtain lifts away to
 * reveal the page. Rendered by the home page only.
 *
 * Who sees it: a browser visiting the homepage for the first time, once,
 * ever. All the gating happens in the inline script in the root layout,
 * which runs BEFORE first paint and marks <html> with `data-splash` — so
 * the curtain is present at first paint instead of slamming over an
 * already rendered page. This component only writes the `sg-splash-seen`
 * flag that makes it a one-time event.
 *
 * The artwork is not the supplied JPG: scripts/prepare-brand-mark.mjs keys
 * out the photo's white ground and splits the badge into the two layers
 * below, so the laurel can come down onto the shield instead of the whole
 * mark just appearing.
 *
 * Why it can't get in the way:
 * - The whole timeline is CSS (globals.css), driven by animation-delay, so
 *   it never waits on React hydration or a slow JS bundle.
 * - Every animation ends in the "gone" state with fill-mode `both`, so the
 *   curtain is off-screen and non-interactive at ~3.0s even if this effect
 *   never runs. A visitor with JS broken still reaches the site.
 * - `prefers-reduced-motion`: the inline script never sets the attribute
 *   and the CSS hides the element outright — two independent paths to "no
 *   splash".
 * - Click, tap or any keypress cuts it short via `.is-skipped`.
 * - It is `aria-hidden` and `pointer-events: none`: a decorative brand
 *   moment, not a dialog. No focus trap, nothing announced, no Escape to
 *   press — the page behind it is the content.
 *
 * It also dispatches `sg-splash-done` when the curtain leaves, which the
 * LanguageGate waits on, so a first visit gets two beats in sequence
 * (brand moment, then the language card) rather than both at once.
 */
export const SPLASH_SEEN_KEY = "sg-splash-seen";
export const SPLASH_DONE_EVENT = "sg-splash-done";

// Module scope, not a ref: React 18 StrictMode mounts, unmounts and remounts
// this effect once in dev, and a ref-guarded one-shot would be torn down by
// the fake unmount — which is exactly what made the curtain vanish before it
// was ever visible. The flag survives the remount; the timeline runs once.
let started = false;

export default function BrandSplash() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (started || !root.hasAttribute("data-splash")) return;
    started = true;

    try {
      window.localStorage.setItem(SPLASH_SEEN_KEY, "1");
    } catch {
      // Storage unavailable — the splash just replays next load, which is
      // better than suppressing it for everyone whose browser blocks it.
    }

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.removeAttribute("data-splash");
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    };

    // Any intent to move on cuts the curtain short: the exit animation
    // restarts at 350ms (the [data-splash] .is-skipped rule) and the
    // teardown follows it.
    const skip = () => {
      if (overlayRef.current?.classList.contains("is-skipped")) return;
      overlayRef.current?.classList.add("is-skipped");
      clearTimeout(teardown);
      teardown = setTimeout(finish, 370);
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);

    // CSS owns the motion; this timer only tears the element down after it
    // has left. 3000ms = --sg-out + --sg-out-dur in globals.css.
    //
    // Deliberately NOT cleared on unmount: nothing here touches component
    // state, so a stray finish() after a mid-animation navigation is simply
    // an attribute removal and an event nobody listens to.
    let teardown = setTimeout(finish, 3000);
  }, []);

  return (
    // .grain-dark keeps a flat dark panel this large from showing gradient
    // banding; its ::after sits at z-index 1, under .sg-splash-stack.
    <div ref={overlayRef} className="sg-splash grain-dark" aria-hidden="true">
      <div className="sg-splash-stack">
        <div className="sg-splash-badge">
          {/* Explicit width/height attributes match the layer's slice of the
              900x852 canvas, so the box is sized before the bytes arrive. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- the two
              layers must decode in lockstep for the assembly animation, and
              this overlay paints before hydration; next/image offers neither
              decoding control nor a pre-hydration-safe path. */}
          <img
            className="sg-splash-shield"
            src="/images/brand/sachin-shield.webp"
            alt=""
            width={900}
            height={696}
            decoding="sync"
            fetchPriority="high"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- see the
              shield above; both layers share the same constraint. */}
          <img
            className="sg-splash-laurel"
            src="/images/brand/sachin-laurel.webp"
            alt=""
            width={900}
            height={156}
            decoding="sync"
            fetchPriority="high"
          />
          <span className="sg-splash-sheen" />
        </div>
        <div className="sg-splash-rule">
          <span className="sg-splash-rule-fill" />
        </div>
        {/* Group name, "Est." and the town are proper nouns and an
            abbreviation — locale-neutral by the same rule that keeps product
            names in Latin, so this needs no message keys. The badge already
            carries the wordmark, so nothing here repeats it. */}
        <p className="sg-splash-meta">
          {company.groupName} <span>·</span> Est. {company.foundedYear}
          {" · "}
          {company.locations[0]}
        </p>
      </div>
    </div>
  );
}
