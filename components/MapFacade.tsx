"use client";

import { useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";

/**
 * Click-to-load map. A live Google embed paints as a gray box with a
 * spinner for as long as its tiles are in flight, and drags a few hundred
 * kilobytes of third-party JS into every page view. So the poster carries
 * the address and the promise, and the iframe only mounts once someone
 * asks for it — nothing to wait on until it is actually wanted.
 */
export default function MapFacade({
  embedSrc,
  title,
  address,
  loadLabel,
}: {
  embedSrc: string;
  title: string;
  address?: string;
  loadLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={embedSrc}
        title={title}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[380px] w-full border-0"
      />
    );
  }

  return (
    <div className="grain-dark relative flex h-[380px] flex-col items-center justify-center gap-4 bg-pine-deep px-6 text-center">
      <MapPin size={26} className="text-wheat" aria-hidden="true" />
      {address && (
        <p className="max-w-sm text-sm leading-relaxed text-white/80">
          {address}
        </p>
      )}
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-wheat px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:-translate-y-px hover:bg-wheat-bright hover:shadow-elevated"
      >
        {loadLabel}
        <ArrowRight
          size={15}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  );
}
