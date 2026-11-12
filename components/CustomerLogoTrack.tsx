"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

export default function CustomerLogoTrack({ children, pauseLabel, playLabel }: { children: ReactNode; pauseLabel: string; playLabel: string }) {
  const [paused, setPaused] = useState(false);
  return <div className="sg-customers mt-10 pb-12 sm:pb-16">
    <div className="sg-customer-window">
      <div className="sg-customer-track" style={{animationPlayState: paused ? "paused" : undefined}}>{children}</div>
    </div>
    <div className="sg-customer-controls mt-5 text-center">
      <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-pine/25 bg-white px-4 text-sm font-medium text-pine hover:border-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine">
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}{paused ? playLabel : pauseLabel}
      </button>
    </div>
  </div>;
}
