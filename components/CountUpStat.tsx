"use client";

import { useCountUp } from "@/lib/useCountUp";

interface Props {
  /** The full displayed figure, e.g. "57+", "1.5L+", "550" — the tail
   *  the animation does NOT touch (sign/unit suffix). */
  prefix?: string;
  number: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * One animated stat figure: `<CountUpStat number={57} suffix="+" />`.
 * Renders the complete final value server-side (SEO, no-JS, reduced
 * motion), then counts up from 0 when scrolled into view. The element
 * keeps a fixed min-width via tabular-nums on the parent, so the
 * counting digits don't shift the band's alignment.
 */
export default function CountUpStat({
  prefix,
  number,
  suffix,
  decimals = 0,
  className = "",
}: Props) {
  const { ref, display } = useCountUp(number, decimals);

  return (
    <p ref={ref} className={className}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      <span>{display}</span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </p>
  );
}
