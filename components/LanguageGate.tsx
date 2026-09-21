"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { X } from "lucide-react";
import { localeNames, routing, type Locale } from "@/i18n/routing";

const STORAGE_KEY = "sg-lang-choice";

/**
 * First-visit language prompt — a COMPACT, NON-BLOCKING card in the
 * bottom-right corner (above the WhatsApp float), once per browser.
 *
 * Why a card and not a modal: the visitor came here for commodity
 * rates, not a questionnaire. A full-screen gate hijacks the session
 * and demands an answer before content; a corner card asks the same
 * question, stays dismissible at a glance, and lets the page behind it
 * stay live (no overlay, no scroll lock). The whole point of the choice
 * — each option renders in its own script (हिन्दी, मराठी, ಕನ್ನಡ…) so it
 * is never hidden behind English — is unchanged.
 *
 * Behavior:
 *  - Shows once per browser (localStorage). Any choice — including
 *    "continue in English" via X/Escape — writes it and it never
 *    returns. Re-asking returning visitors is how popups earn hatred.
 *  - Also writes the NEXT_LOCALE cookie so the choice actually steers
 *    middleware on later visits to bare /.
 *  - Non-modal by design: no aria-modal, no focus trap, no scroll lock.
 *    Escape and X both mean "keep the current language".
 *  - Renders nothing during SSR/first paint; mounts after the storage
 *    check; a short delay lets the page land first.
 *  - Positioned above the WhatsApp float (bottom-24) so the two never
 *    collide; z-50 keeps it under nothing it needs to be under.
 */
export default function LanguageGate() {
  const t = useTranslations("langGate");
  const locale = useLocale();
  // i18n-aware router/pathname: usePathname strips the locale prefix, so
  // switching locale can never produce /hi/hi.
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const timer = setTimeout(() => setOpen(true), reduced ? 0 : 1100);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable (private-mode edge cases) — stay silent
      // rather than nag on every load.
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") choose("en");
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function choose(target: Locale) {
    try {
      window.localStorage.setItem(STORAGE_KEY, target);
    } catch {
      /* choice just won't persist; still proceed */
    }
    // Persist to the cookie next-intl's middleware actually reads, so a
    // later visit to bare / lands in the chosen language, not English.
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
    if (target !== locale) {
      router.replace(pathname, { locale: target });
    }
  }

  if (!mounted || !open) return null;

  const options = routing.locales.filter((l) => l !== "en");

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-labelledby="lang-gate-title"
      tabIndex={-1}
      className="animate-fade-up fixed bottom-24 right-4 z-50 w-[min(19rem,calc(100vw-2rem))] rounded-xl border border-ink/10 bg-white shadow-elevated-lg outline-none sm:right-5"
    >
      <button
        type="button"
        onClick={() => choose("en")}
        aria-label={t("dismissAria")}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full text-ink/35 transition-colors hover:bg-linen hover:text-ink"
      >
        <X size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <div className="px-5 pb-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wheat-dark">
          {t("eyebrow")}
        </p>
        <h2
          id="lang-gate-title"
          className="mt-1 font-display text-xl leading-snug text-ink"
        >
          {t("title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pb-3 pt-3">
        {/* English first — the default reads first, top-left. */}
        <button
          type="button"
          onClick={() => choose("en")}
          className="col-span-2 flex min-h-[42px] items-center justify-center rounded-sm bg-pine px-3 text-sm font-semibold text-white transition-colors hover:bg-pine-deep"
        >
          {localeNames.en}
          <span className="ml-1.5 text-[11px] font-medium text-white/70">
            ({t("defaultTag")})
          </span>
        </button>
        {options.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => choose(code)}
            className={`flex min-h-[42px] items-center justify-center rounded-sm border border-ink/15 px-3 py-2 text-sm font-medium text-ink/85 transition-colors hover:border-pine hover:bg-linen hover:text-pine ${
              code === options[options.length - 1] && options.length % 2 === 1
                ? "col-span-2"
                : ""
            }`}
          >
            {localeNames[code]}
          </button>
        ))}
      </div>

      <p className="px-5 pb-4 text-center text-[11px] leading-snug text-ink/40">
        {t("changeLater")}
      </p>
    </div>
  );
}
