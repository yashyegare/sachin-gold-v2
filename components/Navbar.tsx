"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { primaryNav } from "@/data/navigation";
import { company } from "@/data/company";

/**
 * Site header / primary navigation.
 *
 * Replaces the header markup that was previously copy-pasted into all
 * ~10 HTML pages. Nav structure comes from `data/navigation.ts`, so
 * adding or renaming a service updates every page that renders this
 * component.
 */
export default function Navbar() {
  const pathname = usePathname();
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

  // Close the mobile panel on route change.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile panel is open — the page behind a
  // full-width menu shouldn't scroll.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      {/* Top hairline in brand gold — a quiet premium cue. */}
      <div className="h-0.5 w-full bg-gradient-to-r from-pine-deep via-wheat to-pine-deep" aria-hidden="true" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Wordmark in brand gold — the real logo file returns once a
            redesigned mark is provided. */}
        <Link
          href="/"
          className="shrink-0 font-display text-2xl font-bold tracking-tight text-wheat transition-opacity hover:opacity-80"
          aria-label={`${company.name} — home`}
        >
          {company.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm">
            {primaryNav.map((item) => {
              if (item.children) {
                return (
                  <li
                    key={item.href}
                    ref={servicesRef}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <button
                      type="button"
                      ref={servicesButtonRef}
                      className={`flex items-center gap-1 rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine aria-expanded:bg-linen aria-expanded:text-pine ${
                        pathname.startsWith(item.href)
                          ? "font-semibold text-pine"
                          : "font-medium text-ink/75"
                      }`}
                      aria-expanded={servicesOpen}
                      aria-haspopup="true"
                      aria-controls="services-dropdown"
                      onClick={() => setServicesOpen((open) => !open)}
                    >
                      {item.label}
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
                        <div className="rounded-sm border border-ink/10 bg-white p-2 shadow-[0_12px_32px_-12px_rgba(22,35,28,0.18)]">
                          <ul className="grid grid-cols-1 gap-0.5">
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  aria-current={
                                    isActive(child.href) ? "page" : undefined
                                  }
                                  className={`block rounded-sm px-4 py-3 transition-colors hover:bg-linen hover:text-pine ${
                                    isActive(child.href)
                                      ? "text-pine"
                                      : "text-ink/80"
                                  }`}
                                >
                                  <span className="block text-sm font-medium">
                                    {child.label}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative rounded-sm px-3 py-2 transition-colors hover:bg-linen hover:text-pine ${
                      isActive(item.href)
                        ? "font-semibold text-pine"
                        : "font-medium text-ink/75"
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-wheat"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            className="whitespace-nowrap text-sm font-medium tabular-nums text-ink/70 transition-colors hover:text-pine"
          >
            {company.phone}
          </a>
          <Link
            href="/contact"
            className={`whitespace-nowrap rounded-sm px-5 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-8px_rgba(10,54,32,0.5)] transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_-8px_rgba(10,54,32,0.55)] ${
              isActive("/contact") ? "bg-pine-deep" : "bg-pine"
            }`}
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
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

      {/* Mobile panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="animate-fade-in max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-white lg:hidden"
        >
          <ul className="flex flex-col divide-y divide-ink/10 px-6 pb-4">
            {primaryNav.map((item) => (
              <li key={item.href} className="py-1">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block py-3 text-base ${
                    isActive(item.href) ? "text-pine" : "text-ink/80"
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="pb-2 pl-4">
                    {item.children
                      .filter((child) => child.href !== item.href)
                      .map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={
                              isActive(child.href) ? "page" : undefined
                            }
                            className={`block py-2 text-sm hover:text-pine ${
                              isActive(child.href)
                                ? "text-pine"
                                : "text-ink/60"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="py-4">
              <Link
                href="/contact"
                className="block rounded-sm bg-pine px-4 py-3 text-center text-sm font-medium text-white"
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
