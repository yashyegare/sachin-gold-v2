"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { company } from "@/data/company";

/** Every full homepage load. CSS owns the 4.7s timeline, including
 * before hydration; completion releases LanguageGate. */
export const SPLASH_DONE_EVENT = "sg-splash-done";

declare global {
  interface Window {
    __sgSplashActive?: boolean;
    __sgSplashStartedAt?: number;
  }
}

export default function BrandSplash() {
  const t = useTranslations("optimization");
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
    const animation = overlay
      .getAnimations()
      .find(
        (item) =>
          item instanceof CSSAnimation &&
          item.animationName === "sg-splash-out",
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
    <>
      <div ref={overlayRef} className="sg-splash" aria-hidden="true">
        <div className="sg-splash-frame" />
        <div className="sg-splash-stack">
          <div className="sg-splash-mark">
            <div className="sg-splash-badge">
              {/* Original artwork layers assemble before hydration. Explicit sizes
                avoid layout shifts and both layers share the same CSS clock. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-hydration decorative animation */}
              <img
                className="sg-splash-shield"
                src="/images/brand/sachin-shield.webp"
                alt=""
                width={900}
                height={696}
                decoding="sync"
                fetchPriority="high"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-hydration decorative animation */}
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
          <div className="sg-splash-copy">
            <div className="sg-splash-word-mask">
              <span className="sg-splash-word">SACHIN</span>
            </div>
            <div className="sg-splash-word-mask">
              <span className="sg-splash-word sg-splash-word-gold">GOLD</span>
            </div>
            <div className="sg-splash-rule" />
            <p className="sg-splash-tagline">A legacy of trust</p>
          </div>
        </div>
        <p className="sg-splash-meta">
          {company.groupName} / Since {company.foundedYear}
        </p>
      </div>
      <button type="button" data-splash-skip className="sg-splash-skip">
        {t("skip")}
      </button>
    </>
  );
}
