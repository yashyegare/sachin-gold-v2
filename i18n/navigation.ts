import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware replacements for next/link and next/navigation — every
 * internal link in the site must use these so the active locale is
 * preserved across navigation. External links (WhatsApp, tel, maps)
 * stay plain <a>.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
