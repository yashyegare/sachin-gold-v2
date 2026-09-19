"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal without a library — the AOS replacement. A few lines around
 * the native IntersectionObserver: adds `is-revealed` when the element
 * enters the viewport (once), and the animation itself lives in CSS so
 * prefers-reduced-motion is honored by the existing global rule rather
 * than fought per-component like AOS does.
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref} className="reveal">…</div>
 *
 * Pair the `reveal` class (opacity/transform transition in globals.css)
 * with any element. Also reveals immediately when IntersectionObserver is
 * unavailable or the visitor prefers reduced motion — content is never
 * permanently hidden.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
