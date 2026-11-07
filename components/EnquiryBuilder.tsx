"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { products } from "@/data/products";
import { quoteFromForm } from "@/lib/enquiry";
import { trackConversion } from "@/lib/conversions";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

const field = "sg-search mt-2";

/** Lives inside the existing contact form; its fields also travel with email enquiries. */
export default function EnquiryBuilder({
  onReadyChange,
}: {
  onReadyChange: (ready: boolean) => void;
}) {
  const t = useTranslations("buyerUx");
  const [kind, setKind] = useState("purchase");
  const [error, setError] = useState(false);
  const [href, setHref] = useState("");
  const productSelect = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("product");
    const product = products.find((item) => item.slug === slug);
    if (product && productSelect.current)
      productSelect.current.value = product.name;
  }, []);

  function prepare(event: React.MouseEvent<HTMLAnchorElement>) {
    const form = event.currentTarget.closest("form");
    if (!form) return;
    const data = new FormData(form);
    const message = quoteFromForm(data);
    if (!message) {
      event.preventDefault();
      setError(true);
      requestAnimationFrame(() =>
        form.querySelector<HTMLElement>("[data-quote-error]")?.focus(),
      );
      return;
    }
    setError(false);
    // Set the actual clicked anchor synchronously: avoids popup blockers and keeps keyboard activation native.
    const next = whatsappLink(company.whatsapp, message);
    event.currentTarget.href = next;
    setHref(next);
    trackConversion("whatsapp_click", "content");
  }

  return (
    <fieldset
      onChange={(event) => {
        const form = event.currentTarget.closest("form");
        if (form) onReadyChange(Boolean(quoteFromForm(new FormData(form))));
      }}
      data-enquiry-builder
      className="space-y-5 rounded-sm border border-pine/20 bg-linen/60 p-4 sm:p-6"
    >
      <legend className="px-2 font-display text-xl text-pine-deep">
        {t("quoteTitle")}
      </legend>
      <p className="text-sm leading-relaxed text-ink/70">{t("quoteHint")}</p>
      <label className="block text-sm font-medium">
        {t("kind")}
        <select
          name="requirement_type"
          value={kind}
          onChange={(e) => {
            setKind(e.target.value);
            setError(false);
          }}
          className={field}
        >
          {(["purchase", "storage", "transport"] as const).map((value) => (
            <option value={value} key={value}>
              {t(value)}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        {t("product")}
        <select
          ref={productSelect}
          name="product"
          defaultValue=""
          className={field}
        >
          <option value="">{t("chooseProduct")}</option>
          {products.map((product) => (
            <option key={product.slug} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {t("quantity")}
          <input
            className={field}
            name="quantity"
            type="number"
            inputMode="decimal"
            min="0.001"
            max="100000000"
            step="any"
          />
        </label>
        <label className="block text-sm font-medium">
          {t("unit")}
          <select
            className={field}
            name="quantity_unit"
            defaultValue="metric tonnes"
          >
            {(
              [
                ["metric tonnes", "tonnes"],
                ["kg", "kg"],
                ["bags", "bags"],
              ] as const
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {t(label)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        {t("city")}
        <input
          className={field}
          name="destination"
          maxLength={120}
          autoComplete="address-level2"
          placeholder={t("cityHint")}
        />
      </label>
      {kind === "transport" && (
        <label className="block text-sm font-medium">
          {t("origin")}
          <input className={field} name="pickup" maxLength={120} />
        </label>
      )}
      {kind === "storage" && (
        <label className="block text-sm font-medium">
          {t("duration")} ({t("days")})
          <input
            className={field}
            name="storage_days"
            type="number"
            inputMode="numeric"
            min="1"
            max="3650"
            step="1"
          />
        </label>
      )}
      <p
        data-quote-error
        tabIndex={-1}
        role={error ? "alert" : undefined}
        className={error ? "text-sm text-red-700" : "hidden"}
      >
        {t("quoteError")}
      </p>
      <a
        data-conversion-managed
        href={
          href ||
          whatsappLink(
            company.whatsapp,
            "Hi Sachin Gold, I would like a quotation.",
          )
        }
        onClick={prepare}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-pine px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-pine-deep"
      >
        {t("whatsappQuote")}
      </a>
    </fieldset>
  );
}
