"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-tied parallax without a library — a requestAnimationFrame loop
 * that translates the ref'd element vertically as the viewport scrolls,
 * by a small fraction (speed) of its distance from viewport center.
 *
 * Deliberate guards, both doing real work:
 *  - prefers-reduced-motion: the effect is skipped entirely (offset stays
 *    0) — the background simply sits static, exactly as before.
 *  - touch/pointer devices: parallax is a mouse-wheel-era affordance and
 *    janks on phones (scroll handlers fighting touch scroll). Disabled
 *    via matchMedia("(hover: none)"), which covers phones and tablets.
 *
 * usage:
 *   const ref = useParallax<HTMLDivElement>(0.12);
 *   <div ref={ref} className="will-change-transform">…</div>
 */
export function useParallax<T extends HTMLElement>(speed = 0.1) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const touchOnly = window.matchMedia("(hover: none)").matches;
    if (reducedMotion || touchOnly) return;

    let raf = 0;
    let active = false;

    const update = () => {
      active = false;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // Distance of the element's center from the viewport's center,
      // normalized; multiplied by speed for a subtle drift.
      const delta = (rect.top + rect.height / 2 - viewportH / 2) * speed;
      el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!active) {
        active = true;
        raf = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [speed]);

  return ref;
}
