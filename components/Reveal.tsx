"use client";

import type { ReactNode } from "react";
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
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <Tag ref={ref as never} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
