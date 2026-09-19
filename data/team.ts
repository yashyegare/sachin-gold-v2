import type { TeamMember } from "@/lib/types";

// Real names and roles from the live site's About page. Photos migrated
// via the image pipeline (npm run images, sharp).
//
// NOTE: the old repo also has assets/img/team/anna.jpg — a real, candid
// photo of a man not referenced anywhere in the site's HTML or matched to
// any name in about.html. It's processed and sitting at
// /images/team/unconfirmed-anna.webp but deliberately NOT wired into this
// array. "Anna" is a common respectful title for an elder/patriarch in
// Marathi, so this could plausibly be the Founder (whose photo is
// otherwise missing) — but that's a guess, not a fact. Confirm with the
// client before using it as the Founder's photo.
export const team: TeamMember[] = [
  {
    name: "Shree Shivajirao Hanmantrao Hude",
    role: "Founder",
    image: "", // TODO: no source photo existed on the old site — needs a new one
  },
  {
    name: "Mr. Sachin Shivajirao Hude",
    role: "Director",
    // Migrated from the old repo: assets/img/team/mr_sachin_img.png
    image: "/images/team/sachin-hude.webp",
    facebook:
      "https://www.facebook.com/people/Sachin-Shivajirao-Hude/61583847605206/",
  },
  {
    name: "Mr. Sandeep Shivajirao Hude",
    role: "Director",
    // Migrated from the old repo: assets/img/team/mr_sandeep.jpg
    image: "/images/team/sandeep-hude.webp",
    facebook: "https://www.facebook.com/sandeep.hude.14/",
  },
];
