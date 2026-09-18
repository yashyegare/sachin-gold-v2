import type { TeamMember } from "@/lib/types";

// Real names and roles from the live site's About page. Images are left
// empty until migrated from the old repo — the TODO comments name the
// exact source file for each person (run npm run images, then set paths
// like /images/team/mr_sachin.webp).
export const team: TeamMember[] = [
  {
    name: "Shree Shivajirao Hanmantrao Hude",
    role: "Founder",
    image: "", // TODO: no source photo existed on the old site — needs a new one
  },
  {
    name: "Mr. Sachin Shivajirao Hude",
    role: "Director",
    image: "", // TODO: migrate assets/img/team/mr_sachin_img.png
    facebook:
      "https://www.facebook.com/people/Sachin-Shivajirao-Hude/61583847605206/",
  },
  {
    name: "Mr. Sandeep Shivajirao Hude",
    role: "Director",
    image: "", // TODO: migrate assets/img/team/mr_sandeep.jpg
    facebook: "https://www.facebook.com/sandeep.hude.14/",
  },
];
