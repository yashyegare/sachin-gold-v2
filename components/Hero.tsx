import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeHero } from "@/data/home";

/**
 * Home page hero.
 *
 * Renders a real facility photo (with a dark gradient overlay for text
 * contrast) once `homeHero.image` is set. Until then, it falls back to a
 * pine-green gradient with a faint wheat dot pattern — a nod to grain
 * without needing a stock photo standing in for the real thing.
 *
 * Green carries the UI everywhere else in the site; gold is deliberately
 * rare — it shows up here only on the eyebrow label and the primary CTA,
 * so it reads as "the product" (grain, oil, dal) rather than a second
 * brand color competing with green.
 */
export default function Hero() {
  const { eyebrow, headline, subheadline, primaryCta, secondaryCta, image } =
    homeHero;
  const hasImage = image.length > 0;

  return (
    <section className="relative isolate overflow-hidden bg-pine-deep">
      {/* Background layer */}
      <div className="absolute inset-0 -z-10">
        {hasImage ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Left-to-right dark overlay so left-aligned text stays readable
                regardless of what's in the photo. */}
            <div className="absolute inset-0 bg-gradient-to-r from-pine-deep via-pine-deep/85 to-pine-deep/40" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-pine-deep via-pine to-[#0c3a24]" />
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.07]"
              aria-hidden="true"
            >
              <pattern
                id="grain-dots"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="#B68A1E" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grain-dots)" />
            </svg>
          </>
        )}
      </div>

      <div className="mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-center px-6 py-24">
        {eyebrow && (
          <p className="animate-fade-up text-sm font-medium uppercase tracking-wide text-wheat-bright">
            {eyebrow}
          </p>
        )}
        <h1
          className="animate-fade-up mt-4 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl"
          style={{ animationDelay: "80ms" }}
        >
          {headline}
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-xl text-white/80"
          style={{ animationDelay: "160ms" }}
        >
          {subheadline}
        </p>

        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "240ms" }}
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
    </section>
  );
}
