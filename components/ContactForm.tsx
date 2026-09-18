"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Submits directly to Web3Forms (https://web3forms.com) — no backend route
 * needed. The access key is meant to be public: it only lets a submission
 * reach the inbox it was registered against, unlike a real API secret.
 *
 * Setup: create a free key at web3forms.com with the client's email, then
 * set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY in .env.local (see .env.example).
 * Until the key is set the form renders disabled — it fails safe rather
 * than letting anyone submit into the void.
 *
 * Spam protection: honeypot field (`botcheck`) — bots fill everything,
 * humans never see it; Web3Forms drops submissions where it's filled.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const enabled = Boolean(process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      // Fails loudly in dev so a missing env var doesn't look like a bug.
      console.error(
        "NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — see .env.example",
      );
      setStatus("error");
      return;
    }

    const formData = new FormData(event.currentTarget);
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
        event.currentTarget.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="animate-fade-in border border-pine/30 bg-linen p-6 text-ink"
      >
        <p className="font-display text-lg">Thank you — message sent.</p>
        <p className="mt-2 text-sm text-ink/70">
          We&apos;ll get back to you shortly with pricing and availability.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <Field label="Name" name="name" required disabled={!enabled} />
        <Field label="Company" name="company" disabled={!enabled} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          name="email"
          type="email"
          required
          disabled={!enabled}
        />
        <Field label="Phone" name="phone" type="tel" disabled={!enabled} />
      </div>
      <div>
        <label className="text-sm font-medium text-ink/80" htmlFor="message">
          Requirement
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={!enabled}
          placeholder="Product, quantity, destination…"
          className="mt-1.5 w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-pine"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          Something went wrong sending your message — please try again, or
          call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={!enabled || status === "submitting"}
        className="rounded-sm bg-pine px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pine-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>

      {!enabled && (
        <p className="text-xs text-ink/40">
          Submission activates once a Web3Forms access key is configured —
          see .env.example (Phase 6).
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink/80" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
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
        className="mt-1.5 w-full border border-ink/20 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-pine"
      />
    </div>
  );
}
