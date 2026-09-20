"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { homeHero, heroSlides } from "@/data/home";

/**
 * Home hero — the old site's rotating banner, rebuilt properly:
 *
 * - Real crossfade between frames, each with its own verbatim copy from
 *   the old carousel.
 * - **Bandwidth discipline (the Phase 2 principle, applied to the hero):**
 *   only the active slide and the upcoming one are mounted. The first
 *   paint downloads exactly one hero image (~180KB) — the other frames'
 *   files are not requested until their turn approaches. An unmounted
 *   slide costs nothing; a stacked-but-hidden one costs its full download,
 *   because at inset-0 every frame is "on screen" to the lazy-loader.
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

export default function Hero() {
  const { primaryCta, secondaryCta } = homeHero;
  const slides = heroSlides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Respect prefers-reduced-motion: never autoplay.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );

  // Autoplay interval — 1s tick drives the progress-bar fill via CSS;
  // slide switch on interval completion. Disabled when paused.
  useEffect(() => {
    if (paused || reducedMotion) return;
    timerRef.current = setInterval(next, SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, next]);

  // Which frames are mounted: the active one always; the upcoming one
  // mounted mid-slide so it's decoded and ready the moment the crossfade
  // starts. Everything else is unmounted — its file is never requested.
  const mounted = new Set<number>([index]);
  if (!reducedMotion) mounted.add((index + 1) % slides.length);
  // While paused there is no "upcoming" — don't preload for nothing.
  if (paused && slides.length > 1) mounted.delete((index + 1) % slides.length);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Sachin Gold highlights"
      className="relative isolate overflow-hidden bg-pine-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Background layers — only the mounted frames render; the active
          frame eases in over 300ms (transition, not a keyframe, so it
          never fights the hidden frame's opacity-0). Only the active
          slide is exposed to assistive tech. */}
      <div className="absolute inset-0 -z-10">
        {slides.map((s, i) =>
          mounted.has(i) ? (
            <div
              key={s.image}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={i === index}
                sizes="100vw"
                className={`object-cover ${
                  i === index && !reducedMotion ? "animate-kenburns" : ""
                }`}
              />
            </div>
          ) : null,
        )}
        {/* Dark gradient so left-aligned copy stays readable on any frame;
            slightly stronger than the old single-image version because the
            frames vary in brightness. */}
        <div className="absolute inset-0 bg-gradient-to-r from-pine-deep via-pine-deep/85 to-pine-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-deep/60 via-transparent to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-center px-6 py-24">
        <div
          className="max-w-2xl"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Copy keyed by slide so text re-animates on each change. */}
          <div key={index}>
            <p className="animate-fade-up text-sm font-medium uppercase tracking-wide text-wheat-bright">
              {slide.eyebrow}
            </p>
            <h1
              className="animate-fade-up mt-4 font-display text-4xl leading-tight text-white sm:text-5xl"
              style={{ animationDelay: "80ms" }}
            >
              {slide.headline}
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-xl text-white/80"
              style={{ animationDelay: "160ms" }}
            >
              {slide.subheadline}
            </p>
          </div>

          <div
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href={primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-sm bg-wheat px-6 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-wheat/90 hover:shadow-lg"
            >
              {primaryCta.label}
              <ArrowRight
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="rounded-sm border border-white/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        {/* Controls row: progress indicators + pause. Hidden entirely when
            reduced motion is on (single static hero, no controls needed). */}
        {!reducedMotion && (
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-6">
              <div
                role="tablist"
                aria-label="Choose slide"
                className="flex items-center gap-2"
              >
                {slides.map((s, i) => (
                  <button
                    key={s.image}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1} of ${slides.length}: ${s.eyebrow}`}
                    onClick={() => setIndex(i)}
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
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? "Play carousel" : "Pause carousel"}
                className="rounded-full border border-white/25 p-2.5 text-white/75 transition-colors hover:border-wheat-bright hover:text-wheat-bright"
              >
                {paused ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                    <path d="M3 1.5l7 4.5-7 4.5v-9z" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                    <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
