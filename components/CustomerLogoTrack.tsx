import type { ReactNode } from "react";

export default function CustomerLogoTrack({ children }: { children: ReactNode }) {
  return <div className="sg-customers mt-10 pb-14 sm:mt-12 sm:pb-20">
    <div className="sg-customer-window">
      <div className="sg-customer-track">{children}</div>
    </div>
  </div>;
}
