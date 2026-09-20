import Image from "next/image";

interface BrandPhotoProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /**
   * "scene" — large rectangular photography (services, products, showcase
   * cards): gets the warm color nudge plus a grounding pine-shadow wash at
   * the base, so a golden-hour drone shot, a night facility, and a flat
   * product photo all read as one brand rather than four sources.
   *
   * "portrait" — headshots: the same warm color nudge, no gradient wash
   * (a dark fade looks wrong cropped tight on a small circular face).
   */
  tone?: "scene" | "portrait";
  /** Extra classes for the <Image> itself, e.g. a hover scale transform. */
  imageClassName?: string;
}

/**
 * The "warm & premium" treatment, applied once here instead of repeated
 * per component. Two moves, both deliberately subtle — this should read
 * as "one considered brand," not as an Instagram filter:
 *   1. A gentle saturation/contrast/sepia nudge on every real photo,
 *      pulling four different white balances toward one warm-neutral
 *      common ground.
 *   2. A soft pine-tinted gradient anchored to the bottom edge (scene
 *      photos only) — a classic editorial grounding device that also
 *      quietly improves legibility for any label sitting on the photo.
 */
export default function BrandPhoto({
  src,
  alt,
  sizes,
  priority,
  tone = "scene",
  imageClassName = "",
}: BrandPhotoProps) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover [filter:saturate(0.94)_contrast(1.05)_sepia(0.05)] ${imageClassName}`}
      />
      {tone === "scene" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pine-deep/25 via-pine-deep/0 to-transparent"
        />
      )}
    </>
  );
}
