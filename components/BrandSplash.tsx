"use client";

import { useEffect, useRef } from "react";
import { company } from "@/data/company";

/** First homepage visit per browser. CSS owns the 4.7s timeline, including
 * before hydration; completion records the visit and releases LanguageGate. */
export const SPLASH_DONE_EVENT = "sg-splash-done";

declare global {
  interface Window {
    __sgSplashActive?: boolean;
    __sgSplashStartedAt?: number;
  }
}

export default function BrandSplash() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const overlay = overlayRef.current;
    if (!overlay || !window.__sgSplashActive) return;
    // Full-root hydration recovery can replace <html> and drop its attribute.
    // The initial script's window state survives that replacement.
    root.setAttribute("data-splash", "1");
    if (window.__sgSplashStartedAt != null) {
      const elapsed = performance.now() - window.__sgSplashStartedAt;
      for (const animation of overlay.getAnimations({ subtree: true })) {
        animation.currentTime = elapsed;
      }
    }

    let finished = false;
    const finish = () => {
      if (finished || !root.hasAttribute("data-splash")) return;
      finished = true;
      window.__sgSplashActive = false;
      try {
        localStorage.setItem("sg-splash-seen", "1");
      } catch {
        // Storage blocked: still finish, and allow playback on the next load.
      }
      root.removeAttribute("data-splash");
      window.dispatchEvent(new Event(SPLASH_DONE_EVENT));
    };
    const onEnd = (event: AnimationEvent) => {
      if (event.target === overlay && event.animationName === "sg-splash-out") {
        finish();
      }
    };
    overlay.addEventListener("animationend", onEnd);

    // Attach to the actual CSS clock, not hydration time. A delayed bundle
    // may arrive after the animation has already finished. Its filled animation
    // still exposes currentTime, so that case completes immediately as well.
    const animation = overlay.getAnimations().find(
      (item) => item instanceof CSSAnimation && item.animationName === "sg-splash-out",
    );
    const end = Number(animation?.effect?.getComputedTiming().endTime ?? 4700);
    const elapsed = Number(animation?.currentTime ?? 0);
    const teardown = window.setTimeout(finish, Math.max(0, end - elapsed) + 50);

    return () => {
      window.clearTimeout(teardown);
      overlay.removeEventListener("animationend", onEnd);
    };
  }, []);

  return (
    // .grain-dark keeps a flat dark panel this large from showing gradient
    // banding; its ::after sits at z-index 1, under .sg-splash-stack.
    <div ref={overlayRef} className="sg-splash grain-dark" aria-hidden="true">
      <div className="sg-splash-stack">
        <div className="sg-splash-mark">
          {/* Light, not decoration: the bloom gives the foil a source to be
              lit by and fills the dark around the mark on a desktop viewport.
              It lives here rather than inside .sg-splash-badge because that
              box clips to the artwork for the sheen. */}
          <span className="sg-splash-bloom" />
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
