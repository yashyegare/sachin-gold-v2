import type { TeamMember } from "@/lib/types";

// Real names and roles from the live site's About page. Photos migrated
// via the image pipeline (npm run images, sharp).
//
// The Founder's photo was supplied by the owner in October 2026 (a studio
// portrait). It is framed head-through-chest and set into the 16:10 card by
// scripts/encode-founder-portrait.mjs, so all three cards share one geometry
// instead of the row breaking into a tall portrait beside two wide shots.
export const team: TeamMember[] = [
  {
    name: "Shree Shivajirao Hanmantrao Hude",
    role: "Founder",
    image: "/images/team/shri-sh-hude.webp",
    imageShape: "landscape",
  },
  {
    name: "Mr. Sachin Shivajirao Hude",
    role: "Director",
    // Migrated from the old repo: assets/img/team/mr_sachin_img.png —
    // re-encoded from source with unsharp-mask sharpening (the old
    // webp encode was soft; see the 2026-09 About clarity fix).
    image: "/images/team/sachin-hude.webp",
    imageShape: "landscape",
    facebook:
      "https://www.facebook.com/people/Sachin-Shivajirao-Hude/61583847605206/",
  },
  {
    name: "Mr. Sandeep Shivajirao Hude",
    role: "Director",
    // Migrated from the old repo: assets/img/team/mr_sandeep.jpg —
    // re-encoded with sharpening from source.
    image: "/images/team/sandeep-hude.webp",
    imageShape: "landscape",
    facebook: "https://www.facebook.com/sandeep.hude.14/",
  },
];
