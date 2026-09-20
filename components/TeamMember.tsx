import BrandPhoto from "@/components/BrandPhoto";
import type { TeamMember } from "@/lib/types";

// Team card with the same image-placeholder pattern as ProductCard/Hero:
// linen circle + initials until a real photo path is set in data/team.ts.
// Role label uses wheat-dark (AA on light surfaces), not raw wheat.
export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const hasImage = member.image.length > 0;
  const initials = member.name
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("");

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
