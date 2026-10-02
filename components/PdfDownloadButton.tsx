import { Download, FileText } from "lucide-react";

/** The pill's own fill. The gold ring, sheen and breathing glow are shared;
 *  only the surface swaps, so the pill stays visible on both the dark pine
 *  bands and the light sections. */
type Tone = "white" | "pine";

interface Props {
  href: string;
  label: string;
  tone?: Tone;
  className?: string;
}

/**
 * The site's one download affordance. Every locale's label already names the
 * format ("… (PDF)"), so the pill carries no separate hint chip — it would
 * read "Download rate card (PDF) PDF".
 *
 * Interaction language matches every other CTA: shared brand easing, lift on
 * hover, and the arrow chip filling on hover — the icon answers the action.
 * The glow itself lives in globals.css as `.sg-dl` / `.sg-dl--pine`.
 */
export default function PdfDownloadButton({
  href,
  label,
  tone = "white",
  className = "",
}: Props) {
  const pine = tone === "pine";
  return (
    <a
      href={href}
      download
      className={`sg-dl ${pine ? "sg-dl--pine" : ""} group relative inline-flex items-center gap-2.5 overflow-hidden rounded-sm border px-5 py-2.5 text-sm font-semibold transition-transform duration-200 [transition-timing-function:var(--ease-brand)] hover:-translate-y-0.5 ${
        pine
          ? "border-wheat/50 bg-pine text-white"
          : "border-wheat/60 bg-white text-pine-deep"
      } ${className}`}
    >
      <span aria-hidden="true" className="sg-dl-sheen" />
      <FileText
        size={15}
        strokeWidth={1.9}
        aria-hidden="true"
        className={`shrink-0 ${pine ? "text-wheat-bright" : "text-wheat-dark"}`}
      />
      <span className="[text-wrap:balance]">{label}</span>
      <span
        aria-hidden="true"
        className={`sg-dl-arrow flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          pine ? "border-white/50 text-white" : "border-wheat/70 text-pine"
        }`}
      >
        <Download size={11} strokeWidth={2.2} />
      </span>
    </a>
  );
}
