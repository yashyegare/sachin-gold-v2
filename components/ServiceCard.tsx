import Link from "next/link";
import type { Service } from "@/lib/types";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={service.href}
      className="group block border border-ink/10 p-6 transition-colors hover:border-pine"
    >
      <p className="font-display text-lg text-ink">{service.title}</p>
      <p className="mt-2 text-sm text-ink/60">{service.shortDescription}</p>
      <span className="mt-4 inline-block text-sm text-pine opacity-0 transition-opacity group-hover:opacity-100">
        Learn more
      </span>
    </Link>
  );
}
