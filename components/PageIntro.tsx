import type { ReactNode } from "react";
import BrandPhoto from "@/components/BrandPhoto";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  /** Lead paragraph under the title. Omit for pages that compose their
   *  own intro from children (e.g. Contact's quick-action pills). */
  description?: ReactNode;
  /** Optional real photograph behind the band (BrandPhoto scene
   *  treatment), blended into pine-deep from the left so the copy stays
   *  readable. Currently used by Contact. */
  image?: string;
  /** Extra content inside the band below the intro copy — quick-contact
   *  pills, a scale strip, WhatsApp links. */
  children?: ReactNode;
}

/**
 * The one intro band every inner page opens with — About, Rates, Contact,
 * Services. Before this component the same idea was built three times
 * independently (flat here, dotted there, plain elsewhere); the subtle
 * gold dot texture is now THE treatment, defined once. The band sits on
 * pine-deep; section spacing comes from .section-airy so every page's
 * opener breathes identically.
 */
export default function PageIntro({
  eyebrow,
  title,
  description,
  image,
  children,
}: PageIntroProps) {
  return (
    <section className="section-airy relative overflow-hidden bg-pine-deep px-6">
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <BrandPhoto src={image} alt="" sizes="100vw" />
          {/* Blend the photo into the band so left-aligned copy keeps a
              solid field — the photo surfaces toward the right edge. */}
          <div className="absolute inset-0 bg-gradient-to-r from-pine-deep via-pine-deep/90 to-pine-deep/60" />
        </div>
      )}

      {/* The shared texture — small gold dots at 6% opacity. aria-hidden:
          purely decorative, invisible to assistive tech. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <pattern
          id="page-intro-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="#B68A1E" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#page-intro-dots)" />
      </svg>

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wheat-bright">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 leading-relaxed text-white/80">{description}</p>
          )}
        </div>
        {children && <div className="relative mt-10">{children}</div>}
      </div>
    </section>
  );
}
