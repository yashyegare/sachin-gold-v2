import { track } from "@vercel/analytics";
import {
  routeContext,
  failureProperties,
  type FailureReason,
  type ConversionName,
} from "./conversion-events";
export function trackConversion(
  name: ConversionName,
  source: string = "form",
  reason?: FailureReason,
) {
  if (
    typeof window === "undefined" ||
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  )
    return;
  try {
    track(name, {
      ...routeContext(window.location.pathname),
      source,
      ...failureProperties(reason),
    });
  } catch {
    // Analytics availability must never interrupt an enquiry or navigation.
  }
}
