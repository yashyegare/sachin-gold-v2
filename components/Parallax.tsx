"use client";

import type { ReactNode } from "react";
import { useParallax } from "@/lib/useParallax";

/**
 * Client wrapper for the scroll-parallax hook, so server components can
 * place a parallax layer (the hook itself needs "use client"). Children
 * render through untouched — still server markup. The hook disables
 * itself for reduced-motion and touch-only visitors, in which case this
 * is a plain pass-through div.
 */
export default function Parallax({
  children,
  speed = 0.08,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useParallax<HTMLDivElement>(speed);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
