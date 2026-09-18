import { company } from "@/data/company";
import type { StatItem } from "@/lib/types";

// REAL figures from the live site's About page copy — no placeholders, no
// invented claims. Each traces to company.ts's captured data.
export const homeStats: StatItem[] = [
  {
    value: `${company.yearsOfExperience}+`,
    label: "Years of experience",
  },
  {
    value: `${company.locations.length}`,
    label: "Locations across Maharashtra & Karnataka",
  },
  {
    value: company.processingCapacityTonsPerDay
      ? `${company.processingCapacityTonsPerDay}`
      : "—",
    label: "Tons processed per day",
  },
  {
    // Exact figure: 150000 / 100000 = 1.5 — do NOT round, "2L+" would
    // overstate the client's own published claim.
    value: company.farmersConnected
      ? `${company.farmersConnected / 100000}L+`
      : "—",
    label: "Farmers connected via e-Choupal",
  },
];
