"use client";

import Image from "next/image";
import { Play, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

/** Local poster first; YouTube is contacted only after an explicit play action. */
export default function FacilityVideo() {
  const t = useTranslations("about");
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (playing) frameRef.current?.focus();
  }, [playing]);

  return (
    <figure
      data-facility-video
      className="min-w-0 overflow-hidden rounded-md border border-ink/15 bg-white shadow-elevated-lg"
    >
      <div className="relative aspect-video bg-ink">
        {playing ? (
          <iframe
            ref={frameRef}
            src="https://www.youtube-nocookie.com/embed/v8zIFCYXlDs?autoplay=1&playsinline=1&rel=0"
            title={t("videoSr")}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={t("videoCaption")}
            className="group absolute inset-0 block h-full w-full overflow-hidden text-white focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-wheat"
          >
            <Image
              src="/images/facility/facility-tour-poster.webp"
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10"
            />
            <span
              aria-hidden="true"
              className="absolute left-4 top-4 flex items-center gap-1.5 rounded-sm bg-black/65 px-2.5 py-1.5 text-xs font-semibold"
            >
              <Play size={12} fill="currentColor" />
              YouTube
            </span>
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-pine shadow-lg transition-colors group-hover:bg-pine-deep group-focus-visible:bg-pine-deep sm:h-20 sm:w-20"
            >
              <Play size={30} fill="currentColor" className="ml-1" />
            </span>
            <span className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 text-left text-sm font-semibold leading-snug sm:px-5 sm:pb-5 sm:text-base">
              {t("videoCaption")}
            </span>
          </button>
        )}
      </div>
      <figcaption className="border-t border-ink/10 px-4 py-3">
        <a
          href="https://youtu.be/v8zIFCYXlDs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-pine underline-offset-4 hover:underline"
        >
          {t("videoSr")}
          <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
