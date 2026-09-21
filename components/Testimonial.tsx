import type { Testimonial as TestimonialType } from "@/lib/types";

/**
 * Renders exactly one real testimonial. This is intentionally singular,
 * not a "Testimonials" carousel — see data/testimonial.ts and the README
 * for why: the old site's testimonials.html page is unedited template
 * filler (fake names, Lorem ipsum), while this one quote, found on the
 * About page instead, is genuine. Don't pad this out with invented quotes
 * to make it look like more social proof than exists. Role label uses
 * wheat-dark for AA contrast on the linen band.
 *
 * The video sits directly beside the quote, not behind a <details>
 * toggle — a real extracted poster frame (public/images/testimonial/)
 * means the visitor already sees the customer before pressing play, so
 * it's one click (native play control) instead of two (expand, then
 * play). preload="metadata" keeps the 6.6MB file from downloading until
 * that click.
 */
export default function Testimonial({
  testimonial,
}: {
  testimonial: TestimonialType;
}) {
  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-stretch md:gap-0">
      <figure className="flex flex-col justify-center border-l-4 border-wheat bg-linen p-6 sm:p-10 md:border-r-0">
        <p
          className="font-display text-4xl leading-none text-pine"
          aria-hidden="true"
        >
          &ldquo;
        </p>
        <blockquote className="mt-2 text-lg italic leading-relaxed text-ink/80">
          {testimonial.quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pine font-display text-sm text-linen"
          >
            {testimonial.name.charAt(0)}
          </span>
          <span>
            <span className="block font-display text-ink">
              {testimonial.name}
            </span>
            <span className="block text-sm uppercase tracking-wide text-wheat-dark">
              {testimonial.role}
            </span>
          </span>
        </figcaption>
      </figure>

      {testimonial.video && (
        <div className="relative aspect-video overflow-hidden border border-t-0 border-ink/10 shadow-[0_18px_44px_-24px_rgba(10,54,32,0.35)] md:aspect-auto md:border-l-0 md:border-t">
          <video
            controls
            preload="metadata"
            poster={testimonial.videoPoster}
            src={testimonial.video}
            className="h-full w-full bg-ink object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
