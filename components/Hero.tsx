"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Home hero — the old site's rotating banner, rebuilt properly:
 *
 * - Real crossfade between frames, each with its own copy (translated).
 * - **Bandwidth discipline (the Phase 2 principle, applied to the hero):**
 *   only the active slide and upcoming one are mounted. The first
 *   slide gets priority; the upcoming image can decode before its turn.
 * - Auto-advances every 3.5s; pauses while hovered, focused, or tapped,
 *   and via an explicit pause button — WCAG 2.2.2 requires a way to pause
 *   moving content that isn't hover-only.
 * - Slide indicators double as progress bars: the active bar fills over
 *   the slide's duration, so the timing is visible, not a surprise.
 * - Keyboard: dots are real buttons (click to jump between slides).
 * - Reduced motion: no autoplay at all — a static hero with manual dots.
 * - The active image is `priority` (LCP).
 */
const SLIDE_MS = 3500;

const slideKeys = [
  "facility",
  "trading",
  "extraction",
  "warehousing",
  "logistics",
] as const;

const slideImages = [
  "/images/hero/facility.webp",
  "/images/hero/trading.webp",
  "/images/hero/extraction.webp",
  "/images/hero/warehousing.webp",
  "/images/hero/logistics.webp",
];

export default function Hero() {
  const t = useTranslations("home.hero");
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = userPaused || hovered || focused;
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion: never autoplay.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slideKeys.length),
    [],
  );

  const goTo = useCallback((i: number) => setIndex(i), []);

  // A single timer owner. Slide changes reset the delay without bypassing
  // user pause, hover, focus, or reduced-motion preferences.
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [paused, reducedMotion, next, index]);

  // Which frames are mounted: the active one always; the upcoming one
  // mounted ahead of time so it is decoded when the crossfade
  // starts. Everything else is unmounted — its file is never requested.
  const mounted = new Set<number>([index]);
  if (!reducedMotion) mounted.add((index + 1) % slideKeys.length);
  // While paused there is no "upcoming" — don't preload for nothing.
  if (paused && slideKeys.length > 1)
    mounted.delete((index + 1) % slideKeys.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("ariaLabel")}
      className="relative isolate overflow-hidden bg-pine-deep grain-dark"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      {/* Background layers — only the mounted frames render; the active
          frame eases in over 300ms. Only the active slide is exposed to
          assistive tech. */}
      <div className="absolute inset-0 -z-10">
        {slideKeys.map((key, i) =>
          mounted.has(i) ? (
            <div
              key={key}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-300 ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slideImages[i]!}
                alt=""
                fill
                priority={i === 0 && index === 0}
                sizes="100vw"
                className={`object-cover [filter:saturate(0.94)_contrast(1.05)_sepia(0.05)] ${
                  i === index && !reducedMotion ? "animate-kenburns" : ""
                }`}
              />
            </div>
          ) : null,
        )}
        {/* Dark gradient so left-aligned copy stays readable on any frame. */}
        <div className="absolute inset-0 bg-gradient-to-r from-pine-deep via-pine-deep/85 to-pine-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/60 via-transparent to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-center px-6 py-24">
        <div className="max-w-2xl" aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">
          {/* Copy keyed by slide so text re-animates on each change. */}
          <div key={index}>
            <p className="animate-fade-up text-sm font-medium uppercase tracking-wide text-wheat-bright">
              {t(`slides.${slideKeys[index]}.eyebrow`)}
            </p>
            <h1
              className="animate-fade-up mt-4 font-display text-display-xl text-white"
              style={{ animationDelay: "80ms" }}
            >
              {t(`slides.${slideKeys[index]}.headline`)}
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-xl text-white/80"
              style={{ animationDelay: "160ms" }}
            >
              {t(`slides.${slideKeys[index]}.subheadline`)}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-sm bg-wheat px-6 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-wheat/90 hover:shadow-lg"
            >
              {t("primaryCta")}
              <ArrowRight
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/rates"
              className="rounded-sm border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {t("secondaryCta")}
            </Link>
          </div>
        </div>

        {/* Controls row: manual selectors remain available with reduced motion. data-hero-controls: the floating WhatsApp
            button watches this corner via IntersectionObserver and yields
            while it's visible. */}
        <div className="absolute inset-x-0 bottom-0" data-hero-controls>
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-6">
              <div
                role="group"
                aria-label={t("slidePicker")}
                className="flex items-center gap-2"
              >
                {slideKeys.map((key, i) => (
                  <button
                    key={key}

                    aria-pressed={i === index} data-slide-index={i}
                    aria-label={t("chooseSlide", {
                      index: i + 1,
                      total: slideKeys.length,
                      name: t(`slides.${key}.eyebrow`),
                    })}
                    onClick={() => goTo(i)}
                    className="group relative h-6 w-10 cursor-pointer"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                      <span
                        className={`absolute inset-y-0 left-0 bg-wheat transition-none ${
                          i === index
                            ? paused
                              ? "w-1/2"
                              : "animate-slide-progress"
                            : i < index
                              ? "w-full opacity-40"
                              : "w-0"
                        }`}
                      />
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-pressed={userPaused}
                aria-label={userPaused ? t("play") : t("pause")}
                hidden={reducedMotion}
                className="rounded-full border border-white/25 p-2.5 text-white/75 transition-colors hover:border-wheat-bright hover:text-wheat-bright"
              >
                {userPaused ? (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M3 1.5l7 4.5-7 4.5v-9z" />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
      </div>
    </section>
  );
}
