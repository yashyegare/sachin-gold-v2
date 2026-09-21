"use client";

import { usePathname as useNextPathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname as useI18nPathname } from "@/i18n/navigation";
import { localeNames, routing, type Locale } from "@/i18n/routing";
import { company } from "@/data/company";

const companyPhoneDisplay = company.phone;
const companyPhoneDial = company.phone.replace(/[^+\d]/g, "");

/**
 * The language switcher — swaps locale while staying on the same page.
 * Uses next-intl's usePathname so service detail pages keep their slug:
 * switching language inside /services/oil-extraction lands on /hi/services/
 * oil-extraction, not back at a generic page.
 *
 * Dropdown closes on outside click / focus-out / Escape, and on route
 * change (the shared close-on-navigate effect below).
 */
function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = useI18nPathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        buttonRef.current?.focus();
        setOpen(false);
      }
    }
    function handleFocusIn(event: FocusEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t("language")}
        className="flex items-center gap-1.5 rounded-sm px-2.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-linen hover:text-pine aria-expanded:bg-linen aria-expanded:text-pine"
      >
        <Globe size={15} strokeWidth={1.5} aria-hidden="true" />
        <span className="hidden xl:inline">{localeNames[locale]}</span>
        <ChevronDown
          size={13}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="animate-fade-in absolute right-0 top-full w-44 rounded-sm border border-ink/10 bg-white p-1.5 shadow-elevated-sm">
          {routing.locales.map((code) => (
            <li key={code}>
              <Link
                href={pathname}
                locale={code}
                onClick={() => setOpen(false)}
                aria-current={code === locale ? "true" : undefined}
                className={`block rounded-sm px-3 py-2 text-sm transition-colors hover:bg-linen hover:text-pine ${
                  code === locale
                    ? "font-semibold text-pine"
                    : "text-ink/75"
                }`}
              >
                {localeNames[code]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Site header / primary navigation.
 *
 * Nav labels come from the message catalogs (translated); the structure —
 * which pages exist, which services have children — lives in the component
 * itself. Links use next-intl's locale-aware Link so the active language
 * is preserved across navigation.
 */
export default function Navbar() {
  const t = useTranslations("nav");
  const nextPathname = useNextPathname();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesButtonRef = useRef<HTMLButtonElement>(null);

  // Close the services dropdown on outside click or Escape.
  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // Return focus to the trigger when the dropdown was open — otherwise
        // focus dangles where it was and keyboard users lose their place.
        if (servicesOpen) servicesButtonRef.current?.focus();
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }
    // Tab out of the open dropdown must close it too (mousedown-only close
    // misses keyboard users). Runs on capture to see focusout before focus
    // moves into the mobile panel or elsewhere.
    function handleFocusIn(event: FocusEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("focusin", handleFocusIn);
    };
    // servicesOpen is read by the Escape handler to decide whether to return
    // focus — keep it fresh without re-binding listeners every toggle.
  }, [servicesOpen]);

  // Close both panels on route change.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [nextPathname]);

  // Lock body scroll while the mobile panel is open — the page behind a
  // full-width menu shouldn't scroll.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    return href === "/" ? nextPathname === "/" : nextPathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      {/* Top hairline in brand gold — a quiet premium cue. */}
      <div
        className="h-0.5 w-full bg-gradient-to-r from-pine-deep via-wheat to-pine-deep"
        aria-hidden="true"
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* The mark + wordmark — the simplified grain-sheaf badge (flat
            pine/gold, public/sg-mark.svg), replacing the ornate gold-foil
            logo that fought the site's restrained system. */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Sachin Gold — home"
        >
          <Image
            src="/sg-mark.svg"
            alt=""
            width={34}
            height={34}
            className="rounded-[7px] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-xl font-bold tracking-tight text-pine transition-colors group-hover:text-pine-deep">
            Sachin <span className="text-wheat">Gold</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm">
            <li>
              <Link
                href="/"
                aria-current={isActive("/") ? "page" : undefined}
                className={`relative rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine ${
                  isActive("/")
                    ? "font-semibold text-pine"
                    : "font-medium text-ink/75"
                }`}
              >
                {t("home")}
                {isActive("/") && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-wheat"
                  />
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                aria-current={isActive("/about") ? "page" : undefined}
                className={`relative rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine ${
                  isActive("/about")
                    ? "font-semibold text-pine"
                    : "font-medium text-ink/75"
                }`}
              >
                {t("about")}
                {isActive("/about") && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-wheat"
                  />
                )}
              </Link>
            </li>
            <li
              ref={servicesRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                ref={servicesButtonRef}
                className={`flex items-center gap-1 rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine aria-expanded:bg-linen aria-expanded:text-pine ${
                  nextPathname.startsWith("/services")
                    ? "font-semibold text-pine"
                    : "font-medium text-ink/75"
                }`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                aria-controls="services-dropdown"
                onClick={() => setServicesOpen((open) => !open)}
              >
                {t("services")}
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {servicesOpen && (
                <div
                  id="services-dropdown"
                  className="animate-fade-in absolute left-1/2 top-full w-[30rem] -translate-x-1/2 pt-3"
                >
                  <div className="rounded-sm border border-ink/10 bg-white p-2 shadow-elevated-sm">
                    <ul className="grid grid-cols-1 gap-0.5">
                      <li>
                        <Link
                          href="/services"
                          onClick={() => setServicesOpen(false)}
                          className="block rounded-sm px-4 py-3 text-sm font-medium text-ink/80 transition-colors hover:bg-linen hover:text-pine"
                        >
                          {t("servicesOverview")}
                        </Link>
                      </li>
                      {[
                        "commodity-trading",
                        "pulses-processing",
                        "oil-extraction",
                        "cold-storage",
                        "logistics",
                      ].map((slug) => (
                        <li key={slug}>
                          <Link
                            href={`/services/${slug}`}
                            onClick={() => setServicesOpen(false)}
                            aria-current={
                              nextPathname === `/services/${slug}`
                                ? "page"
                                : undefined
                            }
                            className={`block rounded-sm px-4 py-3 transition-colors hover:bg-linen hover:text-pine ${
                              nextPathname === `/services/${slug}`
                                ? "text-pine"
                                : "text-ink/80"
                            }`}
                          >
                            <span className="block text-sm font-medium">
                              {t(`serviceSlugs.${slug}`)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link
                href="/rates"
                aria-current={isActive("/rates") ? "page" : undefined}
                className={`relative rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine ${
                  isActive("/rates")
                    ? "font-semibold text-pine"
                    : "font-medium text-ink/75"
                }`}
              >
                {t("rates")}
                {isActive("/rates") && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-wheat"
                  />
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={`relative rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine ${
                  isActive("/contact")
                    ? "font-semibold text-pine"
                    : "font-medium text-ink/75"
                }`}
              >
                {t("contact")}
                {isActive("/contact") && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-wheat"
                  />
                )}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <a
            href={`tel:${companyPhoneDial}`}
            className="whitespace-nowrap text-sm font-medium tabular-nums text-ink/70 transition-colors hover:text-pine"
          >
            {companyPhoneDisplay}
          </a>
          <Link
            href="/contact"
            className={`whitespace-nowrap rounded-sm px-5 py-2.5 text-sm font-semibold text-white shadow-elevated-sm transition-all hover:-translate-y-px hover:shadow-elevated ${
              isActive("/contact") ? "bg-pine-deep" : "bg-pine"
            }`}
          >
            {t("cta")}
          </Link>
        </div>

        {/* Mobile: language + toggle */}
        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? t("close") : t("menu")}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-ink transition-transform ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[1.5px] w-full bg-ink transition-opacity ${
                  mobileOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[1.5px] w-full bg-ink transition-transform ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="animate-fade-in max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-white lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-ink/10 px-6 pb-4">
            <li className="py-1">
              <Link
                href="/"
                aria-current={isActive("/") ? "page" : undefined}
                className={`block py-3 text-base ${
                  isActive("/") ? "text-pine" : "text-ink/80"
                }`}
              >
                {t("home")}
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/about"
                aria-current={isActive("/about") ? "page" : undefined}
                className={`block py-3 text-base ${
                  isActive("/about") ? "text-pine" : "text-ink/80"
                }`}
              >
                {t("about")}
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/services"
                aria-current={isActive("/services") ? "page" : undefined}
                className={`block py-3 text-base ${
                  isActive("/services") ? "text-pine" : "text-ink/80"
                }`}
              >
                {t("services")}
              </Link>
              <ul className="pb-2 pl-4">
                {[
                  "commodity-trading",
                  "pulses-processing",
                  "oil-extraction",
                  "cold-storage",
                  "logistics",
                ].map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      aria-current={
                        nextPathname === `/services/${slug}` ? "page" : undefined
                      }
                      className={`block py-2 text-sm ${
                        nextPathname === `/services/${slug}`
                          ? "text-pine"
                          : "text-ink/60 hover:text-pine"
                      }`}
                    >
                      {t(`serviceSlugs.${slug}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="py-1">
              <Link
                href="/rates"
                aria-current={isActive("/rates") ? "page" : undefined}
                className={`block py-3 text-base ${
                  isActive("/rates") ? "text-pine" : "text-ink/80"
                }`}
              >
                {t("rates")}
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={`block py-3 text-base ${
                  isActive("/contact") ? "text-pine" : "text-ink/80"
                }`}
              >
                {t("contact")}
              </Link>
            </li>
            <li className="py-4">
              <Link
                href="/contact"
                className="block rounded-sm bg-pine px-4 py-3 text-center text-sm font-medium text-white"
              >
                {t("cta")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
