import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * Loads the message catalog for the requested locale. Deep long-tail
 * strings (privacy prose, product one-liners) are not yet translated —
 * English fallback keeps those pages functional in every locale instead
 * of erroring, and each new translation is pure data entry from here.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
