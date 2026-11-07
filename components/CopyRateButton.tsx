"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RateRowView } from "@/components/RatesTables";

export default function CopyRateButton({ row }: { row: RateRowView }) {
  const t = useTranslations("buyerUx");
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${row.product}: ${row.quoted.price} ${row.quoted.unit}${row.updatedOn ? ` | ${row.updatedOn}` : ""}\nIndicative rate; reconfirm at booking. https://sachingold.com/rates`,
      );
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return (
    <span className="inline-flex flex-col items-end align-middle">
      <button
        type="button"
        onClick={copy}
        aria-label={`${t("copy")}: ${row.product}`}
        className="inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-medium text-pine hover:underline"
      >
        {status === "copied" ? (
          <Check size={13} aria-hidden="true" />
        ) : (
          <Copy size={13} aria-hidden="true" />
        )}
        {t(status === "copied" ? "copied" : "copy")}
      </button>
      <span
        role="status"
        className={
          status === "error"
            ? "max-w-48 whitespace-normal text-xs text-red-700"
            : "sr-only"
        }
      >
        {status === "idle"
          ? ""
          : t(status === "copied" ? "copied" : "copyError")}
      </span>
    </span>
  );
}
