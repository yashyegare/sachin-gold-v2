"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { GalleryPhoto } from "@/lib/gallery";

interface Props {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/**
 * Lightbox for the About gallery — keyboard navigable (← → navigate,
 * Escape closes), click-outside closes, arrows loop at the ends. Body
 * scroll is locked while open. Images render through next/image at
 * constrained dimensions (no layout blowout, still optimized).
 */
export default function GalleryLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: Props) {
  const photo = photos[index];
  if (!photo) return null;

  const prev = useCallback(
    () => onNavigate((index - 1 + photos.length) % photos.length),
    [index, photos.length, onNavigate],
  );
  const next = useCallback(
    () => onNavigate((index + 1) % photos.length),
    [index, photos.length, onNavigate],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, prev, next]);

  // Render through a portal so the lightbox escapes every stacking
  // context in the page tree (the site uses z-50 overlays).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-pine-deep/95 p-4 backdrop-blur-sm sm:p-10"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright"
      >
        <X size={20} aria-hidden="true" />
      </button>

      {/* Prev / next — hidden on mobile where swipe-free tap zones are
          tight; the image itself remains tappable to advance. */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright sm:left-6"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-wheat-bright hover:text-wheat-bright sm:right-6"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </>
      )}

      <figure
        className="flex max-h-full w-full max-w-4xl flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/15 sm:aspect-[16/10]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 896px) 896px, 100vw"
            className="object-contain"
            // The lightbox starts closed; the mounted image is the one
            // being viewed. No priority — it opens on user intent.
          />
        </div>
        <figcaption className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/80">
          {photo.caption}
        </figcaption>
        <p className="mt-1 text-xs tabular-nums text-white/40">
          {index + 1} / {photos.length}
        </p>
      </figure>
    </div>,
    document.body,
  );
}
