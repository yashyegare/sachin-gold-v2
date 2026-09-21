"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

/**
 * The clip-path "curtain" reveal — spent on exactly two moments sitewide
 * (About hero photo, testimonial video poster) per the motion plan's
 * rarity rule: same observer contract as Reveal (adds .is-revealed once,
 * immediately for reduced-motion/unavailable observers), but the CSS
 * side (.reveal-curtain in globals.css) animates a clip-path instead of
 * opacity, so the photo slides into view rather than fading.
 */
export default function CurtainReveal({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="reveal-curtain">
      {children}
    </div>
  );
}
