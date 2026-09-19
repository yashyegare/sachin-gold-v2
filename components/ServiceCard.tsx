import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";

/**
 * Service card with the same image-placeholder pattern as ProductCard:
 * a pine-tinted swatch with the service initial until the Phase 2 photo
 * lands at `service.image` — then it renders automatically. Hover: lift,
 * gold "Learn more" reveal, arrow nudge.
 */
export default function ServiceCard({ service }: { service: Service }) {
  const hasImage = service.image.length > 0;

  return (
    <Link
      href={service.href}
      className="group block border border-ink/10 transition-all hover:-translate-y-0.5 hover:border-pine hover:shadow-[0_10px_28px_-14px_rgba(22,35,28,0.25)]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-linen">
        {hasImage ? (
          <Image
            src={service.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-colors group-hover:bg-[#efeadd]">
            <span className="font-display text-3xl text-pine/30 transition-colors group-hover:text-pine/50">
              {service.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="font-display text-lg text-ink">{service.title}</p>
        <p className="mt-2 text-sm text-ink/60">{service.shortDescription}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm text-wheat-dark opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          Learn more
          <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
