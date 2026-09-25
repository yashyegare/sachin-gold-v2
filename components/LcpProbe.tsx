"use client";

import { useEffect } from "react";

/**
 * Dev-only LCP guard — logs the Largest Contentful Paint entry (value,
 * element, attribution) so the real cost of the hero carousel / font
 * swaps is measured, not guessed. Nothing renders; the listener is
 * registered only when process.env.NODE_ENV === "development", so
 * production bundles carry none of this.
 *
 * LCP fires once per navigation (final candidate); `once: true` is enough.
 * Buffered entries ensure a load that completed before hydration still
 * reports.
 */
export default function LcpProbe() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (!("PerformanceObserver" in window)) return;

    const obs = new PerformanceObserver(
      (list: PerformanceObserverCallbackArg) => {
        const last = list.getEntries()[list.getEntries().length - 1];
        if (!last) return;
        const entry = last as PerformanceEntry & {
          element?: Element;
          renderTime?: number;
          loadTime?: number;
          url?: string;
        };
        const node = entry.element;
        const describe = (el: Element | undefined): string => {
          if (!el) return "(removed from DOM)";
          const tag = el.tagName.toLowerCase();
          const cls = (el as HTMLElement).className;
          const clsStr = typeof cls === "string" ? `.${cls.split(" ").slice(0, 3).join(".")}` : "";
          const src = el.getAttribute("src") ?? el.getAttribute("srcset");
          return `${tag}${clsStr}${src ? ` [src=${src.slice(0, 60)}]` : ""}`;
        };
        // eslint-disable-next-line no-console
        console.info(
          `[LCP] ${(entry.renderTime ?? entry.loadTime ?? entry.startTime).toFixed(0)}ms → ${describe(node)}${entry.url ? ` (${entry.url.slice(0, 60)})` : ""}`,
        );
      },
    );
    obs.observe({ type: "largest-contentful-paint", buffered: true } as PerformanceObserverInit);
    return () => obs.disconnect();
  }, []);

  return null;
}

// Minimal structural type so the attribution fields typecheck without
// importing DOM iteration lib specifics that vary across TS versions.
type PerformanceObserverCallbackArg = {
  getEntries(): PerformanceEntry[];
};
