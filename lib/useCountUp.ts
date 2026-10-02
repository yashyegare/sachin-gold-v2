"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up-on-scroll-into-view for the StatsBand figures. Runs once, when
 * the band enters the viewport, then the number stays put.
 *
 * - `target` counts 0 → target over ~1.3s with easeOutCubic (fast start,
 *   gentle landing — reads as "settling", not "spinning").
 * - Decimals: pass decimals=1 for "1.5"; the sign ( "+" / "L+" ) stays
 *   in the component — the hook animates the number only. `target` is the
 *   number as it should end up on screen, so a caller that already scaled
 *   150000 down to 1.5 must not be divided again here.
 * - prefers-reduced-motion (or no IntersectionObserver): no animation at
 *   all — the final value renders immediately. SSR markup is the final
 *   value too, so content is never missing and hydration matches; the
 *   count only ever starts from 0 client-side, once the observer fires.
 *
 * Driven by a 33ms setInterval rather than requestAnimationFrame: rAF is
 * paused in embedded/off-screen webviews (where this site's Preview tab
 * runs), which would freeze the count before it starts. A 30fps timer
 * tween is visually identical for a 1.3s one-shot and runs everywhere
 * rAF-starved webviews included.
 */
export function useCountUp(target: number, decimals = 0) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  // SSR and first client render show the FINAL value (no hydration
  // mismatch, content never absent); the animation re-plays it from 0
  // only when the band scrolls into view.
  const [display, setDisplay] = useState(target.toFixed(decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const duration = 1300;
    const stepMs = 33; // ~30fps — plenty smooth for a number tween

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            const start = performance.now();
            const timer = setInterval(() => {
              const p = Math.min(
                (performance.now() - start) / duration,
                1,
              );
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay((target * eased).toFixed(decimals));
              if (p >= 1) clearInterval(timer);
            }, stepMs);
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals]);

  return { ref, display };
}
