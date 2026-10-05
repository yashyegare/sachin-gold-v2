"use client";

import { useState, type FormEvent, type FocusEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CircleCheck,
  Loader2,
  Mail,
  MessageSquareText,
  PhoneCall,
  TriangleAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

type Status = "idle" | "submitting" | "success" | "handoff" | "error";
type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUIRED_FIELDS = ["name", "email", "message"] as const;

/**
 * Field chrome shared by the inputs and the textarea. The wells used to be
 * `bg-linen/60` behind a `border-ink/15` hairline — on a white card that
 * reads as a smudge rather than somewhere to type, so they are white with a
 * real border and a linen focus ring instead. The placeholder is set
 * explicitly: the browser default lands under AA against white.
 */
const FIELD_CLASS =
  "mt-2 w-full rounded-sm border bg-white px-3.5 py-3 text-sm text-ink outline-none transition-[border-color,background-color,box-shadow] duration-200 [transition-timing-function:var(--ease-brand)] placeholder:text-ink/50 hover:border-ink/40 focus:border-pine focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,76,46,0.12)]";

const FIELD_ERROR_CLASS = "border-red-500 focus:border-red-600";
const FIELD_OK_CLASS = "border-ink/25";

/**
 * Submits directly to Web3Forms (https://web3forms.com) — no backend route
 * needed. The access key is meant to be public: it only lets a submission
 * reach the inbox it was registered against, unlike a real API secret.
 *
 * Setup: create a free key at web3forms.com with the client's email, then
 * set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env.local (see .env.local.example).
 * The form renders either way — with no key, submit hands the composed
 * message to the visitor's own mail client (mailto) instead of dropping it,
 * so the highest-intent form on the site is never inert and never shows a
 * visitor an internal build note. That path reports a "handoff", never the
 * "message sent" panel: a mail client that was cancelled or never
 * configured is invisible to us, and the enquiry is not stored anywhere, so
 * claiming delivery would be a lie. The form stays filled and the handoff
 * panel carries a labelled retry link.
 *
 * Spam protection: honeypot field (`botcheck`) — bots fill everything,
 * humans never see it; Web3Forms drops submissions where it's filled.
 *
 * Validation: custom, not the browser's native `required`/`type=email`
 * popovers — those are inconsistent across browsers and don't match the
 * site's design language. `noValidate` turns native validation off;
 * validateField() replaces it, checked on blur (not on every keystroke —
 * nobody wants to be told a field is wrong before they've finished
 * typing it) and again on submit, which also focuses the first invalid
 * field so a keyboard/screen-reader user isn't left guessing what failed.
 *
 * Below the form sits the direct line — WhatsApp, email, phone — because a
 * bulk buyer who won't fill a form still has to be able to reach us. It
 * stays put after a successful send, so the confirmation isn't a dead end.
 *
 * All labels, placeholders and status messages are translated (the form is
 * the highest-intent conversion surface, so it renders in the visitor's
 * chosen language end to end) — including the two validation messages.
 */
export default function ContactForm() {
  const t = useTranslations("contactForm");
  const tc = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [handoffHref, setHandoffHref] = useState("");
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  function validateField(name: string, value: string): string | null {
    if (name === "name" && !value.trim()) return t("requiredError");
    if (name === "email") {
      if (!value.trim()) return t("requiredError");
      if (!EMAIL_RE.test(value.trim())) return t("emailError");
    }
    if (name === "message" && !value.trim()) return t("requiredError");
    return null;
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    const message = validateField(name, value);
    setErrors((prev) => {
      if (!message) {
        if (!(name in prev)) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: message };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: FieldErrors = {};
    for (const name of REQUIRED_FIELDS) {
      const message = validateField(name, String(formData.get(name) ?? ""));
      if (message) nextErrors[name] = message;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      // Focus the first invalid field — the same recovery path a native
      // required-field popover would give, just styled to match the site.
      const firstInvalid = form.querySelector<HTMLElement>(
        `[name="${Object.keys(nextErrors)[0]}"]`,
      );
      firstInvalid?.focus();
      return;
    }

    setStatus("submitting");

    if (!accessKey) {
      // No inbox bridge configured: hand the composed enquiry to the
      // visitor's own mail client, which reaches the same address the
      // form would have posted to. Validation has already run, so the
      // body is complete.
      //
      // This is a handoff, not a send — we cannot see whether the mail
      // client opened or the visitor pressed send, so the form stays
      // populated and says what actually happened instead of claiming a
      // delivery. The retry link is the same href.
      const line = (label: string, value: unknown) =>
        `${label}: ${String(value || "").trim() || "—"}`;
      const body = [
        line(t("name"), formData.get("name")),
        line(t("company"), formData.get("company")),
        line(t("email"), formData.get("email")),
        line(t("phone"), formData.get("phone")),
        "",
        `${t("requirement")}:`,
        String(formData.get("message")),
      ].join("\n");
      const href = `mailto:${company.email}?subject=${encodeURIComponent(
        "New enquiry from sachingold.com",
      )}&body=${encodeURIComponent(body)}`;
      setErrors({});
      setHandoffHref(href);
      setStatus("handoff");
      window.location.href = href;
      return;
    }

    formData.append("access_key", accessKey);
    formData.append("subject", "New enquiry from sachingold.com");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        form.reset();
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      {status === "success" ? (
        <div
          role="status"
          className="animate-fade-in border border-pine/25 bg-pine/[0.04] p-6 text-ink"
        >
          <p className="flex items-center gap-2.5 font-display text-lg text-pine-deep">
            <CircleCheck size={22} className="text-pine" aria-hidden="true" />
            {t("successTitle")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            {t("successBody")}
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-pine underline-offset-4 transition-colors hover:text-pine-deep hover:underline"
          >
            {t("another")}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Honeypot: visually hidden, tabbable-off, ignored by screen readers */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label={t("name")}
              name="name"
              required
              error={errors.name}
              onBlur={handleBlur}
            />
            <Field label={t("company")} name="company" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label={t("email")}
              name="email"
              type="email"
              required
              error={errors.email}
              onBlur={handleBlur}
            />
            <Field label={t("phone")} name="phone" type="tel" />
          </div>
          <div>
            <Label htmlFor="message" label={t("requirement")} required />
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              onBlur={handleBlur}
              aria-required="true"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              placeholder={t("requirementPlaceholder")}
              className={`${FIELD_CLASS} min-h-[136px] resize-y leading-relaxed ${
                errors.message ? FIELD_ERROR_CLASS : FIELD_OK_CLASS
              }`}
            />
            {errors.message && <FieldError id="message-error">{errors.message}</FieldError>}
          </div>

          {status === "handoff" && (
            <div
              role="status"
              className="animate-fade-in border border-wheat/45 bg-wheat/[0.07] px-4 py-4"
            >
              <p className="flex items-start gap-2.5 font-display text-base text-pine-deep">
                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-wheat-dark"
                  aria-hidden="true"
                />
                {t("handoffTitle")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                {t("handoffBody", { email: company.email })}
              </p>
              <a
                href={handoffHref}
                className="mt-4 inline-flex items-center gap-1.5 border border-pine/30 bg-white px-4 py-2.5 text-sm font-semibold text-pine transition-colors hover:border-pine hover:bg-linen"
              >
                <Mail size={14} aria-hidden="true" />
                {t("handoffAction")}
              </a>
            </div>
          )}

          {status === "error" && (
            <p
              role="alert"
              className="flex items-start gap-2.5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              {t("error")}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-pine px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-elevated-sm transition-all duration-200 [transition-timing-function:var(--ease-brand)] hover:-translate-y-0.5 hover:bg-pine-deep hover:shadow-elevated focus-visible:shadow-[0_0_0_3px_rgba(15,76,46,0.25)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-70 disabled:shadow-none sm:w-auto"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                {t("sending")}
              </>
            ) : (
              <>
                {t("submit")}
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-200 [transition-timing-function:var(--ease-brand)] group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>
      )}

      {/* Direct lines — the same panel that used to stand in for the form.
          Now it sits under it: a visitor who would rather not type gets a
          working alternative without leaving the section. */}
      <div className="mt-8 border-t border-ink/10 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/60">
          {tc("directTitle")}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <DirectCard
            href={whatsappLink(
              company.whatsapp,
              "Hi Sachin Gold, I have a bulk enquiry.",
            )}
            icon={<MessageSquareText size={17} strokeWidth={1.75} aria-hidden="true" />}
            label={tc("pillWhatsapp")}
            value={company.phone}
            external
          />
          <DirectCard
            href={`mailto:${company.email}?subject=${encodeURIComponent(
              "Bulk enquiry from sachingold.com",
            )}`}
            icon={<Mail size={17} strokeWidth={1.75} aria-hidden="true" />}
            label={tc("pillEmail")}
            value={company.email}
          />
          <DirectCard
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            icon={<PhoneCall size={17} strokeWidth={1.75} aria-hidden="true" />}
            label={tc("pillShort")}
            value={company.phone}
          />
        </div>
      </div>
    </div>
  );
}

function Label({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  const t = useTranslations("contactForm");
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink/85"
    >
      <span>
        {label}
        {required && (
          <span className="ml-1 text-wheat-dark" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {!required && (
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink/55">
          {t("optional")}
        </span>
      )}
    </label>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700"
    >
      <TriangleAlert size={12} aria-hidden="true" />
      {children}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  onBlur,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <Label htmlFor={name} label={label} required={required} />
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        autoComplete={
          name === "name"
            ? "name"
            : name === "email"
              ? "email"
              : name === "phone"
                ? "tel"
                : name === "company"
                  ? "organization"
                  : undefined
        }
        inputMode={name === "phone" ? "tel" : undefined}
        className={`${FIELD_CLASS} ${error ? FIELD_ERROR_CLASS : FIELD_OK_CLASS}`}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

function DirectCard({
  href,
  icon,
  label,
  value,
  external = false,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex min-h-[44px] flex-col gap-1 border border-ink/15 bg-linen/60 px-4 py-3 transition-all duration-200 [transition-timing-function:var(--ease-brand)] hover:-translate-y-0.5 hover:border-pine/45 hover:bg-white hover:shadow-elevated-sm"
    >
      <span className="flex items-center gap-2 text-pine">
        <span className="transition-transform duration-200 [transition-timing-function:var(--ease-brand)] group-hover:scale-110">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
      </span>
      {value ? (
        <span className="truncate text-sm tabular-nums text-ink/80 transition-colors group-hover:text-ink">
          {value}
        </span>
      ) : null}
    </a>
  );
}
