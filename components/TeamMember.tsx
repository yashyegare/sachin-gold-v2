import BrandPhoto from "@/components/BrandPhoto";
import type { TeamMember } from "@/lib/types";

interface Props {
  member: TeamMember;
  /** Real founding year (company.foundedYear) — shown only inside the
   *  founder's monogram placeholder, where "no photo yet" would
   *  otherwise read as an unfinished page. */
  foundedSince?: number;
}

/**
 * Team card. Every member renders the SAME 16:10 card geometry, so the
 * founder's missing photo can never unbalance the row:
 *
 *  - Directors: their real landscape studio photo, full-ratio (the old
 *    site's presentation — no small-circle crop that blurred faces).
 *  - Founder (no photo yet): a linen monogram panel — a deliberate
 *    designed object with the initials and the founding year, not an
 *    empty circle that reads as "unfinished".
 *
 * The whole figure block is the hover target: the photo (or panel)
 * lifts, the name's underline accent grows. Placeholder keeps initials
 * fallback logic for any future member without a photo.
 */
export default function TeamMemberCard({
  member,
  foundedSince,
}: Props) {
  const hasImage = member.image.length > 0;
  const isLandscape = member.imageShape === "landscape";

  const initials = member.name
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("");

  return (
    <div className="group text-center">
      <div className="relative aspect-[16/10] overflow-hidden border border-ink/10 bg-linen shadow-elevated-sm transition-all duration-300 [transition-timing-function:var(--ease-brand)] group-hover:-translate-y-1 group-hover:border-pine/30 group-hover:shadow-elevated">
        {hasImage ? (
          <BrandPhoto
            src={member.image}
            alt={member.name}
            sizes="(min-width: 640px) 33vw, 100vw"
            tone="portrait"
            imageClassName="transition-transform duration-700 [transition-timing-function:var(--ease-brand)] group-hover:scale-[1.04]"
          />
        ) : (
          // Deliberate placeholder panel: monogram + founding year.
          // "S S" for Shree Shivajirao — the family name behind all three.
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[linear-gradient(160deg,var(--color-linen,#f7f2e9),#efe8d8)]">
            <span className="font-display text-4xl text-pine/35">
              {initials || member.name.charAt(0)}
            </span>
            {foundedSince && (
              <span className="font-display text-sm text-wheat-dark/70">
                Since {foundedSince}
              </span>
            )}
          </div>
        )}
      </div>
      <p className="mt-4 font-display text-base text-ink">{member.name}</p>
      <p className="text-sm uppercase tracking-wide text-wheat-dark">
        {member.role}
      </p>
      {member.facebook && (
        <p className="mt-2">
          <a
            href={member.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm text-xs font-medium text-ink/50 transition-colors [transition-timing-function:var(--ease-brand)] hover:text-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.4 0-4.05 1.47-4.05 4.17v2.35H7.5V13h2.7v8h3.3z" />
            </svg>
            Facebook
          </a>
        </p>
      )}
    </div>
  );
}
