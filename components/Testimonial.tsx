import type { Testimonial as TestimonialType } from "@/lib/types";

/**
 * Renders exactly one real testimonial. This is intentionally singular,
 * not a "Testimonials" carousel — see data/testimonial.ts and the README
 * for why: the old site's testimonials.html page is unedited template
 * filler (fake names, Lorem ipsum), while this one quote, found on the
 * About page instead, is genuine. Don't pad this out with invented quotes
 * to make it look like more social proof than exists. Role label uses
 * wheat-dark for AA contrast on the linen band.
 */
export default function Testimonial({
  testimonial,
}: {
  testimonial: TestimonialType;
}) {
  return (
    <figure className="border-l-4 border-wheat bg-linen p-6 sm:p-10">
      <p className="font-display text-4xl leading-none text-pine" aria-hidden="true">
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
      {/* The customer's real video from the old About page, migrated to
          /videos/. Click-to-play with preload="none": the 6.6MB file costs
          zero bandwidth until the visitor explicitly asks for it, unlike
          the old site's autoplay-lightbox pattern. */}
      {testimonial.video && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold text-pine transition-colors hover:text-pine-deep">
            ▶ Watch the customer&apos;s video feedback
          </summary>
          <video
            controls
            preload="none"
            src={testimonial.video}
            className="mt-4 aspect-video w-full rounded-sm"
          >
            Your browser does not support the video tag.
          </video>
        </details>
      )}
    </figure>
  );
}
