"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("buyerUx");
  const [status, setStatus] = useState<"idle" | "busy" | "ready" | "error">(
    "idle",
  );
  const pending = useRef(false);
  async function download(event: React.MouseEvent<HTMLAnchorElement>) {
    // Keep native save/open behavior for modified clicks.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setStatus("busy");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(href, { signal: controller.signal });
      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/pdf")
      )
        throw new Error("PDF unavailable");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = href.split("/").pop()?.split("?")[0] || "sachin-gold.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      pending.current = false;
      window.clearTimeout(timeout);
    }
  }
  return (
    <span className="inline-flex flex-col items-start">
      <a
        onClick={download}
        aria-busy={status === "busy"}
        aria-disabled={status === "busy"}
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
        <span className="[text-wrap:balance]">
          {status === "busy" ? t("downloadBusy") : label}
        </span>
        <span
          aria-hidden="true"
          className={`sg-dl-arrow flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            pine ? "border-white/50 text-white" : "border-wheat/70 text-pine"
          }`}
        >
          <Download size={11} strokeWidth={2.2} />
        </span>
      </a>
      <span
        role="status"
        className={`mt-1 text-xs ${status === "error" ? "text-red-700" : "text-pine"}`}
      >
        {status === "idle"
          ? ""
          : t(
              status === "busy"
                ? "downloadBusy"
                : status === "ready"
                  ? "downloadReady"
                  : "downloadError",
            )}
      </span>
    </span>
  );
}
