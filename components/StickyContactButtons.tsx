"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquareText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { company } from "@/data/company";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Two persistent floating actions, not one — added after reviewing
 * sonaidairy.com's sticky "ENQUIRIES" + WhatsApp pair. Some visitors
 * want to open WhatsApp; others would rather land on a form. Giving
 * both removes a small but real bit of friction for the second group,
 * who previously had no floating affordance at all.
 *
 * Both buttons share one IntersectionObserver (rather than each float
 * running its own, as when this was WhatsAppFloat alone) so the pair
 * slides away together while the home hero's own controls own the
 * bottom-right corner, and returns together once the hero scrolls past.
 *
 * Shadows on both are bespoke, tinted to each button's own color,
 * NOT the neutral shadow-elevate/shadow-glow tokens — a branded
 * floating bubble legitimately casts a color-tinted shadow; glow stays
 * reserved for in-page primary CTAs (Hero, CTA bands, form submit), not
 * persistent chrome that's visible on every page regardless of context.
 */
export default function StickyContactButtons() {
  const t = useTranslations("home.float");
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // First-visit courtesy, carried over from WhatsAppFloat: the
    // LanguageGate card parks in this same corner (bottom-24 right-5 —
    // exactly where the Enquire pill sits) for its first few seconds.
    // Rather than two widgets stacking/fighting, both buttons hold back
    // until the gate closes ("sg-lang-gate-closed"), with a capped
    // fallback so a missed event can never hide them forever. Returning
    // visitors (choice in storage) get the buttons immediately.
    let alreadyChosen = false;
    try {
      alreadyChosen = Boolean(window.localStorage.getItem("sg-lang-choice"));
    } catch {
      // Storage unavailable — treat as "nothing to wait for" rather
      // than hide the buttons indefinitely.
      alreadyChosen = true;
    }

    if (alreadyChosen) {
      setReady(true);
      return;
    }

    function onGateClosed() {
      setReady(true);
    }
    window.addEventListener("sg-lang-gate-closed", onGateClosed);
    const fallback = setTimeout(() => setReady(true), 6000);
    return () => {
      window.removeEventListener("sg-lang-gate-closed", onGateClosed);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const controls = document.querySelector("[data-hero-controls]");
    if (!controls || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setHeroControlsVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.5 },
    );
    io.observe(controls);
    return () => io.disconnect();
  }, []);

  // Both courtesies must clear before the pair appears: language gate
  // closed (first visit) AND home hero controls scrolled away.
  const pairVisible = ready && !heroControlsVisible;
  const hiddenClasses = pairVisible
    ? "translate-y-0 opacity-100"
    : "pointer-events-none translate-y-24 opacity-0";

  return (
    <>
      {/* Enquiry — internal link to the contact page/form, for visitors
          who'd rather not open WhatsApp. Pill shape (icon + short label)
          rather than an icon-only circle: unlike the WhatsApp glyph,
          "enquire" has no universally recognized icon, so the label is
          load-bearing, not decorative. */}
      <Link
        href="/contact"
        aria-label={t("enquireLabel", { name: company.name })}
        className={`fixed bottom-24 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-pine pl-4 pr-5 text-sm font-semibold text-white shadow-[0_4px_10px_-4px_rgba(10,54,32,0.5),0_16px_32px_-10px_rgba(10,54,32,0.45)] transition-all duration-300 hover:-translate-y-px hover:bg-pine-deep ${hiddenClasses}`}
      >
        <MessageSquareText size={18} strokeWidth={2} aria-hidden="true" />
        {t("enquireText")}
      </Link>

      <a
        href={whatsappLink(company.whatsapp, t("message"))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("label", { name: company.name })}
        className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_4px_10px_-4px_rgba(19,110,66,0.55),0_16px_32px_-10px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] ${hiddenClasses}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </>
  );
}
