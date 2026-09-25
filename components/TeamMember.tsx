import BrandPhoto from "@/components/BrandPhoto";
import type { TeamMember } from "@/lib/types";

/**
 * Team card, two shapes driven by the photo's actual ratio:
 *
 *  - portrait/square photos → the round headshot (circle reserved for
 *    circular identity elements, per the site's shape rule).
 *  - landscape photos → full-ratio bordered card. The directors' real
 *    photos are 16:9-ish studio shots from the old site, where they
 *    were displayed full-width and looked clear; forcing them into a
 *    small square circle (192px, center-cropped) is what made them
 *    look blurry in v2. No crop = no lost faces, and the full source
 *    resolution lands on screen instead of a 192px slice of it.
 *
 * Placeholder (no image yet — the Founder) keeps the linen circle +
 * initials either way.
 */
export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const hasImage = member.image.length > 0;
  const initials = member.name
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("");

  const isLandscape = member.imageShape === "landscape";

  if (hasImage && isLandscape) {
    return (
      <div className="text-center">
        <div className="relative aspect-[16/10] overflow-hidden border border-ink/10 bg-linen shadow-elevated-sm transition-shadow duration-300 [transition-timing-function:var(--ease-brand)] group-hover:shadow-elevated">
          <BrandPhoto
            src={member.image}
            alt={member.name}
            sizes="(min-width: 640px) 33vw, 100vw"
            tone="portrait"
          />
        </div>
        <p className="mt-4 font-display text-base text-ink">{member.name}</p>
        <p className="text-sm uppercase tracking-wide text-wheat-dark">
          {member.role}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[12rem] overflow-hidden rounded-full bg-linen">
        {hasImage ? (
          <BrandPhoto
            src={member.image}
            alt={member.name}
            sizes="192px"
            tone="portrait"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl text-pine/40">
              {initials}
            </span>
          </div>
        )}
      </div>
      <p className="mt-4 font-display text-base text-ink">{member.name}</p>
      <p className="text-sm uppercase tracking-wide text-wheat-dark">
        {member.role}
      </p>
    </div>
  );
}
