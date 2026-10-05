"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Expand } from "lucide-react";
import GalleryLightbox from "@/components/GalleryLightbox";
import {
  galleryPhotos,
  galleryServices,
  type GalleryPhoto,
} from "@/lib/gallery";

/**
 * Chip labels reuse words the site already prints elsewhere — the home
 * product categories and the About page's own five-stage headings. The
 * gallery sits under those headings on the same page, so its chips get the
 * same translation rather than a sixth synonym invented for this component.
 */
const SERVICE_LABEL: Record<GalleryPhoto["service"], string> = {
  trading: "home.products.categories.trading",
  processing: "home.products.categories.processing",
  extraction: "home.products.categories.extraction",
  storage: "about.process4Title",
  logistics: "about.process5Title",
  team: "about.teamTitle",
};

/**
 * The About gallery: a filterable grid of the site's real photography
 * with a lightbox. Server-rendered in full (the grid IS the content —
 * SEO, no-JS and print all see every photo); the client layer adds the
 * filter chips and the lightbox interaction on top of that markup.
 *
 * Photo captions and alt text stay English: they are the owner's editorial
 * copy about specific photographs (lib/gallery.ts), not UI strings, and
 * translating them is a content decision rather than a code one.
 */
export default function PhotoGallery() {
  const t = useTranslations("gallery");
  const tLabel = useTranslations();
  const [filter, setFilter] = useState<GalleryPhoto["service"] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible = filter
    ? galleryPhotos.filter((p) => p.service === filter)
    : galleryPhotos;

  const openLightbox = useCallback((src: string) => {
    setLightboxIndex(galleryPhotos.findIndex((p) => p.src === src));
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Esc also closes when focus is on the page (not the dialog) — the
  // dialog handles its own keys while open.
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  return (
    <div>
      {/* Filter chips — All + one per service that has photos. */}
      <div
        role="group"
        aria-label={t("filterAria")}
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === null
              ? "border-pine bg-pine text-white"
              : "border-ink/15 bg-white text-ink/70 hover:border-pine/40 hover:text-pine"
          }`}
        >
          {tLabel("services.catalogueAll")} · {galleryPhotos.length}
        </button>
        {galleryServices.map((service) => {
          const count = galleryPhotos.filter(
            (p) => p.service === service,
          ).length;
          return (
            <button
              key={service}
              type="button"
              onClick={() => setFilter(service)}
              aria-pressed={filter === service}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === service
                  ? "border-pine bg-pine text-white"
                  : "border-ink/15 bg-white text-ink/70 hover:border-pine/40 hover:text-pine"
              }`}
            >
              {tLabel(SERVICE_LABEL[service])} · {count}
            </button>
          );
        })}
      </div>

      {/* The grid — real aspect-ratio tiles (no layout shift), the
          whole tile is the button (largest tap target, one tab stop). */}
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {visible.map((photo) => (
          <li key={photo.src} className="aspect-[4/3]">
            <button
              type="button"
              onClick={() => openLightbox(photo.src)}
              className="group relative block h-full w-full overflow-hidden border border-ink/10 shadow-elevated-sm transition-all duration-300 [transition-timing-function:var(--ease-brand)] hover:-translate-y-1 hover:shadow-elevated"
              aria-label={t("openPhoto", { alt: photo.alt })}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover [filter:saturate(0.94)_contrast(1.05)_sepia(0.05)] transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-pine-deep/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Expand size={14} aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={galleryPhotos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
