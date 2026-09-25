"use client";

import type { CSSProperties, ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

/**
 * Thin wrapper around useReveal for section-level reveals:
 *   <Reveal><ServiceGrid /></Reveal>
 * Staggering: pass style={{ transitionDelay }} on children or use
 * multiple Reveal blocks. The animation is CSS (globals.css `.reveal`).
 */
export default function Reveal({
  children,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Mostly for stagger: style={{ transitionDelay: `${i * 90}ms` }} —
   *  the delay applies to the .reveal transition itself, so pass it here
   *  (not on a child) or the stagger silently does nothing. */
  style?: CSSProperties;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
