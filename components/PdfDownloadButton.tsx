import { Download, FileText } from "lucide-react";

type Variant = "quiet" | "solid" | "footer";

interface Props {
  href: string;
  label: string;
  /** Short schema hint rendered in small caps under the label — e.g.
   *  "PDF · 2 pages". Empty hides it. */
  hint?: string;
  variant?: Variant;
  className?: string;
}

/**
 * The site's one download affordance. A deterministic "download bar":
 * icon chip left, label + hint center (wraps gracefully on long
 * translations — KN/TA labels run 2 lines without turning ragged),
 * arrow right-anchored in a circle so the geometry never depends on
 * label length. Long-label wrap was exactly what made the first
 * version look broken in Kannada.
 *
 * Three contexts:
 *  - "quiet"  — white bar on light sections (About, service pages)
 *  - "solid"  — pine bar, for dark or prominent spots
 *  - "footer" — compact nav-row sizing matching the footer link list
 *
 * Interaction language matches every other CTA: shared brand easing,
 * lift + shadow on hover, and the arrow fills its circle on hover —
 * the icon answers the action.
 */
export default function PdfDownloadButton({
  href,
  label,
  hint = "PDF",
  variant = "quiet",
  className = "",
}: Props) {
  if (variant === "footer") {
    return (
      <a
        href={href}
        className={`group inline-flex min-h-[44px] items-center gap-2 text-sm text-ink/70 transition-colors [transition-timing-function:var(--ease-brand)] hover:text-pine ${className}`}
      >
        <FileText
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
          className="shrink-0 text-pine"
        />
        <span className="underline-offset-2 group-hover:underline">
          {label}
        </span>
        <Download
          size={13}
          strokeWidth={1.75}
          aria-hidden="true"
          className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
        />
      </a>
    );
  }

  const bar =
    variant === "solid"
      ? "border border-pine-deep bg-pine text-white shadow-elevated-sm hover:-translate-y-0.5 hover:shadow-elevated"
      : "border border-pine/20 bg-white text-ink shadow-elevated-sm hover:-translate-y-0.5 hover:border-pine/40 hover:shadow-elevated";
  const chip =
    variant === "solid"
      ? "bg-white/10 text-wheat-bright"
      : "bg-pine/[0.06] text-pine";
  const circle =
    variant === "solid"
      ? "border-white/25 text-white group-hover:bg-white group-hover:text-pine"
      : "border-pine/25 text-pine group-hover:bg-pine group-hover:text-white";

  return (
    <a
      href={href}
      className={`group flex w-full items-center gap-4 px-5 py-4 transition-all duration-200 [transition-timing-function:var(--ease-brand)] sm:w-auto sm:min-w-[340px] sm:max-w-md ${bar} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${chip}`}
      >
        <FileText size={18} strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-snug [text-wrap:balance]">
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider opacity-50">
            {hint}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 [transition-timing-function:var(--ease-brand)] ${circle}`}
      >
        <Download size={14} strokeWidth={1.75} />
      </span>
    </a>
  );
}
